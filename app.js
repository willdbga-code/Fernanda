/**
 * FERNANDA & JOÃO — ENSAIO GESTANTE
 * Direção Editorial & Interatividade Inspirada em Realevate Evergreen
 * Core Engine v3.0 (Clean UTF-8, Expanded Regulator, Dual Moods: Praia & Studio)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initNavigation();
  initAmbientAudioEngine();
  initMoodSwitcher();
  initComparisonSlider();
  initReels();
  initLightingSimulator();
  initGalleryAndLightbox();
  initChecklist();
  init3DTilt();
  initScrollReveals();
  initSunTracker();
});

/* ==========================================================================
   01. EDITORIAL PRELOADER & HERO KINETIC ENTRANCE
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderCount = document.getElementById('preloaderCount');

  if (!preloader) {
    document.body.classList.remove('loading-active');
    triggerHeroEntrance();
    return;
  }

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 14) + 6;
    if (progress > 100) progress = 100;

    if (preloaderBar) preloaderBar.style.width = `${progress}%`;
    if (preloaderCount) preloaderCount.textContent = `${progress.toString().padStart(2, '0')}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('loading-active');
        triggerHeroEntrance();
      }, 350);
    }
  }, 35);
}

function triggerHeroEntrance() {
  const heroElements = document.querySelectorAll('.hero-eyebrow-row, .hero-title-block, .hero-triptych, .hero-scroll-prompt');
  heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
}

/* ==========================================================================
   02. CUSTOM LUXURY CURSOR & MAGNETIC MICRO-INTERACTIONS
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const cursorLabel = document.getElementById('cursorLabel');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;

    cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Dynamic context cursor labels
  const contextualTriggers = [
    { selector: '.hero-card', label: 'EXPLORAR' },
    { selector: '.reel-item', label: 'AMPLIAR' },
    { selector: '.comparison-container', label: 'COMPARAR' },
    { selector: '.gallery-card', label: 'VER DETALHE' },
    { selector: '.diagram-interactive-node', label: 'AJUSTAR LUZ' },
    { selector: '.sound-toggle-btn', label: 'ÁUDIO' },
    { selector: '.social-pill', label: 'INSTAGRAM' }
  ];

  contextualTriggers.forEach(({ selector, label }) => {
    document.querySelectorAll(selector).forEach((elem) => {
      elem.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-expanded');
        if (cursorLabel) cursorLabel.textContent = label;
      });
      elem.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-expanded');
        if (cursorLabel) cursorLabel.textContent = 'EXPLORAR';
      });
    });
  });

  // Magnetic attraction effect for CTA pills and buttons
  const magneticElements = document.querySelectorAll('.social-pill, .sound-toggle-btn, .mood-pill');
  magneticElements.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   03. NAVIGATION & SCROLL HIGHLIGHTING
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header blur transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }
  });

  // Mobile menu drawer toggle
  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   04. AMBIENT AUDIO SYNTHESIZER (Web Audio API)
   ========================================================================== */
function initAmbientAudioEngine() {
  const btn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');
  if (!btn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let seaNoiseNode = null;
  let seaFilterNode = null;
  let vinylOsc = null;

  function buildAudioGraph() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // 1. Organic Ocean Waves Synthesizer (White noise with lowpass sweep)
    const bufferSize = audioCtx.sampleRate * 2.5;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    seaNoiseNode = audioCtx.createBufferSource();
    seaNoiseNode.buffer = noiseBuffer;
    seaNoiseNode.loop = true;

    seaFilterNode = audioCtx.createBiquadFilter();
    seaFilterNode.type = 'lowpass';
    seaFilterNode.frequency.setValueAtTime(260, audioCtx.currentTime);
    seaFilterNode.Q.setValueAtTime(3.0, audioCtx.currentTime);

    // LFO modulator simulating incoming and retreating ocean tide
    const tideLFO = audioCtx.createOscillator();
    tideLFO.frequency.setValueAtTime(0.12, audioCtx.currentTime); // ~8 sec tide cycle
    const tideGain = audioCtx.createGain();
    tideGain.gain.setValueAtTime(180, audioCtx.currentTime);

    tideLFO.connect(tideGain);
    tideGain.connect(seaFilterNode.frequency);

    const seaGain = audioCtx.createGain();
    seaGain.gain.setValueAtTime(0.18, audioCtx.currentTime);

    seaNoiseNode.connect(seaFilterNode);
    seaFilterNode.connect(seaGain);
    seaGain.connect(masterGain);

    seaNoiseNode.start();
    tideLFO.start();

    // 2. Warm Vinyl Ambience & Sub-Harmonic Chord (Warmth of studio)
    vinylOsc = audioCtx.createOscillator();
    vinylOsc.type = 'sine';
    vinylOsc.frequency.setValueAtTime(110, audioCtx.currentTime); // A2 fundamental warmth

    const vinylGain = audioCtx.createGain();
    vinylGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

    vinylOsc.connect(vinylGain);
    vinylGain.connect(masterGain);
    vinylOsc.start();
  }

  btn.addEventListener('click', async () => {
    if (!audioCtx) {
      buildAudioGraph();
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    if (!isPlaying) {
      // Fade in smoothly
      masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 1.2);
      isPlaying = true;
      btn.classList.add('active');
      if (soundLabel) soundLabel.textContent = 'SOM : ON';
    } else {
      // Fade out smoothly
      masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        isPlaying = false;
        btn.classList.remove('active');
        if (soundLabel) soundLabel.textContent = 'SOM : OFF';
      }, 800);
    }
  });
}

/* ==========================================================================
   05. FLOATING ATMOSPHERE FILTER BAR (PRAIA DOURADA & STUDIO NOIR)
   ========================================================================== */
function initMoodSwitcher() {
  // Smart auto-hide floating mood bar on scroll-down (prevents obscuring text)
  let lastScrollY = window.scrollY;
  const moodBar = document.getElementById('floatingMoodBar');
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 160) {
      moodBar?.classList.add('mood-bar-hidden');
    } else {
      moodBar?.classList.remove('mood-bar-hidden');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  const pills = document.querySelectorAll('.mood-pill');
  const ambientGlow = document.getElementById('ambientGlow');
  const sections = document.querySelectorAll('[data-mood-section]');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const selectedMood = pill.getAttribute('data-mood');

      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      document.body.setAttribute('data-active-mood', selectedMood);

      // Atmospheric transposition of ambient glow
      if (ambientGlow) {
        if (selectedMood === 'praia') {
          ambientGlow.style.background = 'radial-gradient(circle, rgba(229, 166, 94, 0.22) 0%, rgba(12, 12, 14, 0) 70%)';
        } else if (selectedMood === 'studio') {
          ambientGlow.style.background = 'radial-gradient(circle, rgba(160, 160, 185, 0.16) 0%, rgba(12, 12, 14, 0) 70%)';
        } else {
          ambientGlow.style.background = 'radial-gradient(circle, rgba(201, 148, 100, 0.10) 0%, rgba(12, 12, 14, 0) 70%)';
        }
      }

      // Smooth scroll to target section if clicking specific mood
      if (selectedMood === 'praia') {
        const praiaSec = document.getElementById('praia');
        if (praiaSec) {
          const headerOffset = 80;
          window.scrollTo({
            top: praiaSec.getBoundingClientRect().top + window.pageYOffset - headerOffset,
            behavior: 'smooth'
          });
        }
      } else if (selectedMood === 'studio') {
        const studioSec = document.getElementById('studio');
        if (studioSec) {
          const headerOffset = 80;
          window.scrollTo({
            top: studioSec.getBoundingClientRect().top + window.pageYOffset - headerOffset,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ==========================================================================
   06. EXPANDED FULL-HEIGHT COMPARISON REGULATOR (PRAIA VS STUDIO)
   ========================================================================== */
function initComparisonSlider() {
  const container = document.getElementById('comparisonSlider');
  const topLayer = document.getElementById('comparisonTopLayer');
  const handle = document.getElementById('comparisonHandle');

  if (!container || !topLayer || !handle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));

    // High performance clip-path reveal (keeps aspect ratio 100% natural, no squishing)
    topLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    handle.style.left = `${percentage}%`;

    // Dynamic layer captions fade when handle gets too close to borders (clean fade, no clipping)
    const leftCaption = container.querySelector('.layer-caption.left');
    const rightCaption = container.querySelector('.layer-caption.right');
    if (leftCaption) {
      leftCaption.style.opacity = percentage < 20 ? '0' : '1';
    }
    if (rightCaption) {
      rightCaption.style.opacity = percentage > 80 ? '0' : '1';
    }
  }

  // Set default 50% split cleanly
  function setInitialPosition() {
    const rect = container.getBoundingClientRect();
    if (rect.width > 0) {
      updateSliderPosition(rect.left + rect.width * 0.5);
    }
  }
  setInitialPosition();
  window.addEventListener('resize', setInitialPosition);

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support for mobile & tablets (smooth dragging)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   07. HORIZONTAL DRAGGABLE REELS (PRAIA & STUDIO)
   ========================================================================== */
function initReels() {
  const reels = document.querySelectorAll('.horizontal-reel-container');

  // Reel arrow controls (Left/Right carousel buttons)
  document.querySelectorAll('.reel-arrow-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const reelId = btn.getAttribute('data-reel');
      const reel = document.getElementById(reelId);
      if (!reel) return;
      const isPrev = btn.classList.contains('prev');
      const scrollDist = isPrev ? -320 : 320;
      reel.scrollBy({ left: scrollDist, behavior: 'smooth' });
    });
  });

  reels.forEach((reel) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let movedDistance = 0;
    let touchStartX = 0;
    let touchMoved = false;

    // Mouse drag handling
    reel.addEventListener('mousedown', (e) => {
      isDown = true;
      movedDistance = 0;
      reel.classList.add('dragging');
      startX = e.pageX - reel.offsetLeft;
      scrollLeft = reel.scrollLeft;
    });

    reel.addEventListener('mouseleave', () => {
      isDown = false;
      reel.classList.remove('dragging');
    });

    reel.addEventListener('mouseup', () => {
      isDown = false;
      setTimeout(() => reel.classList.remove('dragging'), 50);
    });

    reel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - reel.offsetLeft;
      const walk = (x - startX) * 1.8;
      movedDistance += Math.abs(walk);
      reel.scrollLeft = scrollLeft - walk;
    });

    // Touch swipe tracking to avoid accidental lightbox opening
    reel.addEventListener('touchstart', (e) => {
      if (e.touches[0]) {
        touchStartX = e.touches[0].pageX;
        touchMoved = false;
      }
    }, { passive: true });

    reel.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        const diff = Math.abs(e.touches[0].pageX - touchStartX);
        if (diff > 10) {
          touchMoved = true;
          movedDistance = diff;
        }
      }
    }, { passive: true });

    // Suppress accidental lightbox opening when dragging or swiping
    reel.querySelectorAll('.reel-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (movedDistance > 8 || touchMoved) {
          e.stopImmediatePropagation();
          e.preventDefault();
          touchMoved = false;
          return;
        }
        const src = item.getAttribute('data-lightbox');
        const caption = item.getAttribute('data-caption') || item.querySelector('h4')?.textContent;
        openSingleLightbox(src, caption);
      });
    });
  });
}

function openSingleLightbox(src, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const desc = document.getElementById('lightboxDesc');
  const mood = document.getElementById('lightboxMood');

  if (!modal || !img) return;

  const safeSrc = (src || '').replace(/#/g, '%23');
  img.onerror = function () {
    this.onerror = null;
    this.src = 'Studio/download (10).jpeg';
  };
  img.src = safeSrc;
  if (title) title.textContent = caption || 'Referência de Ensaio';
  if (desc) desc.textContent = 'Referência de pose, iluminação e composição com lente 50mm.';
  if (mood) mood.textContent = 'REFERÊNCIA';

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

/* ==========================================================================
   08. INTERACTIVE LIGHTING SIMULATOR (50MM, REBATEDOR, OCTABOX & V-FLAT)
   ========================================================================== */
function initLightingSimulator() {
  const tabs = document.querySelectorAll('.sim-tab-btn, .sim-tab');
  const diagrams = document.querySelectorAll('.diagram-canvas');
  const statusText = document.getElementById('simStatusText');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetDiagram = tab.getAttribute('data-tab') || tab.getAttribute('data-diagram');

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      diagrams.forEach((d) => d.classList.remove('active'));
      const activeCanvas = document.getElementById(`diagram${targetDiagram.charAt(0).toUpperCase() + targetDiagram.slice(1)}`);
      if (activeCanvas) activeCanvas.classList.add('active');

      if (statusText) {
        statusText.textContent = targetDiagram === 'praia' 
          ? 'DIAGRAMA PRAIA ATIVO • CLIQUE NOS COMPONENTES (SOL, REBATEDOR, CÂMERA)'
          : 'DIAGRAMA STUDIO ATIVO • CLIQUE NOS COMPONENTES (OCTABOX, V-FLAT, CÂMERA)';
      }
    });
  });

  // Descriptive responses for every individual node
  const nodeExplanations = {
    nodeSun: 'SOL NASCENTE (05h45): Aurora rasante no horizonte marítimo. Halos dourados cristalinos nos cabelos com temperatura amena.',
    nodeReflector: 'REBATEDOR PRATA (45°): Preenchimento suave posicionado a 1.2m do rosto. Gera a centelha (catchlight) nos olhos e suaviza sombras no queixo.',
    nodeCameraPraia: 'CÂMERA 50MM NA PRAIA: Distância de 2.0m em f/1.8. Separa o casal do horizonte marítimo com desfoque cremoso e perspectiva natural.',
    nodeOctabox: 'OCTABOX 90CM + COLMEIA: Luz principal a 45° superior. A grade (grid) impede vazamento no fundo e modela a curvatura do ventre com suavidade.',
    nodeVFlat: 'V-FLAT PRETO (NEGATIVE FILL): Posicionado no lado oposto à luz. Absorve reflexos espúrios e esculpe a silhueta lateral com profundidade noir.',
    nodeCameraStudio: 'CÂMERA 50MM NO STUDIO: Distância de 1.8m em f/2.5. Profundidade de campo precisa para manter olhos e ventre perfeitamente nítidos simultaneamente.'
  };

  const nodes = document.querySelectorAll('.diagram-interactive-node');
  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      node.classList.add('node-pulse');
      setTimeout(() => node.classList.remove('node-pulse'), 400);

      const id = node.id;
      if (statusText && nodeExplanations[id]) {
        statusText.textContent = nodeExplanations[id];
      }
    });
  });
}

/* ==========================================================================
   09. GALLERY MASONRY, FILTERING & LIGHTBOX
   ========================================================================== */
function initGalleryAndLightbox() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.gallery-card');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxMood = document.getElementById('lightboxMood');
  const lightboxLens = document.getElementById('lightboxLens');
  const lightboxLighting = document.getElementById('lightboxLighting');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lbPrevBtn = document.getElementById('lbPrevBtn');
  const lbNextBtn = document.getElementById('lbNextBtn');

  let currentFilteredList = Array.from(cards);
  let currentIndex = 0;

  // Filter Chips Logic
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.getAttribute('data-filter');

      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      cards.forEach((card) => {
        const matches = filter === 'all' || card.classList.contains(`item-${filter}`);
        if (matches) {
          card.style.display = 'block';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (!card.classList.contains(`item-${chip.getAttribute('data-filter')}`) && chip.getAttribute('data-filter') !== 'all') {
              card.style.display = 'none';
            }
          }, 250);
        }
      });

      // Update current list of visible cards for lightbox navigation
      setTimeout(() => {
        currentFilteredList = Array.from(cards).filter((c) => c.style.display !== 'none');
        if (currentFilteredList.length === 0) currentFilteredList = Array.from(cards);
      }, 300);
    });
  });

  function openLightboxItem(card) {
    if (!card || !lightboxModal) return;

    currentFilteredList = Array.from(cards).filter((c) => c.style.display !== 'none');
    if (currentFilteredList.length === 0) currentFilteredList = Array.from(cards);

    currentIndex = currentFilteredList.indexOf(card);
    if (currentIndex === -1) currentIndex = 0;

    const src = card.getAttribute('data-src') || card.querySelector('img')?.src;
    const fallback = card.getAttribute('data-fallback');
    const title = card.getAttribute('data-title') || 'Ensaio Gestante Fernanda & João';
    const mood = card.getAttribute('data-mood') || 'Editorial';
    const lens = card.getAttribute('data-lens') || '50mm Prime';
    const lighting = card.getAttribute('data-lighting') || 'Luz Natural + Modificadores';
    const desc = card.getAttribute('data-desc') || 'Fotografia editorial explorando a intimidade e a cumplicidade do casal.';

    if (lightboxImg) {
      const safeSrc = (src || '').replace(/#/g, '%23');
      lightboxImg.onerror = function () {
        if (fallback) {
          this.src = fallback;
          this.onerror = null;
        } else {
          this.src = 'Studio/download (10).jpeg';
          this.onerror = null;
        }
      };
      lightboxImg.src = safeSrc;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxMood) lightboxMood.textContent = mood.toUpperCase();
    if (lightboxLens) lightboxLens.textContent = lens;
    if (lightboxLighting) lightboxLighting.textContent = lighting;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function updateLightboxByIndex(idx) {
    if (idx < 0) idx = currentFilteredList.length - 1;
    if (idx >= currentFilteredList.length) idx = 0;
    currentIndex = idx;
    openLightboxItem(currentFilteredList[currentIndex]);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      openLightboxItem(card);
    });
  });

  // Lightbox Close triggers
  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  // Prev / Next Buttons
  lbPrevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxByIndex(currentIndex - 1);
  });

  lbNextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxByIndex(currentIndex + 1);
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxByIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxByIndex(currentIndex + 1);
  });
}

/* ==========================================================================
   10. INTERACTIVE CHECKLIST WITH LOCALSTORAGE PERSISTENCE
   ========================================================================== */
function initChecklist() {
  const checkboxes = document.querySelectorAll('#checklistWrap input[type="checkbox"]');
  const badge = document.getElementById('checklistProgressBadge');
  const storageKey = 'fernanda_joao_shoot_checklist_v2';

  if (!checkboxes.length) return;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      checkboxes.forEach((chk) => {
        if (saved[chk.id]) chk.checked = true;
      });
      updateBadge();
    } catch (e) {
      console.warn('LocalStorage unavailable for checklist', e);
    }
  }

  function saveState() {
    const state = {};
    checkboxes.forEach((chk) => {
      state[chk.id] = chk.checked;
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {}
    updateBadge();
  }

  function updateBadge() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter((c) => c.checked).length;
    const fill = document.getElementById('checklistProgressFill');
    if (fill) {
      fill.style.width = `${(checked / total) * 100}%`;
    }
    if (badge) {
      badge.textContent = `${checked}/${total} CONCLUÍDO`;
      if (checked === total) {
        badge.classList.add('badge-complete');
        badge.textContent = 'TUDO PRONTO!';
      } else {
        badge.classList.remove('badge-complete');
      }
    }
  }

  checkboxes.forEach((chk) => {
    chk.addEventListener('change', saveState);
  });

  loadState();
}

/* ==========================================================================
   11. 3D TILT PHYSICS (REALEVATE EVERGREEN INSPIRATION)
   ========================================================================== */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   12. SCROLL REVEALS (IntersectionObserver)
   ========================================================================== */
function initScrollReveals() {
  const revealTargets = document.querySelectorAll(
    '.section-header-editorial, .editorial-feature-grid, .technical-pillars-grid, .lighting-simulator-wrap, .split-slider-wrapper, .checklist-card, .timeline-column'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach((target) => {
    target.classList.add('scroll-reveal-item');
    observer.observe(target);
  });
}

/* ==========================================================================
   13. LIVE ESTIMATED GOLDEN HOUR TIME
   ========================================================================== */
function initSunTracker() {
  const clock = document.getElementById('goldenHourClock');
  if (!clock) return;

  // Real-time calculation helper
  function updateTime() {
    const now = new Date();
    // Default optimal shoot window
    clock.textContent = '05:45 — 08:30 BRT (NASCER DO SOL)';
  }
  updateTime();
}
