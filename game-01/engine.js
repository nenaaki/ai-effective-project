/* =============================================================
 * engine.js — 3Dゲームエンジン中核
 *   - Three.js のシーン/カメラ/レンダラ初期化
 *   - 固定タイムステップの物理ループ（重力・地面衝突・反発・摩擦）
 *   - 球同士の衝突：同じ mergeKey なら結合（体積を合算）、
 *                    異なれば「滑る」衝突応答で押し合う
 *   - 軌道カメラ操作（ドラッグ回転 / ホイールズーム）
 * ゲーム固有のロジック（色・見た目）は game.js 側に置く。
 * =========================================================== */

(function (global) {
  'use strict';

  const GRAVITY = -18;        // m/s^2（見栄え重視のややデフォルメ値）
  const FIXED_DT = 1 / 120;   // 物理ステップ（秒）
  const MAX_SUBSTEPS = 8;     // 1フレームで進める最大ステップ数
  const REST_SPEED = 0.6;     // これ以下の速さで支持されたら静止

  /* ---- 1つの球オブジェクト（シャボン玉） ---- */
  class Entity {
    constructor(mesh, opts = {}) {
      this.mesh = mesh;
      this.radius = opts.radius ?? 0.5;
      this.mergeKey = opts.mergeKey ?? null;   // 同値どうしは結合（色など）
      this.velocity = opts.velocity ? opts.velocity.clone() : new THREE.Vector3();
      this.restitution = opts.restitution ?? 0.2;
      this.friction = opts.friction ?? 0.8;
      this.mass = this.radius ** 3;             // 体積を質量とみなす
      this.resting = false;      // 地面/他球に落ち着いて静止したか
      this.supported = false;    // このステップで下から支えられているか
      this.alive = true;
    }
    get position() { return this.mesh.position; }
    get invMass() { return this.resting ? 0 : 1 / this.mass; }

    integrate(dt) {
      if (this.resting) return;
      this.velocity.y += GRAVITY * dt;
      this.mesh.position.addScaledVector(this.velocity, dt);
    }

    /* 地面衝突（球の底で判定） */
    resolveGround(groundY) {
      if (this.resting) return;
      const floor = groundY + this.radius;
      if (this.mesh.position.y > floor) return;
      this.mesh.position.y = floor;
      if (this.velocity.y < 0) {
        this.velocity.y = -this.velocity.y * this.restitution;
        this.velocity.x *= this.friction;
        this.velocity.z *= this.friction;
      }
      this.supported = true;
    }
  }

  /* ---- エンジン本体 ---- */
  class Engine {
    constructor(canvas) {
      this.canvas = canvas;
      this.entities = [];
      this.groundY = 0;
      this.sticky = true;          // 同色の結合を行うか
      this._accum = 0;
      this._last = 0;
      this.onUpdate = null;        // ゲーム側フック(dt)
      this.onMerge = null;         // 結合発生時フック(newEntity, [a, b])
      this.meshFactory = null;     // (radius, srcEntity) => THREE.Mesh（結合球の見た目）

      this._initRenderer();
      this._initScene();
      this._initCamera();
      this._initLights();
      this._initGround();
      this._initControls();
      this._bindResize();
    }

    _initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas, antialias: true, alpha: false,
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    _initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0b1020);
      this.scene.fog = new THREE.Fog(0x0b1020, 30, 90);
    }

    _initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        55, window.innerWidth / window.innerHeight, 0.1, 500
      );
      this.orbit = {
        target: new THREE.Vector3(0, 2, 0),
        radius: 22,
        theta: Math.PI * 0.15,
        phi: Math.PI * 0.36,
      };
      this._applyCamera();
    }

    _applyCamera() {
      const o = this.orbit;
      o.phi = Math.max(0.15, Math.min(Math.PI * 0.49, o.phi));
      o.radius = Math.max(6, Math.min(60, o.radius));
      const sinPhi = Math.sin(o.phi);
      this.camera.position.set(
        o.target.x + o.radius * sinPhi * Math.sin(o.theta),
        o.target.y + o.radius * Math.cos(o.phi),
        o.target.z + o.radius * sinPhi * Math.cos(o.theta)
      );
      this.camera.lookAt(o.target);
    }

    _initLights() {
      this.scene.add(new THREE.HemisphereLight(0xbcd0ff, 0x202840, 0.75));
      const sun = new THREE.DirectionalLight(0xffffff, 1.05);
      sun.position.set(12, 24, 10);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      const s = 30;
      sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
      sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
      sun.shadow.camera.near = 1; sun.shadow.camera.far = 80;
      this.scene.add(sun);
    }

    _initGround() {
      const geo = new THREE.PlaneGeometry(200, 200);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1a2138, roughness: 0.95, metalness: 0.0,
      });
      const ground = new THREE.Mesh(geo, mat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = this.groundY;
      ground.receiveShadow = true;
      this.scene.add(ground);

      const grid = new THREE.GridHelper(200, 80, 0x3a4670, 0x232a44);
      grid.position.y = this.groundY + 0.01;
      this.scene.add(grid);
    }

    _initControls() {
      const el = this.canvas;
      let dragging = false, px = 0, py = 0;
      el.addEventListener('pointerdown', (e) => {
        dragging = true; px = e.clientX; py = e.clientY;
        el.setPointerCapture(e.pointerId);
      });
      el.addEventListener('pointerup', () => { dragging = false; });
      el.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - px, dy = e.clientY - py;
        px = e.clientX; py = e.clientY;
        this.orbit.theta -= dx * 0.005;
        this.orbit.phi   -= dy * 0.005;
        this._applyCamera();
      });
      el.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.orbit.radius *= (1 + Math.sign(e.deltaY) * 0.08);
        this._applyCamera();
      }, { passive: false });
    }

    _bindResize() {
      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    add(entity) {
      this.entities.push(entity);
      this.scene.add(entity.mesh);
      return entity;
    }

    remove(entity) {
      entity.alive = false;
      this.scene.remove(entity.mesh);
      if (entity.mesh.material) entity.mesh.material.dispose();  // 個別マテリアルは破棄（geoは共有）
      const i = this.entities.indexOf(entity);
      if (i >= 0) this.entities.splice(i, 1);
    }

    getForward() {
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      return dir;
    }

    /* 同色2球を結合：体積を合算した1球にする（体積で重心・運動量を配分） */
    _merge(a, b) {
      const va = a.radius ** 3, vb = b.radius ** 3, vt = va + vb;
      const R = Math.cbrt(vt);
      const pa = a.mesh.position, pb = b.mesh.position;
      const pos = new THREE.Vector3(
        (pa.x * va + pb.x * vb) / vt,
        (pa.y * va + pb.y * vb) / vt,
        (pa.z * va + pb.z * vb) / vt,
      );
      const vel = new THREE.Vector3(
        (a.velocity.x * va + b.velocity.x * vb) / vt,
        (a.velocity.y * va + b.velocity.y * vb) / vt,
        (a.velocity.z * va + b.velocity.z * vb) / vt,
      );
      const mesh = this.meshFactory(R, a);
      mesh.position.copy(pos);

      const merged = new Entity(mesh, {
        radius: R, velocity: vel, mergeKey: a.mergeKey,
        restitution: a.restitution, friction: a.friction,
      });
      this.remove(a);
      this.remove(b);
      this.add(merged);
      if (this.onMerge) this.onMerge(merged, [a, b]);
      return merged;
    }

    /* 球同士の衝突：同色→結合、異色→滑る衝突応答 */
    _collide() {
      const es = this.entities;
      const done = new Set();   // 今ステップで結合済みの球
      for (let i = 0; i < es.length; i++) {
        const a = es[i];
        if (done.has(a)) continue;
        for (let j = i + 1; j < es.length; j++) {
          const b = es[j];
          if (done.has(a) || done.has(b)) continue;

          const pa = a.mesh.position, pb = b.mesh.position;
          const dx = pa.x - pb.x, dy = pa.y - pb.y, dz = pa.z - pb.z;
          const sum = a.radius + b.radius;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 >= sum * sum || d2 === 0) continue;

          // 同色なら結合（体積合算）
          if (a.mergeKey !== null && a.mergeKey === b.mergeKey) {
            this._merge(a, b);
            done.add(a); done.add(b);
            break;   // a は消えたので内側ループ終了
          }

          const d = Math.sqrt(d2);
          const overlap = sum - d;
          const nx = dx / d, ny = dy / d, nz = dz / d;   // b→a 方向の単位法線

          const invA = a.invMass, invB = b.invMass;
          const invSum = invA + invB;
          if (invSum === 0) continue;   // 両方静止

          // 位置補正（逆質量配分でめり込み解消）
          const corr = overlap / invSum;
          a.mesh.position.set(pa.x + nx * corr * invA, pa.y + ny * corr * invA, pa.z + nz * corr * invA);
          b.mesh.position.set(pb.x - nx * corr * invB, pb.y - ny * corr * invB, pb.z - nz * corr * invB);

          // 下から静止球に支えられているか
          if (b.resting && ny > 0.3) a.supported = true;
          if (a.resting && -ny > 0.3) b.supported = true;

          // 速度応答：法線方向の相対速度を打ち消す（反発なし＝表面を滑る）
          const vn = (a.velocity.x - b.velocity.x) * nx
                   + (a.velocity.y - b.velocity.y) * ny
                   + (a.velocity.z - b.velocity.z) * nz;
          if (vn < 0) {
            const jn = -vn / invSum;
            a.velocity.set(a.velocity.x + nx * jn * invA, a.velocity.y + ny * jn * invA, a.velocity.z + nz * jn * invA);
            b.velocity.set(b.velocity.x - nx * jn * invB, b.velocity.y - ny * jn * invB, b.velocity.z - nz * jn * invB);
            if (!a.resting) a.velocity.multiplyScalar(0.985);   // 接線摩擦
            if (!b.resting) b.velocity.multiplyScalar(0.985);
          }
        }
      }
    }

    /* 支えられていて十分遅ければ静止させる */
    _settle() {
      for (const e of this.entities) {
        if (!e.resting && e.supported && e.velocity.length() < REST_SPEED) {
          e.velocity.set(0, 0, 0);
          e.resting = true;
        }
      }
    }

    _step(dt) {
      for (const e of this.entities) e.supported = false;
      for (const e of this.entities) e.integrate(dt);
      if (this.sticky) this._collide();
      for (const e of this.entities) e.resolveGround(this.groundY);
      this._settle();
    }

    _physics(frameDt) {
      this._accum += Math.min(frameDt, 0.1);
      let n = 0;
      while (this._accum >= FIXED_DT && n < MAX_SUBSTEPS) {
        this._step(FIXED_DT);
        this._accum -= FIXED_DT;
        n++;
      }
    }

    _loop(t) {
      const now = t * 0.001;
      const dt = this._last ? now - this._last : 0;
      this._last = now;
      this._physics(dt);
      if (this.onUpdate) this.onUpdate(dt);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this._loop.bind(this));
    }

    start() { requestAnimationFrame(this._loop.bind(this)); }

    /* デバッグ：描画せず物理だけ指定秒数ぶん進める（ヘッドレス検証用） */
    fastForward(seconds) {
      let t = 0;
      while (t < seconds) { this._step(FIXED_DT); t += FIXED_DT; }
    }
  }

  global.GameEngine = { Engine, Entity, GRAVITY };
})(window);
