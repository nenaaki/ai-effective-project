/* =============================================================
 * game.js — シャボン玉大砲（Bubble Cannon）
 *   エンジン(engine.js)を使い、色付きシャボン玉を3D空間へ発射する。
 *   カメラの向いた方向へ弧を描いて打ち出し、
 *   ・同じ色どうしがぶつかると結合して1つの大きい球になる（体積は合算）
 *   ・違う色は結合せず、表面を滑って地面に着地する
 *   次に発射する色は HUD にプレビュー表示する。
 * =========================================================== */

(function () {
  'use strict';

  const { Engine, Entity } = window.GameEngine;

  const canvas = document.getElementById('app');
  const engine = new Engine(canvas);

  // HUD
  const $shot = document.getElementById('shotCount');
  const $landed = document.getElementById('landedCount');
  const $next = document.getElementById('nextColor');
  let shotCount = 0;

  // シャボン玉のパレット（多色。同じ色どうしだけが結合する）
  const PALETTE = [
    0xff5d73, 0xffb454, 0xffe066, 0x8ce99a,
    0x63e6be, 0x66d9ff, 0x748ffc, 0xb197fc, 0xf783ac,
  ];
  const pickColor = (i) => PALETTE[Math.floor(Math.random() * PALETTE.length)];

  let nextColor = pickColor();
  updateNextSwatch();

  function updateNextSwatch() {
    $next.style.background = '#' + nextColor.toString(16).padStart(6, '0');
  }

  // ジオメトリは使い回してGPU負荷を抑える
  const SPHERE_GEO = new THREE.SphereGeometry(1, 32, 24);

  function makeBubbleMaterial(color) {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.0, roughness: 0.08,
      transmission: 0.55, thickness: 0.6,
      transparent: true, opacity: 0.9,
      clearcoat: 1.0, clearcoatRoughness: 0.15,
      envMapIntensity: 1.0,
    });
  }

  function makeBubbleMesh(radius, color) {
    const mesh = new THREE.Mesh(SPHERE_GEO, makeBubbleMaterial(color));
    mesh.scale.setScalar(radius);
    mesh.castShadow = true;
    return mesh;
  }

  // 結合球の見た目：元の球と同じ色で新半径のメッシュを作る
  engine.meshFactory = (radius, src) => makeBubbleMesh(radius, src.mesh.material.color.getHex());

  /* シャボン玉を1つ発射（yawで左右に振れる。デモの撒き分け用） */
  function shoot(yaw = 0) {
    const radius = 0.5 + Math.random() * 0.35;
    const color = nextColor;

    const mesh = makeBubbleMesh(radius, color);

    // 発射方向：カメラ方向を水平にyaw回転
    const forward = engine.getForward();
    if (yaw) forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).normalize();

    // 発射位置：カメラの少し前方から
    const start = engine.camera.position.clone().addScaledVector(forward, 2.0);
    start.y = Math.max(start.y, radius + 0.5);
    mesh.position.copy(start);

    // 初速：カメラ方向 + 上向き成分で弧を描かせる
    const velocity = forward.clone().multiplyScalar(16);
    velocity.y += 6;
    velocity.x += (Math.random() - 0.5) * 0.5;
    velocity.z += (Math.random() - 0.5) * 0.5;

    engine.add(new Entity(mesh, {
      radius, velocity, mergeKey: color,   // 色を結合キーに
      restitution: 0.12 + Math.random() * 0.12,
      friction: 0.8,
    }));

    shotCount++;
    $shot.textContent = shotCount;

    // 次の色を決めてプレビュー更新
    nextColor = pickColor();
    updateNextSwatch();
  }

  /* 結合した瞬間、新しい球をプチ膨らませる演出 */
  engine.onMerge = (merged) => {
    const base = merged.mesh.scale.x;
    let t = 0; const dur = 0.3;
    (function anim() {
      t += 1 / 60;
      const k = Math.min(t / dur, 1);
      const s = 1 + Math.sin(k * Math.PI) * 0.22;   // ふくらんで戻る
      merged.mesh.scale.setScalar(base * s);
      if (k < 1) requestAnimationFrame(anim);
      else merged.mesh.scale.setScalar(base);
    })();
  };

  /* HUD 更新：着地(静止した球の数) */
  engine.onUpdate = () => {
    let landed = 0;
    for (const e of engine.entities) if (e.resting) landed++;
    $landed.textContent = landed;
  };

  engine.start();

  /* ---- 入力：ドラッグと区別してクリック発射 ---- */
  let downX = 0, downY = 0, moved = false;
  canvas.addEventListener('pointerdown', (e) => {
    downX = e.clientX; downY = e.clientY; moved = false;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) moved = true;
  });
  canvas.addEventListener('pointerup', () => { if (!moved) shoot(); });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); shoot(); }
  });

  // 起動時に少し撒いておく（デモ）
  const spread = [-0.2, -0.1, 0, 0.1, 0.2];
  const ff = new URLSearchParams(location.search).get('ff');
  if (ff) {
    spread.forEach((yaw) => shoot(yaw));
    engine.fastForward(parseFloat(ff));
  } else {
    spread.forEach((yaw, i) => setTimeout(() => shoot(yaw), 300 + i * 220));
  }
})();
