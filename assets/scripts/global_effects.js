
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const footer = document.querySelector("footer");
  const particleContainers = Array.from(document.querySelectorAll('.floating-particles-background-effect'));
  const bgVideo = document.getElementById('bg-video');
  const bgSource = bgVideo?.querySelector('source');
  let fadeTimeout = null;

  /* ---------------- CONFIG ---------------- */
  const config = {
    "toggle-particles":        { className: "reduce-particles",         applyWhen: "off", default: true,  label: "Particles",             mode: "onoff" },
    "toggle-bgvideo":          { className: "reduce-bgvideo",           applyWhen: "off", default: true,  label: "Background Video",      mode: "onoff" },
    "toggle-buttons":          { className: "reduce-button-animations", applyWhen: "off", default: true,  label: "Animations",            mode: "onoff" },
    "toggle-transitions":      { className: "reduce-transitions",       applyWhen: "off", default: true,  label: "Transitions",           mode: "onoff" },
    "toggle-darkmode":         { className: "darkmode",                 applyWhen: "on",  default: false, label: "Dark Mode",             mode: "onoff", exclusiveWith: ["toggle-highcontrastmode"] },
    "toggle-highcontrastmode": { className: "high-contrast",            applyWhen: "on",  default: false, label: "High Contrast Mode",    mode: "onoff", exclusiveWith: ["toggle-darkmode"] },
    "toggle-dyslexia":         { className: "dyslexia-font",            applyWhen: "on",  default: false, label: "Dyslexia-Friendly Font",mode: "onoff" },
    "toggle-fontsize":         { className: "large-font",               applyWhen: "on",  default: false, label: "Font Size",             mode: "fontsize" }
  };

  const settingsState = {}; // real-time state object

  /* ----------------- STORAGE HELPERS ----------------- */
  function loadInitialState() {
    Object.keys(config).forEach(id => {
      const cfg = config[id];
      const saved = localStorage.getItem(id);
      if (cfg.mode === "fontsize") {
        settingsState[id] = saved === "large";
      } else {
        settingsState[id] = (saved === null) ? cfg.default : (saved === "on");
      }
    });
  }

  function saveState(id) {
    const cfg = config[id];
    if (cfg.mode === "fontsize") {
      localStorage.setItem(id, settingsState[id] ? "large" : "regular");
    } else {
      localStorage.setItem(id, settingsState[id] ? "on" : "off");
    }
  }

  /* ----------------- PARTICLES (create/remove) ----------------- */
  // Reusable particle generator (same behavior/params you had)
  function createParticlesFor(container) {
    // remove any preexisting children first (avoid duplication)
    while (container.firstChild) container.removeChild(container.firstChild);

    // If setting is off, don't generate
    if (!settingsState["toggle-particles"]) {
      container.style.display = "none";
      return;
    }

    const width = window.innerWidth;
    const particleCount = width > 1200 ? 250 : width > 768 ? 180 : 100;

    container.style.display = "block";

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const sizeCategory = Math.random();
      let size, opacity, twinkleMax, drift;

      if (sizeCategory < 0.3) {
        size = Math.random() * 3 + 1; opacity = 0.7 + Math.random() * 0.2;
        twinkleMax = 0.9 + Math.random() * 0.1; drift = Math.random() * 30 - 15;
      } else if (sizeCategory < 0.7) {
        size = Math.random() * 4 + 2; opacity = 0.75 + Math.random() * 0.2;
        twinkleMax = 0.95 + Math.random() * 0.05; drift = Math.random() * 40 - 20;
      } else {
        size = Math.random() * 6 + 4; opacity = 0.8 + Math.random() * 0.2;
        twinkleMax = 0.95 + Math.random() * 0.05; drift = Math.random() * 50 - 25;
      }

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * -15}vh`;

      const fallDuration = Math.random() * 60 + 40;
      const twinkleDuration = Math.random() * 6 + 4;
      particle.style.animationDuration = `${fallDuration}s, ${twinkleDuration}s`;
      particle.style.animationDelay = `${Math.random() * 60}s, ${Math.random() * 6}s`;

      particle.style.setProperty('--drift', `${drift}px`);
      particle.style.setProperty('--opacity', opacity);
      particle.style.setProperty('--twinkle-max', twinkleMax);

      container.appendChild(particle);
    }
  }

  function removeParticlesFrom(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
    container.style.display = "none";
  }

  function ensureParticles() {
    particleContainers.forEach(container => {
      if (settingsState["toggle-particles"]) {
        createParticlesFor(container);
      } else {
        removeParticlesFrom(container);
      }
    });
  }

  /* ----------------- VIDEO SHOW/HIDE ----------------- */
  function showVideo(card) {
    if (!bgVideo || !bgSource) return;
    if (!settingsState["toggle-bgvideo"]) return;

    const videoSrc = card.dataset.video;
    if (!videoSrc) return;

    // if it's already the same src and visible, ensure classes and footer are set
    if (bgSource.src && bgSource.src.endsWith(videoSrc)) {
      body.classList.add('background-shadow');
      body.classList.remove('background-before');
      footer?.classList.add('background-color');
      return;
    }

    clearTimeout(fadeTimeout);
    bgVideo.style.opacity = '0';

    fadeTimeout = setTimeout(() => {
      bgSource.src = videoSrc;
      try { bgVideo.load(); } catch(e){}
      bgVideo.play().catch(()=>{});
      bgVideo.style.opacity = '1';

      // show body::after, hide body::before
      body.classList.add('background-shadow');
      body.classList.remove('background-before');

      // show footer background
      footer?.classList.add('background-color');
    }, 50);
  }

  function hideVideo() {
    if (!bgVideo) return;
    if (!settingsState["toggle-bgvideo"]) return;

    clearTimeout(fadeTimeout);
    try { bgVideo.pause(); bgVideo.currentTime = 0; } catch(e){}
    bgVideo.style.opacity = '0';

    // hide body::after, show body::before
    body.classList.remove('background-shadow');
    body.classList.add('background-before');

    footer?.classList.remove('background-color');
  }

  // used when turning BGVideo OFF from settings: force-reset and remove src
  function hideVideoImmediate() {
    if (!bgVideo) return;
    clearTimeout(fadeTimeout);
    try { bgVideo.pause(); bgVideo.currentTime = 0; } catch(e){}
    bgVideo.style.opacity = '0';
    if (bgSource) {
      try { bgSource.src = ""; bgVideo.load(); } catch(e){}
    }
    body.classList.remove('background-shadow');
    body.classList.add('background-before');
    footer?.classList.remove('background-color');
  }

  function initGridcardVideoListeners() {
    const cards = Array.from(document.querySelectorAll('.gridcard'));
    cards.forEach(card => {
      if (!card.dataset || !card.dataset.video) return;
      card.addEventListener('pointerenter', () => showVideo(card));
      card.addEventListener('pointerleave', () => hideVideo());
      card.addEventListener('focus', () => showVideo(card));
      card.addEventListener('blur', () => hideVideo());
    });
  }

  /* ----------------- APPLY SETTINGS TO DOM & UI ----------------- */
  function applySettingToDOM(id) {
    const cfg = config[id];
    const isOn = settingsState[id];

    // handle exclusivity (if turning ON, turn exclusives OFF)
    if (cfg.exclusiveWith && isOn) {
      cfg.exclusiveWith.forEach(exId => {
        if (settingsState[exId]) {
          settingsState[exId] = false;
          saveState(exId);
          // remove ex class from body
          const exCfg = config[exId];
          if (exCfg.applyWhen === "on") body.classList.remove(exCfg.className);
          else body.classList.remove(exCfg.className);
          // update ex button UI if present
          const exBtn = document.getElementById(exId);
          if (exBtn) updateButtonUI(exBtn, exId);
        }
      });
    }

    // apply body class; applyWhen === "on" means class present when setting is ON
    if (cfg.applyWhen === "on") {
      body.classList.toggle(cfg.className, isOn);
    } else {
      body.classList.toggle(cfg.className, !isOn);
    }

    // special cases:
    if (id === "toggle-particles") {
      ensureParticles();
    }

    if (id === "toggle-buttons") {
      // force reflow so animation stops/starts immediately
      void document.body.offsetHeight;
    }

    if (id === "toggle-bgvideo") {
      if (!isOn) {
        hideVideoImmediate();
      }
      // if ON, nothing to do here — hover will trigger showVideo
    }

    if (id === "toggle-darkmode" && isOn) {
      // ensure high-contrast off
      body.classList.remove(config["toggle-highcontrastmode"].className);
    }

    if (id === "toggle-highcontrastmode" && isOn) {
      body.classList.remove(config["toggle-darkmode"].className);
    }

    // persist
    saveState(id);
  }

  function updateButtonUI(button, id) {
    const cfg = config[id];
    const isOn = settingsState[id];

    if (cfg.mode === "fontsize") {
      button.textContent = `Toggle ${cfg.label}: ${isOn ? "Large" : "Regular"}`;
    } else {
      button.textContent = `Toggle ${cfg.label}: ${isOn ? "On" : "Off"}`;
    }

    button.setAttribute("aria-pressed", isOn);
    // your stylesheet uses .gridcard.off for darker palette; keep that behavior:
    button.classList.toggle("off", !isOn);
  }

  function initializeSettingsPage() {
    loadInitialState(); // populate settingsState from localStorage or defaults

    const buttons = Array.from(document.querySelectorAll(".settings-page .gridcard"));

    // Ensure particleContainers exist or were found
    particleContainers.forEach(c => {
      // placeholder - no-op; createParticlesFor handles generation when setting on
    });

    buttons.forEach(btn => {
      const id = btn.id;
      if (!config[id]) return;

      // Ensure UI matches state and DOM classes applied
      updateButtonUI(btn, id);
      applySettingToDOM(id);

      // Click handler: toggle, apply, update UI, update exclusives
      btn.addEventListener('click', () => {
        settingsState[id] = !settingsState[id];
        saveState(id);
        applySettingToDOM(id);

        // Update this button UI and any exclusives/others
        updateButtonUI(btn, id);
        // If exclusives were affected, update them too
        if (config[id].exclusiveWith) {
          config[id].exclusiveWith.forEach(exId => {
            const exBtn = document.getElementById(exId);
            if (exBtn) updateButtonUI(exBtn, exId);
          });
        }

        // After toggle, update all buttons to ensure sync (safe and simple)
        Object.keys(config).forEach(otherId => {
          const otherBtn = document.getElementById(otherId);
          if (otherBtn) updateButtonUI(otherBtn, otherId);
        });
      });
    });
  }

  /* ----------------- RUN INIT ----------------- */
  initializeSettingsPage();
  initGridcardVideoListeners();

  // Start particles if initial state says so
  ensureParticles();

  // If bgvideo saved OFF, ensure video is fully hidden
  if (!settingsState["toggle-bgvideo"]) hideVideoImmediate();

  // Force reflow to make sure animation toggles take effect immediately
  void document.body.offsetHeight;

  // Rebuild particles on window resize (if enabled)
  window.addEventListener('resize', () => {
    if (settingsState["toggle-particles"]) {
      ensureParticles();
    }
  });
});
