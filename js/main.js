/* ============================================================
   Storyarche Studios — main.js
   ============================================================ */

// ===========================
// NAVIGATION — scroll + mobile
// ===========================
(function () {
  const header    = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (!header) return;

  // Stick + background on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (!navToggle || !navLinks) return;

  const spans = navToggle.querySelectorAll('span');

  function openMenu() {
    navLinks.classList.add('open');
    navToggle.classList.add('active');
    spans[0].style.transform = 'translateY(6px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });
})();


// ===========================
// REVEAL ON SCROLL
// ===========================
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // Fire hero reveals immediately (they're already in view on load)
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 80 + i * 120);
    });
  });
})();


// ===========================
// PORTFOLIO FILTER
// ===========================
(function () {
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
})();


// ===========================
// AUDIO PLAYERS
// ===========================
(function () {
  const PLAY_ICON  = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3 2l10 6-10 6V2z"/></svg>`;
  const PAUSE_ICON = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="5" height="12"/><rect x="9" y="2" width="5" height="12"/></svg>`;

  function formatTime(secs) {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function pauseAll(except) {
    document.querySelectorAll('.audio-player').forEach(p => {
      const a = p.querySelector('audio');
      if (a && a !== except) {
        a.pause();
        const btn = p.querySelector('.audio-play-btn');
        if (btn) btn.innerHTML = PLAY_ICON;
      }
    });
  }

  document.querySelectorAll('.audio-player').forEach(player => {
    const audio   = player.querySelector('audio');
    const playBtn = player.querySelector('.audio-play-btn');
    const fill    = player.querySelector('.audio-progress-fill');
    const bar     = player.querySelector('.audio-progress-bar');
    const time    = player.querySelector('.audio-time');

    if (!audio || !playBtn) return;

    playBtn.innerHTML = PLAY_ICON;

    // Play / Pause toggle
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        pauseAll(audio);
        audio.play().catch(() => {});
        playBtn.innerHTML = PAUSE_ICON;
      } else {
        audio.pause();
        playBtn.innerHTML = PLAY_ICON;
      }
    });

    // Progress bar update
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (fill) fill.style.width = pct + '%';
      if (time) time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    // Reset when track ends
    audio.addEventListener('ended', () => {
      playBtn.innerHTML = PLAY_ICON;
      if (fill) fill.style.width = '0%';
      if (time) time.textContent = '0:00';
    });

    // Seek on progress bar click
    if (bar) {
      bar.addEventListener('click', e => {
        if (!audio.duration) return;
        const rect  = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
      });
    }
  });
})();


// ===========================
// CONTACT FORM
// ===========================
(function () {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText   = submitBtn ? submitBtn.textContent : 'Send Message';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) return;

    // Disable button while sending
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          subject: subject ? subject.value : 'general',
          message: message.value.trim(),
        }),
      });

      if (!res.ok) throw new Error('Send failed');

      // Hide form, show success message
      form.style.display = 'none';
      if (success) success.classList.add('visible');
    } catch (err) {
      alert('Something went wrong. Please try again or email us directly.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = btnText;
      }
    }
  });
})();
