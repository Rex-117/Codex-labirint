(() => {
  // node_modules/@vercel/analytics/dist/index.mjs
  var initQueue = () => {
    if (window.va) return;
    window.va = function a(...params) {
      if (!window.vaq) window.vaq = [];
      window.vaq.push(params);
    };
  };
  var name = "@vercel/analytics";
  var version = "2.0.1";
  function isBrowser() {
    return typeof window !== "undefined";
  }
  function detectEnvironment() {
    try {
      const env = "development";
      if (env === "development" || env === "test") {
        return "development";
      }
    } catch {
    }
    return "production";
  }
  function setMode(mode = "auto") {
    if (mode === "auto") {
      window.vam = detectEnvironment();
      return;
    }
    window.vam = mode;
  }
  function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
  }
  function isDevelopment() {
    return getMode() === "development";
  }
  function getScriptSrc(props) {
    if (props.scriptSrc) {
      return makeAbsolute(props.scriptSrc);
    }
    if (isDevelopment()) {
      return "https://va.vercel-scripts.com/v1/script.debug.js";
    }
    if (props.basePath) {
      return makeAbsolute(`${props.basePath}/insights/script.js`);
    }
    return "/_vercel/insights/script.js";
  }
  function loadProps(explicitProps, confString) {
    var _a;
    let props = explicitProps;
    if (confString) {
      try {
        props = {
          ...(_a = JSON.parse(confString)) == null ? void 0 : _a.analytics,
          ...explicitProps
        };
      } catch {
      }
    }
    setMode(props.mode);
    const dataset = {
      sdkn: name + (props.framework ? `/${props.framework}` : ""),
      sdkv: version
    };
    if (props.disableAutoTrack) {
      dataset.disableAutoTrack = "1";
    }
    if (props.viewEndpoint) {
      dataset.viewEndpoint = makeAbsolute(props.viewEndpoint);
    }
    if (props.eventEndpoint) {
      dataset.eventEndpoint = makeAbsolute(props.eventEndpoint);
    }
    if (props.sessionEndpoint) {
      dataset.sessionEndpoint = makeAbsolute(props.sessionEndpoint);
    }
    if (isDevelopment() && props.debug === false) {
      dataset.debug = "false";
    }
    if (props.dsn) {
      dataset.dsn = props.dsn;
    }
    if (props.endpoint) {
      dataset.endpoint = props.endpoint;
    } else if (props.basePath) {
      dataset.endpoint = makeAbsolute(`${props.basePath}/insights`);
    }
    return {
      beforeSend: props.beforeSend,
      src: getScriptSrc(props),
      dataset
    };
  }
  function makeAbsolute(url) {
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") ? url : `/${url}`;
  }
  function inject(props = {
    debug: true
  }, confString) {
    var _a;
    if (!isBrowser()) return;
    const { beforeSend, src, dataset } = loadProps(props, confString);
    initQueue();
    if (beforeSend) {
      (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", beforeSend);
    }
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    for (const [key, value] of Object.entries(dataset)) {
      script.dataset[key] = value;
    }
    script.defer = true;
    script.onerror = () => {
      const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
      console.log(
        `[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`
      );
    };
    document.head.appendChild(script);
  }

  // src/game.js
  (() => {
    "use strict";
    const canvas = document.getElementById("mazeCanvas");
    const ctx = canvas.getContext("2d");
    const elements = {
      frame: document.getElementById("mazeFrame"),
      time: document.getElementById("timeValue"),
      hp: document.getElementById("hpValue"),
      healthBar: document.getElementById("healthBar"),
      healthBlock: document.querySelector(".health-block"),
      condition: document.getElementById("conditionValue"),
      keys: document.getElementById("keysValue"),
      keysTotal: document.getElementById("keysTotal"),
      ammo: document.getElementById("ammoValue"),
      ammoBlock: document.querySelector(".ammo-block"),
      shootButton: document.getElementById("shootButton"),
      shootHudButton: document.getElementById("shootHudButton"),
      hints: document.getElementById("hintsValue"),
      hintButton: document.getElementById("hintButton"),
      newMazeButton: document.getElementById("newMazeButton"),
      soundButton: document.getElementById("soundButton"),
      soundLabel: document.getElementById("soundLabel"),
      startPrompt: document.getElementById("startPrompt"),
      threatBlock: document.getElementById("threatBlock"),
      threat: document.getElementById("threatValue"),
      dangerBanner: document.getElementById("dangerBanner"),
      damageFlash: document.getElementById("damageFlash"),
      objectiveIndex: document.getElementById("objectiveIndex"),
      objectiveTitle: document.getElementById("objectiveTitle"),
      objectiveCopy: document.getElementById("objectiveCopy"),
      stepExplore: document.getElementById("stepExplore"),
      stepKeys: document.getElementById("stepKeys"),
      stepExit: document.getElementById("stepExit"),
      keyStepCount: document.getElementById("keyStepCount"),
      best: document.getElementById("bestValue"),
      bestDifficulty: document.getElementById("bestDifficulty"),
      winModal: document.getElementById("winModal"),
      gameOverModal: document.getElementById("gameOverModal"),
      closeModalButton: document.getElementById("closeModalButton"),
      playAgainButton: document.getElementById("playAgainButton"),
      restartButton: document.getElementById("restartButton"),
      finalTime: document.getElementById("finalTime"),
      finalDamage: document.getElementById("finalDamage"),
      finalCondition: document.getElementById("finalCondition"),
      winMessage: document.getElementById("winMessage"),
      newRecord: document.getElementById("newRecord"),
      deathKeys: document.getElementById("deathKeys"),
      deathTime: document.getElementById("deathTime"),
      deathEnemies: document.getElementById("deathEnemies"),
      deathMessage: document.getElementById("deathMessage"),
      toast: document.getElementById("toast")
    };
    const DIFFICULTIES = {
      wander: { label: "Uneasy", size: 10, keys: 1, enemies: 1, hazards: 1, medkits: 1, ammoPacks: 1, ammo: 6, visibility: 8, detection: 5, patrolSpeed: 940, chaseSpeed: 720, memory: 4, enemyDamage: 20, safeRadius: 3 },
      drift: { label: "Dread", size: 14, keys: 2, enemies: 2, hazards: 3, medkits: 1, ammoPacks: 1, ammo: 6, visibility: 6.5, detection: 6, patrolSpeed: 760, chaseSpeed: 590, memory: 5, enemyDamage: 25, safeRadius: 3 },
      lost: { label: "No hope", size: 18, keys: 3, enemies: 3, hazards: 6, medkits: 1, ammoPacks: 1, ammo: 7, visibility: 5.25, detection: 7, patrolSpeed: 640, chaseSpeed: 490, memory: 6, enemyDamage: 25, safeRadius: 2 }
    };
    const directions = {
      up: { dx: 0, dy: -1, wall: 0, opposite: 2 },
      right: { dx: 1, dy: 0, wall: 1, opposite: 3 },
      down: { dx: 0, dy: 1, wall: 2, opposite: 0 },
      left: { dx: -1, dy: 0, wall: 3, opposite: 1 }
    };
    const keyDirections = {
      ArrowUp: "up",
      w: "up",
      W: "up",
      ArrowRight: "right",
      d: "right",
      D: "right",
      ArrowDown: "down",
      s: "down",
      S: "down",
      ArrowLeft: "left",
      a: "left",
      A: "left"
    };
    const state = {
      difficulty: "drift",
      grid: [],
      size: 14,
      player: { x: 0, y: 0 },
      previousPlayer: { x: 0, y: 0 },
      trail: [],
      solution: [],
      keys: [],
      keysCollected: 0,
      enemies: [],
      hazards: [],
      medkits: [],
      ammoPacks: [],
      startDistances: /* @__PURE__ */ new Map(),
      visibilityDistances: /* @__PURE__ */ new Map(),
      hp: 100,
      ammo: 6,
      facing: "right",
      shotCells: [],
      shotUntil: 0,
      nextShotAt: 0,
      damageTaken: 0,
      invulnerableUntil: 0,
      explored: false,
      moves: 0,
      hints: 2,
      hintCells: [],
      hintUntil: 0,
      started: false,
      finished: false,
      gameOver: false,
      startTime: 0,
      elapsed: 0,
      sound: true,
      threat: "clear",
      moveAnimationStart: 0,
      audioContext: null,
      qaMode: false
    };
    let displaySize = 720;
    let pixelRatio = 1;
    let timerInterval = null;
    let resultTimeout = null;
    let toastTimeout = null;
    let pointerStart = null;
    function makeCell(x, y) {
      return { x, y, walls: [true, true, true, true], visited: false };
    }
    function cellKey(cell) {
      return `${cell.x},${cell.y}`;
    }
    function sameCell(a, b) {
      return Boolean(a && b && a.x === b.x && a.y === b.y);
    }
    function shuffle(items) {
      const result = [...items];
      for (let index = result.length - 1; index > 0; index -= 1) {
        const next = Math.floor(Math.random() * (index + 1));
        [result[index], result[next]] = [result[next], result[index]];
      }
      return result;
    }
    function generateMaze(size) {
      const grid = Array.from(
        { length: size },
        (_, y) => Array.from({ length: size }, (_2, x) => makeCell(x, y))
      );
      const stack = [grid[0][0]];
      grid[0][0].visited = true;
      while (stack.length) {
        const current = stack[stack.length - 1];
        const available = shuffle(Object.values(directions)).filter(({ dx, dy }) => {
          const nx = current.x + dx;
          const ny = current.y + dy;
          return nx >= 0 && ny >= 0 && nx < size && ny < size && !grid[ny][nx].visited;
        });
        if (!available.length) {
          stack.pop();
          continue;
        }
        const direction = available[0];
        const next = grid[current.y + direction.dy][current.x + direction.dx];
        current.walls[direction.wall] = false;
        next.walls[direction.opposite] = false;
        next.visited = true;
        stack.push(next);
      }
      grid.flat().forEach((cell) => {
        cell.visited = false;
      });
      return grid;
    }
    function walkableNeighbors(grid, position) {
      const cell = grid[position.y][position.x];
      return Object.entries(directions).flatMap(([name2, direction]) => {
        if (cell.walls[direction.wall]) return [];
        return [{ x: position.x + direction.dx, y: position.y + direction.dy, direction: name2 }];
      });
    }
    function findPath(grid, from, to) {
      const queue = [{ x: from.x, y: from.y }];
      const visited = /* @__PURE__ */ new Set([cellKey(from)]);
      const previous = /* @__PURE__ */ new Map();
      let head = 0;
      while (head < queue.length) {
        const current = queue[head++];
        if (sameCell(current, to)) break;
        walkableNeighbors(grid, current).forEach((next) => {
          const key = cellKey(next);
          if (!visited.has(key)) {
            visited.add(key);
            previous.set(key, current);
            queue.push({ x: next.x, y: next.y });
          }
        });
      }
      if (!visited.has(cellKey(to))) return [];
      const path = [{ x: to.x, y: to.y }];
      let cursor = { x: to.x, y: to.y };
      while (!sameCell(cursor, from)) {
        cursor = previous.get(cellKey(cursor));
        if (!cursor) return [];
        path.push(cursor);
      }
      return path.reverse();
    }
    function distanceMap(grid, from) {
      const distances = /* @__PURE__ */ new Map([[cellKey(from), 0]]);
      const queue = [{ x: from.x, y: from.y }];
      let head = 0;
      while (head < queue.length) {
        const current = queue[head++];
        const distance = distances.get(cellKey(current));
        walkableNeighbors(grid, current).forEach((next) => {
          const key = cellKey(next);
          if (!distances.has(key)) {
            distances.set(key, distance + 1);
            queue.push({ x: next.x, y: next.y });
          }
        });
      }
      return distances;
    }
    function chooseKeyLocations(count) {
      const exit = { x: state.size - 1, y: state.size - 1 };
      const candidates = state.grid.flat().filter((cell) => walkableNeighbors(state.grid, cell).length === 1).filter((cell) => !sameCell(cell, state.player) && !sameCell(cell, exit)).filter((cell) => (state.startDistances.get(cellKey(cell)) || 0) > state.size * 0.55).sort((a, b) => state.startDistances.get(cellKey(b)) - state.startDistances.get(cellKey(a)));
      const fallback = state.grid.flat().filter((cell) => !sameCell(cell, state.player) && !sameCell(cell, exit)).sort((a, b) => state.startDistances.get(cellKey(b)) - state.startDistances.get(cellKey(a)));
      const selected = [];
      for (const candidate of [...candidates, ...fallback]) {
        if (selected.some((item) => sameCell(item, candidate))) continue;
        const separated = selected.every((item) => findPath(state.grid, item, candidate).length > state.size * 0.35);
        if (separated || selected.length === 0) selected.push({ x: candidate.x, y: candidate.y, collected: false });
        if (selected.length === count) break;
      }
      return selected;
    }
    function isReserved(cell, extra = []) {
      const exit = { x: state.size - 1, y: state.size - 1 };
      return sameCell(cell, state.player) || sameCell(cell, exit) || state.keys.some((item) => sameCell(item, cell)) || extra.some((item) => sameCell(item, cell));
    }
    function createEnemies(count) {
      const config = DIFFICULTIES[state.difficulty];
      const candidates = shuffle(state.grid.flat().filter((cell) => {
        const startDistance = state.startDistances.get(cellKey(cell)) || 0;
        if (startDistance <= config.safeRadius + 5 || isReserved(cell)) return false;
        return state.keys.every((key) => findPath(state.grid, cell, key).length > 4);
      }));
      return candidates.slice(0, count).map((cell, index) => ({
        x: cell.x,
        y: cell.y,
        previous: { x: cell.x, y: cell.y },
        heading: null,
        state: "patrol",
        lastKnown: null,
        memory: 0,
        nextMove: 0,
        moveStart: performance.now(),
        id: index,
        hp: 2,
        patrolTarget: null,
        hitUntil: 0
      }));
    }
    function createHazards(count) {
      const config = DIFFICULTIES[state.difficulty];
      const solutionCells = new Set(state.solution.map(cellKey));
      const candidates = shuffle(state.grid.flat().filter((cell) => {
        const distance = state.startDistances.get(cellKey(cell)) || 0;
        return distance > config.safeRadius + 3 && !isReserved(cell, state.enemies) && !solutionCells.has(cellKey(cell));
      }));
      return candidates.slice(0, count).map((cell) => ({ x: cell.x, y: cell.y, triggered: false, neutralized: false }));
    }
    function createMedkits(count) {
      const candidates = shuffle(state.grid.flat().filter((cell) => {
        const distance = state.startDistances.get(cellKey(cell)) || 0;
        return distance > state.size * 0.45 && !isReserved(cell, [...state.enemies, ...state.hazards]);
      }));
      return candidates.slice(0, count).map((cell) => ({ x: cell.x, y: cell.y, collected: false }));
    }
    function createAmmoPacks(count) {
      const occupied = [...state.enemies, ...state.hazards, ...state.medkits];
      const candidates = shuffle(state.grid.flat().filter((cell) => {
        const distance = state.startDistances.get(cellKey(cell)) || 0;
        return distance > state.size * 0.35 && !isReserved(cell, occupied);
      }));
      return candidates.slice(0, count).map((cell) => ({ x: cell.x, y: cell.y, collected: false, amount: 3 }));
    }
    function resetGame() {
      const config = DIFFICULTIES[state.difficulty];
      clearInterval(timerInterval);
      clearTimeout(resultTimeout);
      timerInterval = null;
      resultTimeout = null;
      state.size = config.size;
      state.grid = generateMaze(config.size);
      state.player = { x: 0, y: 0 };
      state.previousPlayer = { x: 0, y: 0 };
      state.trail = [{ x: 0, y: 0 }];
      state.solution = findPath(state.grid, state.player, { x: state.size - 1, y: state.size - 1 });
      state.startDistances = distanceMap(state.grid, state.player);
      state.visibilityDistances = new Map(state.startDistances);
      state.keys = chooseKeyLocations(config.keys);
      state.enemies = createEnemies(config.enemies);
      state.hazards = createHazards(config.hazards);
      state.medkits = createMedkits(config.medkits);
      state.ammoPacks = createAmmoPacks(config.ammoPacks);
      state.enemies.forEach((enemy) => assignPatrolTarget(enemy));
      state.keysCollected = 0;
      state.hp = 100;
      state.ammo = config.ammo;
      state.facing = "right";
      state.shotCells = [];
      state.shotUntil = 0;
      state.nextShotAt = 0;
      state.damageTaken = 0;
      state.invulnerableUntil = 0;
      state.explored = false;
      state.moves = 0;
      state.hints = 2;
      state.hintCells = [];
      state.hintUntil = 0;
      state.started = false;
      state.finished = false;
      state.gameOver = false;
      state.elapsed = 0;
      state.threat = "clear";
      state.moveAnimationStart = performance.now();
      elements.time.textContent = "00:00";
      elements.hints.textContent = "2";
      elements.hintButton.disabled = false;
      elements.startPrompt.classList.remove("hidden");
      elements.winModal.hidden = true;
      elements.gameOverModal.hidden = true;
      elements.dangerBanner.classList.remove("active");
      updateHealthHud();
      updateCombatHud();
      updateObjectiveHud();
      setThreat("clear");
      updateBestDisplay();
      canvas.focus({ preventScroll: true });
    }
    function startTimer() {
      if (state.started || state.finished || state.gameOver) return;
      state.started = true;
      state.startTime = performance.now();
      state.enemies.forEach((enemy, index) => {
        enemy.nextMove = state.startTime + 1800 + index * 280;
      });
      elements.startPrompt.classList.add("hidden");
      timerInterval = window.setInterval(updateTimer, 250);
    }
    function updateTimer() {
      if (!state.started || state.finished || state.gameOver) return;
      state.elapsed = (performance.now() - state.startTime) / 1e3;
      elements.time.textContent = formatTime(state.elapsed);
    }
    function formatTime(seconds) {
      const whole = Math.max(0, Math.floor(seconds));
      return `${Math.floor(whole / 60).toString().padStart(2, "0")}:${(whole % 60).toString().padStart(2, "0")}`;
    }
    function move(directionName) {
      if (state.finished || state.gameOver || !elements.winModal.hidden || !elements.gameOverModal.hidden) return;
      const direction = directions[directionName];
      if (!direction) return;
      state.facing = directionName;
      const cell = state.grid[state.player.y][state.player.x];
      if (cell.walls[direction.wall]) {
        playTone(92, 0.035, 0.02, "square");
        return;
      }
      startTimer();
      state.previousPlayer = { ...state.player };
      state.player.x += direction.dx;
      state.player.y += direction.dy;
      state.moves += 1;
      state.moveAnimationStart = performance.now();
      state.trail.push({ ...state.player });
      if (state.trail.length > 80) state.trail.shift();
      state.visibilityDistances = distanceMap(state.grid, state.player);
      if (!state.explored) {
        state.explored = true;
        updateObjectiveHud();
      }
      playTone(165, 0.02, 8e-3);
      collectKey();
      collectMedkit();
      collectAmmo();
      checkEnemyCollision();
      triggerHazard();
      checkExit();
    }
    function collectKey() {
      const key = state.keys.find((item) => !item.collected && sameCell(item, state.player));
      if (!key) return;
      key.collected = true;
      state.keysCollected += 1;
      [390, 520, 690].forEach((frequency, index) => window.setTimeout(() => playTone(frequency, 0.12, 0.035), index * 65));
      updateObjectiveHud();
      showToast(state.keysCollected === state.keys.length ? "All keys recovered \u2014 service lift released" : `Access key recovered \xB7 ${state.keysCollected}/${state.keys.length}`);
    }
    function collectMedkit() {
      const medkit = state.medkits.find((item) => !item.collected && sameCell(item, state.player));
      if (!medkit) return;
      if (state.hp >= 100) {
        showToast("First aid left in place \u2014 condition already stable");
        return;
      }
      medkit.collected = true;
      const recovered = Math.min(35, 100 - state.hp);
      state.hp += recovered;
      updateHealthHud();
      playTone(480, 0.2, 0.028);
      showToast(`First aid used \xB7 +${recovered} HP`);
    }
    function collectAmmo() {
      const pack = state.ammoPacks.find((item) => !item.collected && sameCell(item, state.player));
      if (!pack) return;
      pack.collected = true;
      state.ammo += pack.amount;
      updateCombatHud();
      playTone(240, 0.08, 0.025, "square");
      showToast(`Sidearm ammunition recovered \xB7 +${pack.amount}`);
    }
    function updateCombatHud() {
      elements.ammo.textContent = state.ammo.toString().padStart(2, "0");
      elements.ammoBlock.classList.toggle("empty", state.ammo === 0);
      elements.shootButton.disabled = state.ammo === 0 || state.finished || state.gameOver;
      elements.shootHudButton.disabled = state.ammo === 0 || state.finished || state.gameOver;
    }
    function shoot() {
      if (state.finished || state.gameOver || !elements.winModal.hidden || !elements.gameOverModal.hidden) return;
      const now = performance.now();
      if (now < state.nextShotAt) return;
      if (state.ammo <= 0) {
        playTone(62, 0.06, 0.018, "square");
        showToast("Sidearm empty \u2014 search for ammunition");
        return;
      }
      startTimer();
      state.ammo -= 1;
      state.nextShotAt = now + 360;
      state.shotCells = [];
      state.shotUntil = now + 180;
      updateCombatHud();
      const direction = directions[state.facing];
      let cursor = { ...state.player };
      let hit = null;
      let hitHazard = null;
      const range = 7;
      for (let step = 0; step < range; step += 1) {
        const cell = state.grid[cursor.y][cursor.x];
        if (cell.walls[direction.wall]) break;
        cursor = { x: cursor.x + direction.dx, y: cursor.y + direction.dy };
        state.shotCells.push({ ...cursor });
        hitHazard = state.hazards.find((hazard) => !hazard.triggered && !hazard.neutralized && sameCell(hazard, cursor));
        if (hitHazard) break;
        hit = state.enemies.find((enemy) => sameCell(enemy, cursor));
        if (hit) break;
      }
      playGunshot();
      alertEnemiesToShot(now);
      if (hitHazard) neutralizeHazard(hitHazard);
      else if (hit) damageEnemy(hit, now);
    }
    function alertEnemiesToShot(now) {
      const config = DIFFICULTIES[state.difficulty];
      state.enemies.forEach((enemy) => {
        const path = findPath(state.grid, enemy, state.player);
        if (path.length > 0 && path.length - 1 <= config.detection + 6) {
          enemy.state = "chase";
          enemy.lastKnown = { ...state.player };
          enemy.memory = config.memory + 2;
          enemy.nextMove = Math.min(enemy.nextMove || Infinity, now + 380);
        }
      });
      updateThreatState();
    }
    function damageEnemy(enemy, now) {
      enemy.hp -= 1;
      enemy.hitUntil = now + 260;
      enemy.nextMove = now + 720;
      if (enemy.hp <= 0) {
        const index = state.enemies.indexOf(enemy);
        if (index >= 0) state.enemies.splice(index, 1);
        playTone(48, 0.5, 0.045, "sawtooth");
        showToast("The Hollow receded into the dark");
        updateThreatState();
      } else {
        playTone(105, 0.16, 0.035, "sawtooth");
        showToast("Direct hit \u2014 it is still moving");
      }
    }
    function neutralizeHazard(hazard) {
      hazard.neutralized = true;
      playTone(310, 0.1, 0.035, "square");
      window.setTimeout(() => playTone(155, 0.16, 0.025, "sawtooth"), 55);
      showToast("Live wire neutralized \u2014 path is safe");
    }
    function triggerHazard() {
      const hazard = state.hazards.find((item) => !item.triggered && !item.neutralized && sameCell(item, state.player));
      if (!hazard) return;
      hazard.triggered = true;
      damagePlayer(15, "Exposed wiring");
    }
    function checkExit() {
      const exit = { x: state.size - 1, y: state.size - 1 };
      if (!sameCell(state.player, exit)) return;
      const remaining = state.keys.length - state.keysCollected;
      if (remaining > 0) {
        showToast(`Service lift sealed \xB7 ${remaining} key${remaining === 1 ? "" : "s"} missing`);
        playTone(76, 0.16, 0.03, "sawtooth");
        return;
      }
      completeMaze();
    }
    function updateObjectiveHud() {
      const allKeys = state.keys.length > 0 && state.keysCollected === state.keys.length;
      elements.keys.textContent = state.keysCollected.toString();
      elements.keysTotal.textContent = ` / ${state.keys.length}`;
      elements.keyStepCount.textContent = `${state.keysCollected}/${state.keys.length}`;
      elements.stepExplore.className = state.explored ? "complete" : "active";
      elements.stepKeys.className = !state.explored ? "" : allKeys ? "complete" : "active";
      elements.stepExit.className = allKeys ? "active" : "locked";
      if (!state.explored) {
        elements.objectiveIndex.textContent = "01";
        elements.objectiveTitle.textContent = "Search the archive.";
        elements.objectiveCopy.textContent = "Move carefully. The entrance is the only confirmed safe area.";
      } else if (!allKeys) {
        const remaining = state.keys.length - state.keysCollected;
        elements.objectiveIndex.textContent = "02";
        elements.objectiveTitle.textContent = "Recover the keys.";
        elements.objectiveCopy.textContent = `${remaining} access key${remaining === 1 ? " remains" : "s remain"}. Search side corridors and dead ends.`;
      } else {
        elements.objectiveIndex.textContent = "03";
        elements.objectiveTitle.textContent = "Reach the service lift.";
        elements.objectiveCopy.textContent = "The exit is unlocked. Get there before the archive closes around you.";
      }
    }
    function updateHealthHud() {
      const condition = conditionForHp(state.hp);
      elements.hp.textContent = state.hp.toString();
      elements.healthBar.style.width = `${state.hp}%`;
      elements.condition.textContent = condition;
      elements.healthBlock.classList.toggle("caution", state.hp <= 60 && state.hp > 30);
      elements.healthBlock.classList.toggle("danger", state.hp <= 30);
    }
    function conditionForHp(hp) {
      if (hp > 60) return "Fine";
      if (hp > 30) return "Caution";
      if (hp > 0) return "Critical";
      return "Deceased";
    }
    function damagePlayer(amount, source, enemy = null) {
      const now = performance.now();
      if (state.finished || state.gameOver || now < state.invulnerableUntil) return false;
      state.hp = Math.max(0, state.hp - amount);
      state.damageTaken += amount;
      state.invulnerableUntil = now + 1450;
      updateHealthHud();
      elements.damageFlash.classList.remove("active");
      void elements.damageFlash.offsetWidth;
      elements.damageFlash.classList.add("active");
      playDamageSound();
      showToast(`${source} \xB7 \u2212${amount} HP`);
      if (enemy) retreatEnemy(enemy, now);
      if (state.hp <= 0) endGame(source);
      return true;
    }
    function checkEnemyCollision() {
      const enemy = state.enemies.find((item) => sameCell(item, state.player));
      if (enemy) damagePlayer(DIFFICULTIES[state.difficulty].enemyDamage, "The Hollow struck", enemy);
    }
    function isSafeCell(cell) {
      const distance = state.startDistances.get(cellKey(cell));
      return distance !== void 0 && distance <= DIFFICULTIES[state.difficulty].safeRadius;
    }
    function enemyCanDetect(enemy, path) {
      if (isSafeCell(state.player) || !path.length) return false;
      return path.length - 1 <= DIFFICULTIES[state.difficulty].detection;
    }
    function updateEnemies(timestamp) {
      if (!state.started || state.finished || state.gameOver) return;
      state.enemies.forEach((enemy) => {
        if (timestamp < enemy.nextMove) return;
        const config = DIFFICULTIES[state.difficulty];
        const pathToPlayer = findPath(state.grid, enemy, state.player);
        const detected = enemyCanDetect(enemy, pathToPlayer);
        const wasChasing = enemy.state === "chase";
        if (detected) {
          enemy.state = "chase";
          enemy.lastKnown = { ...state.player };
          enemy.memory = config.memory;
          if (!wasChasing) playAlertSound();
        } else if (enemy.state === "chase") {
          enemy.state = "search";
        }
        let next = null;
        if (enemy.state === "chase" && pathToPlayer.length > 1) {
          next = pathToPlayer[1];
        } else if (enemy.state === "search") {
          const searchPath = enemy.lastKnown ? findPath(state.grid, enemy, enemy.lastKnown) : [];
          if (searchPath.length > 1) next = searchPath[1];
          enemy.memory -= 1;
          if (enemy.memory <= 0 || sameCell(enemy, enemy.lastKnown)) enemy.state = "patrol";
        }
        if (!next) next = choosePatrolStep(enemy);
        if (next) moveEnemy(enemy, next, timestamp);
        enemy.nextMove = timestamp + (enemy.state === "chase" ? config.chaseSpeed : config.patrolSpeed) + Math.random() * 90;
        if (sameCell(enemy, state.player)) damagePlayer(config.enemyDamage, "The Hollow struck", enemy);
      });
      updateThreatState();
    }
    function assignPatrolTarget(enemy) {
      const minimumRoute = Math.max(4, Math.floor(state.size * 0.32));
      const claimedTargets = state.enemies.filter((item) => item !== enemy && item.patrolTarget).map((item) => cellKey(item.patrolTarget));
      const candidates = shuffle(state.grid.flat()).filter((cell) => !isSafeCell(cell) && !sameCell(cell, enemy) && !claimedTargets.includes(cellKey(cell))).slice(0, 80);
      const target = candidates.find((cell) => {
        const path = findPath(state.grid, enemy, cell);
        return path.length > minimumRoute && path.every((step) => !isSafeCell(step));
      });
      enemy.patrolTarget = target ? { x: target.x, y: target.y } : null;
    }
    function choosePatrolStep(enemy) {
      const occupied = state.enemies.filter((item) => item !== enemy).map(cellKey);
      let patrolPath = enemy.patrolTarget ? findPath(state.grid, enemy, enemy.patrolTarget) : [];
      const routeInvalid = patrolPath.length < 2 || patrolPath.some((cell) => isSafeCell(cell));
      if (routeInvalid) {
        assignPatrolTarget(enemy);
        patrolPath = enemy.patrolTarget ? findPath(state.grid, enemy, enemy.patrolTarget) : [];
      }
      let choice = patrolPath[1] || null;
      if (choice && occupied.includes(cellKey(choice))) choice = null;
      if (!choice) {
        const options = shuffle(walkableNeighbors(state.grid, enemy)).filter((cell) => !isSafeCell(cell) && !occupied.includes(cellKey(cell)));
        choice = options[0] || null;
      }
      if (!choice) return null;
      enemy.heading = directionBetween(enemy, choice) || enemy.heading;
      return choice;
    }
    function moveEnemy(enemy, next, timestamp) {
      const occupied = state.enemies.some((item) => item !== enemy && sameCell(item, next));
      if (occupied || isSafeCell(next)) return;
      enemy.previous = { x: enemy.x, y: enemy.y };
      enemy.x = next.x;
      enemy.y = next.y;
      enemy.moveStart = timestamp;
    }
    function retreatEnemy(enemy, timestamp) {
      const options = walkableNeighbors(state.grid, enemy).filter((cell) => !isSafeCell(cell));
      const ranked = options.sort((a, b) => {
        const aDistance = findPath(state.grid, a, state.player).length;
        const bDistance = findPath(state.grid, b, state.player).length;
        return bDistance - aDistance;
      });
      if (ranked[0]) moveEnemy(enemy, ranked[0], timestamp);
      enemy.state = "search";
      enemy.lastKnown = { ...state.player };
      enemy.memory = 2;
      enemy.nextMove = timestamp + 1600;
    }
    function updateThreatState() {
      if (state.enemies.some((enemy) => enemy.state === "chase")) setThreat("hunted");
      else if (state.enemies.some((enemy) => enemy.state === "search")) setThreat("uneasy");
      else setThreat("clear");
    }
    function setThreat(level) {
      state.threat = level;
      elements.threatBlock.dataset.level = level;
      elements.threat.textContent = level === "hunted" ? "Hunted" : level === "uneasy" ? "Nearby" : "Clear";
      elements.dangerBanner.classList.toggle("active", level === "hunted");
      document.body.classList.toggle("is-hunted", level === "hunted");
    }
    function endGame(source) {
      state.gameOver = true;
      updateCombatHud();
      clearInterval(timerInterval);
      timerInterval = null;
      state.elapsed = state.started ? (performance.now() - state.startTime) / 1e3 : 0;
      setThreat("clear");
      elements.deathKeys.textContent = `${state.keysCollected} / ${state.keys.length}`;
      elements.deathTime.textContent = formatTime(state.elapsed);
      elements.deathEnemies.textContent = state.enemies.length.toString();
      elements.deathMessage.textContent = source === "Exposed wiring" ? "The archive took one final breath through the exposed cables." : "Your last transmission ends beneath the archive.";
      resultTimeout = window.setTimeout(() => {
        elements.gameOverModal.hidden = false;
        elements.restartButton.focus();
      }, state.qaMode ? 0 : 520);
    }
    function completeMaze() {
      state.finished = true;
      updateCombatHud();
      state.elapsed = state.started ? (performance.now() - state.startTime) / 1e3 : 0;
      clearInterval(timerInterval);
      timerInterval = null;
      setThreat("clear");
      elements.time.textContent = formatTime(state.elapsed);
      playWinChime();
      const previousBest = readBest(state.difficulty);
      const isRecord = previousBest === null || state.elapsed < previousBest;
      if (isRecord && !state.qaMode) writeBest(state.difficulty, state.elapsed);
      elements.finalTime.textContent = formatTime(state.elapsed);
      elements.finalDamage.textContent = state.damageTaken.toString();
      elements.finalCondition.textContent = conditionForHp(state.hp);
      elements.newRecord.hidden = !isRecord;
      elements.winMessage.textContent = state.damageTaken === 0 ? "The doors close without a sound. For now, the archive is behind you." : "The doors close. Something strikes them from the other side.";
      resultTimeout = window.setTimeout(() => {
        elements.winModal.hidden = false;
        elements.playAgainButton.focus();
        updateBestDisplay();
      }, state.qaMode ? 0 : 460);
    }
    function showHint() {
      if (state.finished || state.gameOver || state.hints <= 0) return;
      const target = state.keys.find((item) => !item.collected) || { x: state.size - 1, y: state.size - 1 };
      const path = findPath(state.grid, state.player, target);
      state.hintCells = path.slice(1, Math.min(path.length, 8));
      state.hintUntil = performance.now() + 2100;
      state.hints -= 1;
      elements.hints.textContent = state.hints.toString();
      elements.hintButton.disabled = state.hints === 0;
      playTone(310, 0.16, 0.025);
      showToast(target.collected === false ? "Trace points toward an access key" : "Trace points toward the service lift");
    }
    function readBest(difficulty) {
      try {
        const value = localStorage.getItem(`hollow-best-${difficulty}`);
        return value === null ? null : Number(value);
      } catch (_error) {
        return null;
      }
    }
    function writeBest(difficulty, value) {
      try {
        localStorage.setItem(`hollow-best-${difficulty}`, value.toString());
      } catch (_error) {
      }
    }
    function updateBestDisplay() {
      const best = readBest(state.difficulty);
      elements.best.textContent = best === null ? "\u2014" : formatTime(best);
      elements.bestDifficulty.textContent = `${DIFFICULTIES[state.difficulty].label} exposure`;
    }
    function toggleSound() {
      state.sound = !state.sound;
      elements.soundButton.setAttribute("aria-pressed", state.sound.toString());
      elements.soundLabel.textContent = state.sound ? "Sound on" : "Sound off";
      elements.soundButton.querySelector(".sound-icon").textContent = state.sound ? "\u25D6" : "\xD7";
      if (state.sound) playTone(350, 0.08, 0.02);
    }
    function playTone(frequency, duration, volume, type = "sine") {
      if (!state.sound || state.qaMode) return;
      try {
        if (!state.audioContext) state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = state.audioContext.createOscillator();
        const gain = state.audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(volume, state.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(1e-4, state.audioContext.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(state.audioContext.destination);
        oscillator.start();
        oscillator.stop(state.audioContext.currentTime + duration);
      } catch (_error) {
        state.sound = false;
      }
    }
    function playAlertSound() {
      playTone(68, 0.42, 0.04, "sawtooth");
      window.setTimeout(() => playTone(61, 0.38, 0.025, "sawtooth"), 170);
    }
    function playGunshot() {
      playTone(118, 0.09, 0.065, "square");
      playTone(57, 0.2, 0.045, "sawtooth");
      window.setTimeout(() => playTone(42, 0.16, 0.022, "sine"), 45);
    }
    function playDamageSound() {
      playTone(92, 0.2, 0.05, "sawtooth");
      window.setTimeout(() => playTone(55, 0.28, 0.035, "square"), 70);
    }
    function playWinChime() {
      [196, 246, 293, 392].forEach((note, index) => window.setTimeout(() => playTone(note, 0.35, 0.025), index * 130));
    }
    function showToast(message) {
      if (state.qaMode) return;
      clearTimeout(toastTimeout);
      elements.toast.textContent = message;
      elements.toast.classList.add("show");
      toastTimeout = window.setTimeout(() => elements.toast.classList.remove("show"), 2300);
    }
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      displaySize = Math.max(1, Math.min(rect.width, rect.height));
      pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.round(rect.width * pixelRatio);
      const height = Math.round(rect.height * pixelRatio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
    function render(timestamp) {
      resizeCanvas();
      updateEnemies(timestamp);
      const size = displaySize;
      const padding = Math.max(25, size * 0.06);
      const boardSize = size - padding * 2;
      const cellSize = boardSize / state.size;
      ctx.clearRect(0, 0, size, size);
      drawBackground(size, padding, boardSize, cellSize, timestamp);
      drawSafeZone(padding, cellSize);
      drawTrail(padding, cellSize);
      drawHints(padding, cellSize, timestamp);
      drawExit(padding, cellSize, timestamp);
      drawHazards(padding, cellSize, timestamp);
      drawMedkits(padding, cellSize);
      drawAmmoPacks(padding, cellSize);
      drawKeys(padding, cellSize, timestamp);
      drawEnemies(padding, cellSize, timestamp);
      drawWalls(padding, boardSize, cellSize);
      drawFog(padding, boardSize, cellSize, timestamp);
      drawShot(padding, cellSize, timestamp);
      drawPlayer(padding, cellSize, timestamp);
      drawInterference(size, timestamp);
      window.requestAnimationFrame(render);
    }
    function drawBackground(size, padding, boardSize, cellSize, timestamp) {
      const gradient = ctx.createRadialGradient(size * 0.4, size * 0.35, 0, size * 0.5, size * 0.5, size * 0.78);
      gradient.addColorStop(0, "#151718");
      gradient.addColorStop(1, "#070808");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "rgba(210,208,200,0.025)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let index = 0; index <= state.size; index += 1) {
        const point = padding + index * cellSize;
        ctx.moveTo(point, padding);
        ctx.lineTo(point, padding + boardSize);
        ctx.moveTo(padding, point);
        ctx.lineTo(padding + boardSize, point);
      }
      ctx.stroke();
      const flicker = Math.sin(timestamp / 47) > 0.985 ? 0.035 : 0;
      if (flicker) {
        ctx.fillStyle = `rgba(255,255,245,${flicker})`;
        ctx.fillRect(0, 0, size, size);
      }
    }
    function cellCenter(item, padding, cellSize) {
      return { x: padding + (item.x + 0.5) * cellSize, y: padding + (item.y + 0.5) * cellSize };
    }
    function isVisible(item, extra = 0) {
      const distance = state.visibilityDistances.get(cellKey(item));
      return distance !== void 0 && distance <= DIFFICULTIES[state.difficulty].visibility + extra;
    }
    function drawSafeZone(padding, cellSize) {
      const center = cellCenter({ x: 0, y: 0 }, padding, cellSize);
      ctx.save();
      ctx.fillStyle = "rgba(170,178,164,0.07)";
      ctx.fillRect(padding, padding, cellSize, cellSize);
      ctx.strokeStyle = "rgba(181,188,175,0.25)";
      ctx.setLineDash([2, 3]);
      ctx.strokeRect(padding + 3, padding + 3, cellSize - 6, cellSize - 6);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(210,212,203,0.42)";
      ctx.font = `${Math.max(5, cellSize * 0.16)}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText("SAFE", center.x, center.y + cellSize * 0.34);
      ctx.restore();
    }
    function drawTrail(padding, cellSize) {
      if (state.trail.length < 2) return;
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(1, cellSize * 0.05);
      ctx.strokeStyle = "rgba(190,190,182,0.055)";
      ctx.beginPath();
      state.trail.forEach((item, index) => {
        const point = cellCenter(item, padding, cellSize);
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.restore();
    }
    function drawHints(padding, cellSize, timestamp) {
      if (timestamp > state.hintUntil) return;
      const life = Math.max(0, (state.hintUntil - timestamp) / 2100);
      state.hintCells.forEach((cell, index) => {
        const center = cellCenter(cell, padding, cellSize);
        ctx.fillStyle = `rgba(210,55,60,${life * 0.42 * (1 - index / 10)})`;
        ctx.fillRect(center.x - 1, center.y - 1, 2, 2);
      });
    }
    function drawWalls(padding, boardSize, cellSize) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = Math.max(1, Math.min(1.7, cellSize * 0.052));
      ctx.strokeStyle = "rgba(184,185,179,0.45)";
      state.grid.flat().forEach((cell) => {
        const x = padding + cell.x * cellSize;
        const y = padding + cell.y * cellSize;
        const right = x + cellSize;
        const bottom = y + cellSize;
        if (cell.walls[0]) {
          ctx.moveTo(x, y);
          ctx.lineTo(right, y);
        }
        if (cell.walls[3]) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, bottom);
        }
        if (cell.y === state.size - 1 && cell.walls[2]) {
          ctx.moveTo(x, bottom);
          ctx.lineTo(right, bottom);
        }
        if (cell.x === state.size - 1 && cell.walls[1]) {
          ctx.moveTo(right, y);
          ctx.lineTo(right, bottom);
        }
      });
      ctx.stroke();
      ctx.strokeStyle = "rgba(220,218,210,0.14)";
      ctx.strokeRect(padding - 4, padding - 4, boardSize + 8, boardSize + 8);
      ctx.restore();
    }
    function drawExit(padding, cellSize, timestamp) {
      const unlocked = state.keysCollected === state.keys.length;
      const center = cellCenter({ x: state.size - 1, y: state.size - 1 }, padding, cellSize);
      const radius = cellSize * 0.28;
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.strokeStyle = unlocked ? "rgba(215,215,205,0.85)" : "rgba(174,30,35,0.72)";
      ctx.lineWidth = Math.max(1, cellSize * 0.055);
      ctx.strokeRect(-radius, -radius, radius * 2, radius * 2);
      ctx.beginPath();
      ctx.moveTo(-radius * 0.45, 0);
      ctx.lineTo(radius * 0.4, 0);
      ctx.lineTo(radius * 0.08, -radius * 0.3);
      ctx.moveTo(radius * 0.4, 0);
      ctx.lineTo(radius * 0.08, radius * 0.3);
      ctx.stroke();
      if (!unlocked) {
        ctx.fillStyle = `rgba(190,31,36,${0.35 + Math.sin(timestamp / 360) * 0.16})`;
        ctx.fillRect(-1, -radius * 0.42, 2, radius * 0.84);
      }
      ctx.restore();
    }
    function drawKeys(padding, cellSize, timestamp) {
      state.keys.forEach((key, index) => {
        if (key.collected || !isVisible(key, 1)) return;
        const center = cellCenter(key, padding, cellSize);
        const radius = Math.max(3, cellSize * 0.14);
        ctx.save();
        ctx.translate(center.x, center.y + Math.sin(timestamp / 430 + index) * cellSize * 0.035);
        ctx.rotate(Math.PI / 4);
        ctx.shadowColor = "rgba(214,188,118,0.8)";
        ctx.shadowBlur = radius * 2;
        ctx.strokeStyle = "#d2b977";
        ctx.lineWidth = Math.max(1, cellSize * 0.05);
        ctx.strokeRect(-radius, -radius, radius * 2, radius * 2);
        ctx.fillStyle = "rgba(210,185,119,0.18)";
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.restore();
      });
    }
    function drawMedkits(padding, cellSize) {
      state.medkits.forEach((medkit) => {
        if (medkit.collected || !isVisible(medkit, 1)) return;
        const center = cellCenter(medkit, padding, cellSize);
        const radius = cellSize * 0.2;
        ctx.save();
        ctx.fillStyle = "rgba(112,129,108,0.7)";
        ctx.strokeStyle = "rgba(190,202,184,0.7)";
        ctx.fillRect(center.x - radius, center.y - radius * 0.75, radius * 2, radius * 1.5);
        ctx.strokeRect(center.x - radius, center.y - radius * 0.75, radius * 2, radius * 1.5);
        ctx.fillStyle = "#d5d8cd";
        ctx.fillRect(center.x - 1, center.y - radius * 0.45, 2, radius * 0.9);
        ctx.fillRect(center.x - radius * 0.45, center.y - 1, radius * 0.9, 2);
        ctx.restore();
      });
    }
    function drawAmmoPacks(padding, cellSize) {
      state.ammoPacks.forEach((pack) => {
        if (pack.collected || !isVisible(pack, 1)) return;
        const center = cellCenter(pack, padding, cellSize);
        const width = cellSize * 0.34;
        ctx.save();
        ctx.fillStyle = "rgba(99,87,57,0.78)";
        ctx.strokeStyle = "rgba(201,177,111,0.75)";
        ctx.fillRect(center.x - width, center.y - width * 0.56, width * 2, width * 1.12);
        ctx.strokeRect(center.x - width, center.y - width * 0.56, width * 2, width * 1.12);
        ctx.fillStyle = "#c8ad69";
        [-0.42, 0, 0.42].forEach((offset) => {
          ctx.fillRect(center.x + width * offset - 1, center.y - width * 0.35, 2, width * 0.7);
        });
        ctx.restore();
      });
    }
    function drawHazards(padding, cellSize, timestamp) {
      state.hazards.forEach((hazard) => {
        if (!isVisible(hazard, 1)) return;
        const center = cellCenter(hazard, padding, cellSize);
        const inactive = hazard.triggered || hazard.neutralized;
        ctx.save();
        ctx.globalAlpha = inactive ? 0.24 : 0.7;
        ctx.strokeStyle = inactive ? "#666" : "#b27927";
        ctx.lineWidth = Math.max(1, cellSize * 0.045);
        ctx.beginPath();
        ctx.moveTo(center.x - cellSize * 0.25, center.y + cellSize * 0.18);
        ctx.lineTo(center.x - cellSize * 0.06, center.y - cellSize * 0.2);
        ctx.lineTo(center.x + cellSize * 0.05, center.y + cellSize * 0.04);
        ctx.lineTo(center.x + cellSize * 0.23, center.y - cellSize * 0.2);
        ctx.stroke();
        if (!inactive && Math.sin(timestamp / 75) > 0.83) {
          ctx.fillStyle = "#e1b96e";
          ctx.fillRect(center.x - 1, center.y - 1, 2, 2);
        }
        if (hazard.neutralized) {
          ctx.strokeStyle = "rgba(175,180,172,0.75)";
          ctx.beginPath();
          ctx.moveTo(center.x - cellSize * 0.18, center.y - cellSize * 0.18);
          ctx.lineTo(center.x + cellSize * 0.18, center.y + cellSize * 0.18);
          ctx.moveTo(center.x + cellSize * 0.18, center.y - cellSize * 0.18);
          ctx.lineTo(center.x - cellSize * 0.18, center.y + cellSize * 0.18);
          ctx.stroke();
        }
        ctx.restore();
      });
    }
    function drawEnemies(padding, cellSize, timestamp) {
      state.enemies.forEach((enemy) => {
        if (!isVisible(enemy, enemy.state === "chase" ? 2 : 0)) return;
        const duration = enemy.state === "chase" ? DIFFICULTIES[state.difficulty].chaseSpeed : DIFFICULTIES[state.difficulty].patrolSpeed;
        const progress = Math.min(1, (timestamp - enemy.moveStart) / Math.max(1, duration * 0.65));
        const eased = 1 - Math.pow(1 - progress, 3);
        const position = {
          x: enemy.previous.x + (enemy.x - enemy.previous.x) * eased,
          y: enemy.previous.y + (enemy.y - enemy.previous.y) * eased
        };
        const center = cellCenter(position, padding, cellSize);
        const radius = Math.max(3, cellSize * 0.19);
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.shadowColor = enemy.state === "chase" ? "rgba(185,15,22,0.8)" : "rgba(0,0,0,0.9)";
        ctx.shadowBlur = enemy.state === "chase" ? radius * 3 : radius;
        ctx.fillStyle = timestamp < enemy.hitUntil ? "#d9d3c8" : enemy.state === "chase" ? "#6e1115" : "#343536";
        ctx.beginPath();
        ctx.arc(0, -radius * 0.35, radius * 0.48, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-radius * 0.7, radius);
        ctx.quadraticCurveTo(-radius * 0.62, -radius * 0.1, 0, -radius * 0.15);
        ctx.quadraticCurveTo(radius * 0.62, -radius * 0.1, radius * 0.7, radius);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (enemy.state === "chase") {
          ctx.fillStyle = "#e8464c";
          ctx.fillRect(-radius * 0.24, -radius * 0.46, 2, 1);
          ctx.fillRect(radius * 0.14, -radius * 0.46, 2, 1);
        }
        if (enemy.hp === 1) {
          ctx.strokeStyle = "rgba(211,40,47,0.7)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, radius * 1.18, -Math.PI * 0.72, Math.PI * 0.2);
          ctx.stroke();
        }
        ctx.restore();
      });
    }
    function drawFog(padding, boardSize, cellSize, timestamp) {
      const center = cellCenter(state.player, padding, cellSize);
      const visibility = DIFFICULTIES[state.difficulty].visibility;
      const pulse = 1 + Math.sin(timestamp / 1100) * 0.025;
      const radius = cellSize * visibility * pulse;
      const fog = ctx.createRadialGradient(center.x, center.y, cellSize * 0.7, center.x, center.y, radius);
      fog.addColorStop(0, "rgba(0,0,0,0)");
      fog.addColorStop(0.46, "rgba(0,0,0,0.08)");
      fog.addColorStop(0.78, "rgba(0,0,0,0.55)");
      fog.addColorStop(1, "rgba(0,0,0,0.94)");
      ctx.fillStyle = fog;
      ctx.fillRect(padding, padding, boardSize, boardSize);
    }
    function drawShot(padding, cellSize, timestamp) {
      if (timestamp > state.shotUntil || !state.shotCells.length) return;
      const start = cellCenter(state.player, padding, cellSize);
      const end = cellCenter(state.shotCells[state.shotCells.length - 1], padding, cellSize);
      const life = Math.max(0, (state.shotUntil - timestamp) / 180);
      ctx.save();
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(255,205,112,0.9)";
      ctx.shadowBlur = cellSize * 0.8;
      ctx.strokeStyle = `rgba(255,221,155,${life * 0.9})`;
      ctx.lineWidth = Math.max(1, cellSize * 0.055);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,238,188,${life})`;
      ctx.beginPath();
      ctx.arc(start.x, start.y, cellSize * 0.22 * life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    function drawPlayer(padding, cellSize, timestamp) {
      const progress = Math.min(1, (timestamp - state.moveAnimationStart) / 110);
      const eased = 1 - Math.pow(1 - progress, 3);
      const position = {
        x: state.previousPlayer.x + (state.player.x - state.previousPlayer.x) * eased,
        y: state.previousPlayer.y + (state.player.y - state.previousPlayer.y) * eased
      };
      const center = cellCenter(position, padding, cellSize);
      const radius = Math.max(3, cellSize * 0.15);
      const blinking = timestamp < state.invulnerableUntil && Math.floor(timestamp / 90) % 2 === 0;
      if (blinking) return;
      const halo = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius * 5);
      halo.addColorStop(0, "rgba(236,232,215,0.34)");
      halo.addColorStop(1, "rgba(236,232,215,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.shadowColor = "rgba(244,238,215,0.85)";
      ctx.shadowBlur = radius * 1.6;
      ctx.fillStyle = "#e4e0d3";
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(center.x - radius * 0.25, center.y - radius * 0.25, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      const facing = directions[state.facing];
      ctx.strokeStyle = "rgba(214,183,110,0.9)";
      ctx.lineWidth = Math.max(1, radius * 0.22);
      ctx.beginPath();
      ctx.moveTo(center.x + facing.dx * radius * 0.55, center.y + facing.dy * radius * 0.55);
      ctx.lineTo(center.x + facing.dx * radius * 1.55, center.y + facing.dy * radius * 1.55);
      ctx.stroke();
      ctx.restore();
    }
    function drawInterference(size, timestamp) {
      if (state.threat !== "hunted") return;
      const alpha = 0.025 + Math.sin(timestamp / 85) * 0.012;
      ctx.fillStyle = `rgba(170,8,13,${alpha})`;
      ctx.fillRect(0, 0, size, size);
      if (Math.sin(timestamp / 43) > 0.92) {
        ctx.fillStyle = "rgba(220,220,210,0.035)";
        ctx.fillRect(0, Math.random() * size, size, 1 + Math.random() * 2);
      }
    }
    function closeWinModal() {
      elements.winModal.hidden = true;
      canvas.focus({ preventScroll: true });
    }
    function selectDifficulty(button) {
      document.querySelectorAll("[data-difficulty]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.difficulty = button.dataset.difficulty;
      resetGame();
      showToast(`${DIFFICULTIES[state.difficulty].label} exposure loaded`);
    }
    function directionBetween(from, to) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      return Object.entries(directions).find(([, direction]) => direction.dx === dx && direction.dy === dy)?.[0];
    }
    function runAutomatedQa() {
      state.qaMode = true;
      const report = [];
      const initialEnemies = [...state.enemies];
      report.push(state.solution.length > 0 ? "exit-reachable" : "exit-unreachable");
      report.push(state.keys.every((key) => findPath(state.grid, state.player, key).length > 0) ? "keys-reachable" : "key-unreachable");
      report.push(initialEnemies.every((enemy) => !isSafeCell(enemy) && findPath(state.grid, enemy, state.player).length > 0) ? "ai-paths-valid" : "ai-invalid");
      report.push(state.hazards.every((hazard) => !state.solution.some((cell) => sameCell(cell, hazard))) ? "hazards-fair" : "hazard-on-critical-path");
      const patrolEnemy = state.enemies[0];
      const patrolPositions = /* @__PURE__ */ new Set([cellKey(patrolEnemy)]);
      for (let step = 0; step < 4; step += 1) {
        const next = choosePatrolStep(patrolEnemy);
        if (next) {
          moveEnemy(patrolEnemy, next, performance.now());
          patrolPositions.add(cellKey(patrolEnemy));
        }
      }
      report.push(patrolEnemy.patrolTarget && patrolPositions.size >= 3 ? "patrol-roaming-pass" : "patrol-roaming-fail");
      const firingLane = walkableNeighbors(state.grid, state.player)[0];
      state.enemies = [{
        x: firingLane.x,
        y: firingLane.y,
        previous: { x: firingLane.x, y: firingLane.y },
        heading: null,
        state: "patrol",
        lastKnown: null,
        memory: 0,
        nextMove: Infinity,
        moveStart: performance.now(),
        id: 99,
        hp: 2,
        patrolTarget: null,
        hitUntil: 0
      }];
      state.facing = firingLane.direction;
      state.ammo = 2;
      state.nextShotAt = 0;
      shoot();
      state.nextShotAt = 0;
      shoot();
      report.push(state.enemies.length === 0 && state.ammo === 0 ? "combat-pass" : "combat-fail");
      const qaHazard = state.hazards[0];
      const hazardApproach = walkableNeighbors(state.grid, qaHazard)[0];
      state.player = { x: hazardApproach.x, y: hazardApproach.y };
      state.previousPlayer = { ...state.player };
      state.facing = directionBetween(state.player, qaHazard);
      state.ammo = 1;
      state.nextShotAt = 0;
      shoot();
      const hpBeforeHazard = state.hp;
      state.player = { x: qaHazard.x, y: qaHazard.y };
      triggerHazard();
      report.push(qaHazard.neutralized && state.hp === hpBeforeHazard ? "live-wire-pass" : "live-wire-fail");
      state.player = { x: 0, y: 0 };
      state.previousPlayer = { ...state.player };
      state.visibilityDistances = distanceMap(state.grid, state.player);
      state.enemies = [];
      state.hazards = [];
      const targets = state.keys.map((key) => ({ x: key.x, y: key.y }));
      targets.push({ x: state.size - 1, y: state.size - 1 });
      targets.forEach((target) => {
        const path = findPath(state.grid, state.player, target);
        path.slice(1).forEach((next) => move(directionBetween(state.player, next)));
      });
      report.push(state.finished && state.keysCollected === state.keys.length ? "objective-loop-pass" : "objective-loop-fail");
      resetGame();
      while (!state.gameOver) {
        state.invulnerableUntil = 0;
        damagePlayer(25, "QA impact");
      }
      report.push(state.hp === 0 && state.gameOver ? "game-over-pass" : "game-over-fail");
      resetGame();
      report.push(state.hp === 100 && !state.gameOver && state.keysCollected === 0 ? "restart-pass" : "restart-fail");
      const passed = report.every((item) => !item.includes("fail") && !item.includes("invalid") && !item.includes("unreachable") && !item.includes("critical"));
      document.documentElement.dataset.qa = passed ? "pass" : "fail";
      document.documentElement.dataset.qaReport = report.join(",");
      state.qaMode = false;
    }
    document.addEventListener("keydown", (event) => {
      const direction = keyDirections[event.key];
      if (direction) {
        event.preventDefault();
        move(direction);
        return;
      }
      if (event.key === "f" || event.key === "F" || event.code === "Space") {
        event.preventDefault();
        shoot();
        return;
      }
      if (event.key === "r" || event.key === "R") resetGame();
      if (event.key === "h" || event.key === "H") showHint();
      if (event.key === "Escape" && !elements.winModal.hidden) closeWinModal();
    });
    document.querySelectorAll("[data-direction]").forEach((button) => {
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        move(button.dataset.direction);
      });
    });
    document.querySelectorAll("[data-difficulty]").forEach((button) => button.addEventListener("click", () => selectDifficulty(button)));
    canvas.addEventListener("pointerdown", (event) => {
      pointerStart = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointerup", (event) => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
      move(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up");
    });
    elements.newMazeButton.addEventListener("click", resetGame);
    elements.shootButton.addEventListener("click", shoot);
    elements.shootHudButton.addEventListener("click", shoot);
    elements.hintButton.addEventListener("click", showHint);
    elements.soundButton.addEventListener("click", toggleSound);
    elements.closeModalButton.addEventListener("click", closeWinModal);
    elements.playAgainButton.addEventListener("click", resetGame);
    elements.restartButton.addEventListener("click", resetGame);
    elements.winModal.addEventListener("click", (event) => {
      if (event.target === elements.winModal) closeWinModal();
    });
    window.addEventListener("resize", resizeCanvas);
    resetGame();
    if (new URLSearchParams(window.location.search).has("qa")) runAutomatedQa();
    window.requestAnimationFrame(render);
  })();

  // src/main.js
  inject();
})();
