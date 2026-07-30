// ============================================
// SET YOUR PASSWORD HERE (before deploying)
// ============================================
window.SITE_CONFIG = {
  password: "paula2026",
  caseSensitive: true,
};

(function () {
  "use strict";

  window.__SITE_BOOTED = true;

  var cfg = window.SITE_CONFIG || { password: "CHANGE_ME", caseSensitive: true };
  var BOOM_MS = 5000;
  var EXPLOSION_GIFS = ["assets/explosions/bravo.gif"];
  var VOUCHER_PAGES = [
    "assets/gutschein/page-01.jpg",
    "assets/gutschein/page-02.jpg",
    "assets/gutschein/page-03.jpg",
    "assets/gutschein/page-04.jpg",
    "assets/gutschein/page-05.jpg",
    "assets/gutschein/page-06.jpg",
    "assets/gutschein/page-07.jpg",
  ];

  var gate = document.getElementById("gate");
  var form = document.getElementById("gate-form");
  var input = document.getElementById("password-input");
  var failStage = document.getElementById("fail-stage");
  var appRoot = document.getElementById("app-root");
  var warning = document.getElementById("asset-warning");

  if (warning) warning.classList.add("js-hide");

  var WORDS = ["BOOM!!!", "KABOOM!", "POW!", "BANG!", "WHAM!", "EXPLOSION!!!", "AAAARGH!", "NUKE!!!"];

  var boom;
  var reveal;
  var gifLayer;
  var captions;

  function normalize(value) {
    return cfg.caseSensitive ? value : String(value).toLowerCase();
  }

  function expectedPassword() {
    return normalize(String(cfg.password || ""));
  }

  function handleGateSubmit() {
    var typed = normalize((input.value || "").trim());

    if (!typed || typed !== expectedPassword()) {
      playFail();
      return;
    }

    startBoomSequence();
  }

  // Expose for the HTML form (works even if addEventListener had issues)
  window.handleGateSubmit = handleGateSubmit;

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      handleGateSubmit();
    });
  }

  if (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleGateSubmit();
      }
    });
  }

  var goBtn = document.getElementById("go-btn");
  if (goBtn) {
    goBtn.addEventListener("click", function (event) {
      event.preventDefault();
      handleGateSubmit();
    });
  }

  function playFail() {
    failStage.innerHTML = "";
    gate.classList.remove("shake");
    void gate.offsetWidth;
    gate.classList.add("shake");

    var dud = document.createElement("div");
    dud.className = "fail-dud";
    dud.innerHTML =
      '<span class="rocket" aria-hidden="true">🚀</span>' +
      '<div class="pffft">PFFFFT…</div>' +
      '<p class="fail-msg comic">Falsches Passwort *__* .</p>';
    failStage.appendChild(dud);

    try {
      spawnFailSparks();
    } catch (e) {
      /* ignore older browsers without element.animate */
    }
    input.select();
  }

  function spawnFailSparks() {
    if (!failStage.animate && !document.body.animate) return;
    var colors = ["#666", "#999", "#444", "#886600"];
    for (var i = 0; i < 12; i++) {
      var spark = document.createElement("span");
      spark.textContent = "·";
      spark.style.cssText =
        "position:absolute;left:50%;top:30%;font-size:18px;pointer-events:none;color:" +
        colors[i % colors.length];
      failStage.appendChild(spark);
      var angle = (Math.PI * 2 * i) / 12;
      var dist = 18 + Math.random() * 28;
      if (spark.animate) {
        spark.animate(
          [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
            {
              transform:
                "translate(calc(-50% + " +
                Math.cos(angle) * dist +
                "px), calc(-50% + " +
                (Math.sin(angle) * dist + 30) +
                "px)) scale(0.2)",
              opacity: 0,
            },
          ],
          { duration: 700 + Math.random() * 400, easing: "ease-out", fill: "forwards" }
        );
      }
    }
  }

  function buildStages() {
    appRoot.innerHTML =
      '<section id="boom" class="screen boom-screen" aria-hidden="false">' +
      '<div id="boom-gifs" class="boom-gifs" aria-hidden="true"></div>' +
      '<div id="boom-captions" class="boom-captions" aria-hidden="true"></div>' +
      '<p class="boom-hint comic blink">ACHTUNG: ECHTE EXPLOSIONEN!!!</p>' +
      "</section>" +
      '<section id="reveal" class="screen reveal-screen js-hide" aria-hidden="true">' +
      '<div class="bday-banner">' +
      '<div class="marquee-wrap">' +
      '<p class="marquee-text rainbow-text impact">★★★ HAPPY BIRTHDAY PAULA ★★★ HAPPY BIRTHDAY PAULA ★★★ HAPPY BIRTHDAY PAULA ★★★</p>' +
      "</div>" +
      '<h2 class="bday-title impact">Happy Birthday Paula</h2>' +
      '<p class="comic bday-sub blink">★★★ DU HAST ES GESCHAFFT ★★★</p>' +
      "</div>" +
      '<div class="voucher-block">' +
      '<p class="comic pdf-label">↓ Dein Gutschein ↓</p>' +
      '<div id="voucher-pages" class="voucher-pages"></div>' +
      '<p class="comic pdf-fallback">Lieber als PDF? <a href="gutschein.pdf" target="_blank" rel="noopener">Herunterladen</a></p>' +
      "</div>" +
      "</section>";

    boom = document.getElementById("boom");
    reveal = document.getElementById("reveal");
    gifLayer = document.getElementById("boom-gifs");
    captions = document.getElementById("boom-captions");

    var pages = document.getElementById("voucher-pages");
    for (var i = 0; i < VOUCHER_PAGES.length; i++) {
      var img = document.createElement("img");
      img.src = VOUCHER_PAGES[i];
      img.alt = "Gutschein Seite " + (i + 1);
      img.width = 1191;
      img.height = 1684;
      img.loading = i === 0 ? "eager" : "lazy";
      pages.appendChild(img);
    }
  }

  function startBoomSequence() {
    for (var i = 0; i < EXPLOSION_GIFS.length; i++) {
      var preload = new Image();
      preload.src = EXPLOSION_GIFS[i];
    }

    buildStages();
    gate.classList.add("js-hide");
    runExplosions(BOOM_MS).then(showReveal);
  }

  function showReveal() {
    boom.classList.add("js-hide");
    boom.setAttribute("aria-hidden", "true");
    gifLayer.innerHTML = "";
    captions.innerHTML = "";
    reveal.classList.remove("js-hide");
    reveal.setAttribute("aria-hidden", "false");
    window.scrollTo(0, 0);
  }

  function pickBoomColor() {
    var palette = ["#ff0000", "#ff6600", "#ffff00", "#ffffff", "#ff00ff", "#00ffff", "#ff9900"];
    return palette[(Math.random() * palette.length) | 0];
  }

  function spawnWord() {
    var el = document.createElement("div");
    el.className = "boom-word";
    el.textContent = WORDS[(Math.random() * WORDS.length) | 0];
    el.style.left = 10 + Math.random() * 80 + "%";
    el.style.top = 15 + Math.random() * 60 + "%";
    el.style.color = pickBoomColor();
    captions.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 750);
  }

  function flashScreen() {
    boom.classList.remove("screen-flash");
    void boom.offsetWidth;
    boom.classList.add("screen-flash");
  }

  function spawnRealBlast(mega) {
    var src = EXPLOSION_GIFS[(Math.random() * EXPLOSION_GIFS.length) | 0];
    var blast = document.createElement("img");
    blast.className = "real-blast" + (mega ? " mega" : "");
    blast.src = src;
    blast.alt = "";
    blast.draggable = false;

    var size = mega ? 70 + Math.random() * 55 : 35 + Math.random() * 55;
    var left = mega ? -5 + Math.random() * 40 : Math.random() * 85;
    var top = mega ? -5 + Math.random() * 35 : Math.random() * 75;
    var rot = -25 + Math.random() * 50;
    var hue = Math.random() > 0.55 ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 360);
    var modes = ["screen", "lighten", "plus-lighter", "hard-light"];
    var blend = modes[(Math.random() * modes.length) | 0];

    blast.style.cssText =
      "left:" +
      left +
      "%;top:" +
      top +
      "%;width:" +
      size +
      "vw;transform:rotate(" +
      rot +
      "deg);filter:contrast(1.35) saturate(1.6) hue-rotate(" +
      hue +
      "deg) brightness(1.15);mix-blend-mode:" +
      blend +
      ";";

    gifLayer.appendChild(blast);

    setTimeout(
      function () {
        if (blast.parentNode) blast.remove();
      },
      mega ? 1600 + Math.random() * 900 : 900 + Math.random() * 700
    );
  }

  function runExplosions(durationMs) {
    return new Promise(function (resolve) {
      var start = performance.now();
      var lastWord = 0;
      var lastBlast = 0;
      var running = true;

      spawnRealBlast(true);
      spawnRealBlast(true);
      spawnWord();
      flashScreen();
      boom.classList.add("boom-shake");

      function tick(now) {
        if (!running) return;
        var elapsed = now - start;

        if (elapsed < durationMs - 150) {
          if (elapsed - lastBlast > 160 + Math.random() * 120) {
            spawnRealBlast(Math.random() > 0.62);
            if (Math.random() > 0.4) spawnRealBlast(false);
            lastBlast = elapsed;
            if (Math.random() > 0.45) flashScreen();
          }
          if (elapsed - lastWord > 320) {
            spawnWord();
            lastWord = elapsed;
          }
        }

        if (elapsed >= durationMs) {
          running = false;
          boom.classList.remove("boom-shake");
          var whiteout = document.createElement("div");
          whiteout.className = "boom-whiteout";
          boom.appendChild(whiteout);
          setTimeout(function () {
            whiteout.remove();
            resolve();
          }, 200);
          return;
        }

        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }
})();
