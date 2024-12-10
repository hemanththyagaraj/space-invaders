var m = Object.defineProperty;
var u = (r, e, t) =>
  e in r
    ? m(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
    : (r[e] = t);
var i = (r, e, t) => u(r, typeof e != "symbol" ? e + "" : e, t);
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) h(s);
  new MutationObserver((s) => {
    for (const o of s)
      if (o.type === "childList")
        for (const c of o.addedNodes)
          c.tagName === "LINK" && c.rel === "modulepreload" && h(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(s) {
    const o = {};
    return (
      s.integrity && (o.integrity = s.integrity),
      s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (o.credentials = "omit")
        : (o.credentials = "same-origin"),
      o
    );
  }
  function h(s) {
    if (s.ep) return;
    s.ep = !0;
    const o = t(s);
    fetch(s.href, o);
  }
})();
const n = {
    CANVAS_WIDTH: window.innerWidth - 50,
    CANVAS_HEIGHT: window.innerHeight - 50,
    PLAYER_WIDTH: 90,
    PLAYER_HEIGHT: 90,
    PLAYER_SPEED: 20,
    ENEMY_WIDTH: 100,
    ENEMY_HEIGHT: 100,
    ENEMY_ROWS_COUNT: 2,
    ENEMY_COLUMNS_COUNT: 8,
    ENEMY_SPEED: 0.2,
    VERTICAL_GAP_BETWEEN_ENEMIES: 30,
    PROJECTILE_SPEED: 5,
    PROJECTILE_WIDTH: 80,
    PROJECTILE_HEIGHT: 80,
  },
  l = async (r) =>
    new Promise((e, t) => {
      const h = new Image();
      (h.src = r),
        h.addEventListener("load", () => e(h)),
        h.addEventListener("error", () => t("Failed to load image"));
    });
class g {
  constructor(e, t) {
    i(this, "x");
    i(this, "y");
    i(this, "width", n.ENEMY_WIDTH);
    i(this, "height", n.ENEMY_HEIGHT);
    i(this, "speed", n.ENEMY_SPEED);
    i(this, "image", null);
    i(this, "destroyImage", null);
    i(this, "destroyedTime", 0);
    i(this, "explosionDuration", 200);
    i(this, "isDestroyed", !1);
    (this.x = e), (this.y = t), this.loadEnemyImage(), this.loadDestroyImage();
  }
  async loadEnemyImage() {
    try {
      const e = await l("src/assets/ufo.png");
      this.image = e;
    } catch {
      this.image = null;
    }
  }
  async loadDestroyImage() {
    try {
      const e = await l("src/assets/explode.png");
      this.destroyImage = e;
    } catch {
      this.destroyImage = null;
    }
  }
  update(e) {
    if (this.isDestroyed) {
      this.destroyedTime += e;
      return;
    }
    this.y += this.speed;
  }
  render(e) {
    if (this.isDestroyed && this.destroyImage)
      return e.drawImage(
        this.destroyImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    this.image &&
      e.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  destroy() {
    (this.isDestroyed = !0), (this.destroyedTime = 0);
  }
  shouldRemove() {
    return this.isDestroyed && this.destroyedTime >= this.explosionDuration;
  }
}
class y {
  constructor(e, t) {
    i(this, "x");
    i(this, "y");
    i(this, "width", n.PROJECTILE_WIDTH);
    i(this, "height", n.PROJECTILE_HEIGHT);
    i(this, "speed", n.PROJECTILE_SPEED);
    i(this, "image", null);
    i(this, "hit", !1);
    (this.x = e), (this.y = t), this.loadProjectileImage();
  }
  async loadProjectileImage() {
    try {
      const e = await l("src/assets/bullet.png");
      this.image = e;
    } catch {
      this.image = null;
    }
  }
  markAsHit() {
    this.hit = !0;
  }
  isHit() {
    return this.hit;
  }
  update() {
    return (this.y -= this.speed), this.y + this.height > 0;
  }
  render(e) {
    this.image &&
      e.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
const T = (r, e) =>
    r.x + r.width > e.x &&
    r.y + r.height > e.y &&
    r.x < e.x + e.width &&
    r.y < e.y + e.height,
  a = {
    PLAYER_MOVE: "PLAYER_MOVE",
    PLAYER_SHOOT: "PLAYER_SHOOT",
    INPUT_SHOOT: "INPUT_SHOOT",
    SCORE_UPDATE: "SCORE_UPDATE",
  };
class _ {
  constructor({ canvas: e, context: t, player: h, eventEmitter: s }) {
    i(this, "canvas");
    i(this, "context");
    i(this, "eventEmitter");
    i(this, "player");
    i(this, "enemies", []);
    i(this, "projectiles", []);
    i(this, "running");
    i(this, "lastFrameTime", performance.now());
    i(this, "score", 0);
    (this.canvas = e),
      (this.context = t),
      (this.player = h),
      (this.eventEmitter = s),
      (this.running = !1),
      s.on(a.PLAYER_SHOOT, this.addProjectiles.bind(this)),
      s.on(a.SCORE_UPDATE, this.updateScore.bind(this)),
      this.spawnEnemies();
  }
  spawnEnemies() {
    const e = n.ENEMY_COLUMNS_COUNT * n.ENEMY_WIDTH,
      h = (n.CANVAS_WIDTH - e) / (n.ENEMY_COLUMNS_COUNT + 1);
    for (let s = 0; s < n.ENEMY_ROWS_COUNT; s++)
      for (let o = 0; o < n.ENEMY_COLUMNS_COUNT; o++) {
        const c = h * (o + 1) + n.ENEMY_WIDTH * o,
          d = n.VERTICAL_GAP_BETWEEN_ENEMIES * (s + 1) + n.ENEMY_HEIGHT * s,
          E = new g(c, d);
        this.enemies.push(E);
      }
  }
  addProjectiles({ x: e, y: t }) {
    this.projectiles.push(new y(e, t));
  }
  start() {
    (this.running = !0), this.loop();
  }
  stop() {
    this.running = !1;
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  renderPlayer() {
    this.player.render(this.context);
  }
  updateAndRenderProjectiles() {
    this.projectiles = this.projectiles.filter((e) => {
      const t = e.update();
      return (
        t && e.render(this.context),
        this.checkProjectileCollisions(e),
        t && !this.isProjectileHit(e)
      );
    });
  }
  checkProjectileCollisions(e) {
    this.enemies = this.enemies.filter((t) =>
      T({ ...e }, { ...t })
        ? (e.markAsHit(),
          t.destroy(),
          this.eventEmitter.emit(a.SCORE_UPDATE, 20),
          !0)
        : !t.shouldRemove()
    );
  }
  isProjectileHit(e) {
    return e.isHit();
  }
  updateAndRenderEnemies(e) {
    this.enemies = this.enemies.filter(
      (t) => (t.update(e), t.render(this.context), !t.shouldRemove())
    );
  }
  updateScore(e) {
    this.score += e;
  }
  displayScore() {
    (this.context.fillStyle = "white"),
      (this.context.font = '20px "Press Start 2P"'),
      this.context.fillText(`Score: ${this.score}`, n.CANVAS_WIDTH - 200, 30);
  }
  checkGameOver() {
    return this.enemies.some(
      (e) => e.y + n.ENEMY_HEIGHT > n.CANVAS_HEIGHT - n.PLAYER_HEIGHT
    );
  }
  endGame(e) {
    this.running = !1;
    const t = e ? "You Win!" : "Game Over";
    (this.context.fillStyle = "white"),
      (this.context.font = '40px "Press Start 2P"'),
      (this.context.textAlign = "center"),
      this.context.fillText(t, this.canvas.width / 2, this.canvas.height / 2);
  }
  checkWinCondition() {
    return this.enemies.length === 0;
  }
  loop() {
    if (!this.running) return;
    if (this.checkGameOver()) {
      this.endGame(!1);
      return;
    }
    if (this.checkWinCondition()) {
      this.endGame(!0);
      return;
    }
    const t = performance.now(),
      h = t - this.lastFrameTime;
    (this.lastFrameTime = t),
      this.clearCanvas(),
      this.renderPlayer(),
      this.updateAndRenderEnemies(h),
      this.updateAndRenderProjectiles(),
      this.displayScore(),
      requestAnimationFrame(() => this.loop());
  }
}
class p {
  constructor(e) {
    i(this, "x");
    i(this, "y");
    i(this, "width", n.PLAYER_WIDTH);
    i(this, "height", n.PLAYER_HEIGHT);
    i(this, "image", null);
    i(this, "eventEmitter");
    (this.x = n.CANVAS_WIDTH / 2 - this.width / 2),
      (this.y = n.CANVAS_HEIGHT - this.height),
      (this.eventEmitter = e),
      e.on(a.PLAYER_MOVE, this.move.bind(this)),
      e.on(a.INPUT_SHOOT, this.shoot.bind(this)),
      this.loadPlayerImage();
  }
  async loadPlayerImage() {
    try {
      const e = await l("src/assets/spaceship.png");
      this.image = e;
    } catch {
      this.image = null;
    }
  }
  move(e) {
    e === "left"
      ? (this.x -= n.PLAYER_SPEED)
      : e === "right" && (this.x += n.PLAYER_SPEED),
      (this.x = Math.max(0, Math.min(this.x, n.CANVAS_WIDTH - this.width)));
  }
  shoot() {
    const e = this.x + this.width / 2 - n.PROJECTILE_WIDTH / 2,
      t = this.y;
    this.eventEmitter.emit(a.PLAYER_SHOOT, { x: e, y: t });
  }
  async render(e) {
    this.image &&
      e.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
class I {
  constructor() {
    i(this, "events", {});
  }
  on(e, t) {
    var h, s, o;
    (h = this.events) != null && h[e]
      ? (s = this.events) == null || s[e].push(t)
      : ((this.events[e] = []), (o = this.events) == null || o[e].push(t));
  }
  off(e) {
    delete this.events[e];
  }
  emit(e, t) {
    var h;
    (h = this.events[e]) == null || h.forEach((s) => s(t));
  }
}
class P {
  constructor(e) {
    i(this, "eventEmitter");
    this.eventEmitter = e;
  }
  listen() {
    window.addEventListener("keydown", (e) => {
      const { key: t } = e;
      switch (t) {
        case "ArrowRight":
          this.eventEmitter.emit(a.PLAYER_MOVE, "right");
          break;
        case "ArrowLeft":
          this.eventEmitter.emit(a.PLAYER_MOVE, "left");
          break;
        case " ":
          this.eventEmitter.emit(a.INPUT_SHOOT);
          break;
      }
    });
  }
}
const f = () => {
  const r = document.querySelector(".space__invader-canvas"),
    e = r.getContext("2d");
  (r.width = n.CANVAS_WIDTH), (r.height = n.CANVAS_HEIGHT);
  const t = new I(),
    h = new p(t);
  new P(t).listen(),
    new _({ canvas: r, context: e, player: h, eventEmitter: t }).start();
};
window.onload = f;
