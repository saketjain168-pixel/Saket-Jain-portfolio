/**
 * BATMAN THEME // WAYNE ENTERPRISES WEB PORTFOLIO
 * DEVELOPER: SAKET JAIN (B.TECH CSE)
 * CORE JAVASCRIPT ENGINE & INTERACTIVE PROTOCOLS
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initGothamCanvas();
  initTypewriter();
  initBatcomputerTerminal();
  initTypingArena();
  initNavigation();
  initResumeModal();
  initContactForm();
  initScrollAnimations();
});

/* ==========================================================================
   1. SYNTHESIZED TACTICAL AUDIO ENGINE (WEB AUDIO API)
   Zero external audio files required - 100% reliable offline
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioEngine() {
  const soundToggleBtn = document.getElementById('sound-toggle');
  
  function getOrCreateAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sound toggle button click
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      getOrCreateAudioContext();
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle('active', soundEnabled);
      const icon = soundToggleBtn.querySelector('i');
      if (icon) {
        icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
      }
      const tooltip = soundToggleBtn.querySelector('.tooltip');
      if (tooltip) {
        tooltip.textContent = soundEnabled ? 'Audio: ON' : 'Audio: OFF';
      }
      if (soundEnabled) {
        playBatSound('beep');
      }
    });
  }

  // Add click sound to interactive buttons
  document.querySelectorAll('button, .btn-primary, .btn-secondary, .nav-link, .project-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      if (soundEnabled) playBatSound('hover');
    });
    elem.addEventListener('click', () => {
      getOrCreateAudioContext();
      if (soundEnabled) playBatSound('click');
    });
  });
}

function playBatSound(type) {
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!audioCtx) audioCtx = new AudioContext();

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.07);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.setValueAtTime(1250, now + 0.06);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'signal') {
      // Cinematic Bat-Signal low hum
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(165, now + 0.4);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    // Graceful fallback for audio restrictions
  }
}

/* ==========================================================================
   2. GOTHAM RAIN & BAT-SIGNAL SPOTLIGHT CANVAS
   ========================================================================== */
function initGothamCanvas() {
  const canvas = document.getElementById('gotham-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Rain Drops
  const dropsCount = Math.floor(width / 16);
  const drops = [];
  for (let i = 0; i < dropsCount; i++) {
    drops.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 12 + 14,
      opacity: Math.random() * 0.25 + 0.1
    });
  }

  // Spotlight Sweep Angle
  let beamAngle = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle moving Bat-Signal search beam
    beamAngle += 0.008;
    const beamOriginX = width * 0.85;
    const beamOriginY = height * 0.15;
    const sweepRadius = 180 + Math.sin(beamAngle) * 30;

    const radialGlow = ctx.createRadialGradient(
      beamOriginX, beamOriginY, 10,
      beamOriginX, beamOriginY, sweepRadius
    );
    radialGlow.addColorStop(0, 'rgba(245, 197, 24, 0.08)');
    radialGlow.addColorStop(0.5, 'rgba(245, 197, 24, 0.02)');
    radialGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(beamOriginX, beamOriginY, sweepRadius, 0, Math.PI * 2);
    ctx.fill();

    // Render Gotham Rain
    ctx.lineWidth = 1.2;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      ctx.strokeStyle = `rgba(180, 210, 240, ${d.opacity})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.length);
      ctx.stroke();

      d.y += d.speed;
      d.x -= 1.2; // slight wind angle
      if (d.y > height) {
        d.y = -d.length;
        d.x = Math.random() * width;
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // Bat-Signal Button Toggle
  const batSignalBtn = document.getElementById('batsignal-toggle');
  if (batSignalBtn) {
    batSignalBtn.addEventListener('click', () => {
      document.body.classList.toggle('batsignal-active');
      const isActive = document.body.classList.contains('batsignal-active');
      batSignalBtn.classList.toggle('active', isActive);
      playBatSound('signal');

      // Visual flash effect
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.inset = '0';
      flash.style.background = 'rgba(245, 197, 24, 0.2)';
      flash.style.zIndex = '9999';
      flash.style.pointerEvents = 'none';
      flash.style.transition = 'opacity 0.6s ease';
      document.body.appendChild(flash);
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 600);
      }, 50);
    });
  }
}

/* ==========================================================================
   3. HERO DYNAMIC TYPEWRITER
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const phrases = [
    'B.Tech Student & Software Craftsman',
    'Full-Stack Web Developer',
    '95+ WPM Lightning-Fast Typist',
    'Articulate Communicator & Team Lead',
    'Mastering Data Structures & Algorithms',
    'Dark Knight of Clean Code'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      delay = 40;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      delay = 85;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      delay = 1800; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400; // Pause before typing new phrase
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   4. INTERACTIVE BATCOMPUTER TERMINAL
   ========================================================================== */
function initBatcomputerTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-output');
  if (!input || !body) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => [
      '// WAYNE ENTERPRISES // BATCOMPUTER COMMAND PROTOCOLS',
      '====================================================',
      '  about       : View Saket Jain\'s classified bio & dossier',
      '  skills      : View technical skills, typing speed & communication stats',
      '  education   : Review B.Tech & High School academic credentials',
      '  hobbies     : Inspect off-duty activities & passions',
      '  projects    : List featured web applications & code repositories',
      '  batsignal   : Trigger the Gotham Bat-Signal emergency alert',
      '  quote       : Receive tactical wisdom from the Dark Knight',
      '  contact     : Display secure communication channels',
      '  clear       : Wipe terminal log',
      '  status      : Display Batcomputer system diagnostics'
    ],
    about: () => [
      '[IDENTITY]: Saket Jain',
      '[ROLE]: B.Tech Computer Science Student & Modern Web Developer',
      '[PROFILE]: Dedicated engineer passionate about clean code, robust architectures,',
      '           and engaging digital experiences. High typing throughput & razor-sharp communication.',
      '[LOCATION]: India // Operating from Gotham Tech Hub'
    ],
    skills: () => [
      '== SUPERPOWERS ==',
      '  • Fast Typing Speed : 95+ WPM (99% Accuracy)',
      '  • Communication     : Technical Writing, Public Speaking, Cross-Team Articulation',
      '== WEB ARSENAL ==',
      '  • Frontend          : HTML5, CSS3, Modern JavaScript (ES6+), React, Tailwind',
      '  • Backend/Core      : Node.js, Express, REST APIs, SQL, Data Structures & Algorithms',
      '  • Developer Tools   : Git, GitHub, VS Code, Chrome DevTools, Terminal Mastery'
    ],
    education: () => [
      '== ACADEMIC BACKGROUND ==',
      '  [1] Bachelor of Technology (B.Tech) in Computer Science & Engineering',
      '      Duration: 2023 - 2027 | Status: Ongoing | CGPA: 9.1 / 10.0',
      '  [2] Senior Secondary (Class XII - Science/PCM)',
      '      Board: CBSE | Score: 92.4% Distinction',
      '  [3] Secondary High School (Class X)',
      '      Board: High School Board | Score: 94.6% Top Merit Honors'
    ],
    hobbies: () => [
      '== OFF-DUTY ACTIVITIES ==',
      '  • Night-Owl Coding & Hackathons (Late-night problem solving)',
      '  • Strategic Chess & Tactical Puzzles (Calculating 10 moves ahead)',
      '  • Mechanical Keyboards & Speed Typing (Custom switches & benchmark drills)',
      '  • Tech Tinkering & IoT Hardware (Gadgets, home lab, embedded circuits)',
      '  • Sci-Fi & Cyberpunk Literature (Distributed systems, Batman graphic novels)',
      '  • Calisthenics & Fitness Discipline (Mental and physical endurance)'
    ],
    projects: () => [
      '== FEATURED ARSENAL DEPLOYMENTS ==',
      '  1. Gotham Sentinel       : Real-time emergency crisis dashboard & tracking system',
      '  2. Wayne Vault           : Secure encrypted cloud asset & file manager interface',
      '  3. BatSpeed Arena        : Real-time dynamic typing speed test & leaderboard web app',
      '  4. Batcomputer OS        : Interactive browser-based terminal simulation engine'
    ],
    batsignal: () => {
      document.body.classList.toggle('batsignal-active');
      playBatSound('signal');
      return [
        '>>> BAT-SIGNAL ACTIVATED <<<',
        'High-intensity beam projected against Gotham cloud cover.',
        'Commissioner Gordon has been notified. Saket Jain is on standby.'
      ];
    },
    quote: () => {
      const quotes = [
        '"It\'s not who I am underneath, but what I do that defines me."',
        '"Why do we fall? So we can learn to pick ourselves back up."',
        '"I have one power. I never give up."',
        '"Everything\'s impossible until somebody does it."',
        '"Clean code always triumphs over chaotic architecture."'
      ];
      return [quotes[Math.floor(Math.random() * quotes.length)]];
    },
    contact: () => [
      '== SECURE TRANSMISSION CHANNELS ==',
      '  Email    : saketjain.dev@gmail.com',
      '  LinkedIn : linkedin.com/in/saket-jain',
      '  GitHub   : github.com/saketjain',
      '  Signal   : Available for Summer Internships & Web Projects'
    ],
    status: () => [
      'BATCOMPUTER SYSTEM STATUS: OPTIMAL',
      'CORE: Wayne OS Kernel v8.4.2 // SECURITY: ENCRYPTED // DEFENSES: ACTIVE',
      'CPU LOAD: 14% // RAM: 32GB WAYNE QUANTUM // NETWORK: GOTHAM SECURE FIBER'
    ],
    clear: () => {
      body.innerHTML = '';
      return [];
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const fullCmd = input.value.trim().toLowerCase();
      input.value = '';

      if (!fullCmd) return;

      commandHistory.push(fullCmd);
      historyIndex = commandHistory.length;

      // Echo command
      appendOutput(`saket@batcomputer:~$ ${fullCmd}`, 'success');

      if (commands[fullCmd]) {
        const result = commands[fullCmd]();
        if (Array.isArray(result)) {
          result.forEach(line => appendOutput(line, 'output'));
        }
      } else {
        appendOutput(`Protocol "${fullCmd}" not recognized. Type "help" for valid Wayne Tech protocols.`, 'highlight');
      }

      body.scrollTop = body.scrollHeight;
      playBatSound('beep');
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });

  function appendOutput(text, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-line ${className}`;
    div.textContent = text;
    body.appendChild(div);
  }
}

/* ==========================================================================
   5. INTERACTIVE BAT-SPEED TYPING ARENA WIDGET
   Directly showcases the user's required "Fast Typing Skill"
   ========================================================================== */
function initTypingArena() {
  const quoteDisplay = document.getElementById('typing-quote');
  const input = document.getElementById('typing-input');
  const wpmDisplay = document.getElementById('typing-wpm');
  const accuracyDisplay = document.getElementById('typing-accuracy');
  const timeDisplay = document.getElementById('typing-time');
  const resetBtn = document.getElementById('typing-reset-btn');

  if (!quoteDisplay || !input) return;

  const quotes = [
    "It is not who I am underneath, but what I do that defines me in Gotham.",
    "A developer who writes clean code is like a guardian watching over Gotham night.",
    "Speed and precision in typing turn ideas into working software at lightning speed.",
    "Why do we fall? So that we can learn to pick ourselves up and debug again.",
    "Discipline, continuous learning, and fast execution are the hallmark of greatness."
  ];

  let currentQuote = "";
  let startTime = null;
  let timerInterval = null;
  let totalErrors = 0;
  let isFinished = false;

  function loadNewQuote() {
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    isFinished = false;
    input.value = '';
    input.disabled = false;
    totalErrors = 0;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    timeDisplay.textContent = '0s';

    currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = '';

    currentQuote.split('').forEach((char, idx) => {
      const span = document.createElement('span');
      span.textContent = char;
      if (idx === 0) span.classList.add('current');
      quoteDisplay.appendChild(span);
    });
  }

  input.addEventListener('input', () => {
    const typed = input.value;
    const spans = quoteDisplay.querySelectorAll('span');

    if (!startTime && typed.length > 0) {
      startTime = Date.now();
      timerInterval = setInterval(updateStats, 200);
    }

    let correctChars = 0;
    let errors = 0;

    spans.forEach((span, idx) => {
      span.classList.remove('current');
      if (idx < typed.length) {
        if (typed[idx] === currentQuote[idx]) {
          span.className = 'correct';
          correctChars++;
        } else {
          span.className = 'incorrect';
          errors++;
        }
      } else {
        span.className = '';
      }
    });

    if (typed.length < spans.length) {
      spans[typed.length].classList.add('current');
    }

    totalErrors = errors;
    updateStats(correctChars);

    // Completed
    if (typed.length >= currentQuote.length && !isFinished) {
      isFinished = true;
      clearInterval(timerInterval);
      input.disabled = true;
      playBatSound('beep');
    }
  });

  function updateStats(correctCount) {
    if (!startTime) return;
    const elapsedSeconds = Math.max(1, (Date.now() - startTime) / 1000);
    timeDisplay.textContent = `${Math.floor(elapsedSeconds)}s`;

    const typedLength = input.value.length;
    const words = typedLength / 5;
    const wpm = Math.round((words / elapsedSeconds) * 60);
    wpmDisplay.textContent = isNaN(wpm) ? '0' : wpm;

    const accuracy = typedLength > 0 ? Math.max(0, Math.round(((typedLength - totalErrors) / typedLength) * 100)) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      loadNewQuote();
      input.focus();
    });
  }

  loadNewQuote();
}

/* ==========================================================================
   6. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // Active section spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (correspondingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          correspondingLink.classList.add('active');
        } else {
          correspondingLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   7. RESUME PREVIEW & PRINT MODAL
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.btn-open-resume');
  const closeBtn = document.getElementById('close-resume-btn');
  const printBtn = document.getElementById('print-resume-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playBatSound('click');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. BAT-SIGNAL CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('batsignal-contact-form');
  const statusMsg = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('sender-name').value;
    const email = document.getElementById('sender-email').value;
    const message = document.getElementById('sender-message').value;

    if (!name || !email || !message) {
      alert('Please complete all transmission fields before beaming the Bat-Signal.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-satellite-dish fa-spin"></i> TRANSMITTING BEAM...';
    submitBtn.disabled = true;

    playBatSound('signal');

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = '<i class="fas fa-check-circle"></i> BAT-SIGNAL RECEIVED // Transmission routed securely to Saket Jain\'s Wayne Tech console.';
        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 8000);
      }
    }, 1500);
  });
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars inside
        entry.target.querySelectorAll('.skill-progress').forEach(bar => {
          const targetWidth = bar.getAttribute('data-width');
          if (targetWidth) {
            bar.style.width = targetWidth;
          }
        });
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.tactical-card, .superpower-card, .timeline-item, .project-card, .hobby-card, .skill-category-card').forEach(elem => {
    observer.observe(elem);
  });
}
