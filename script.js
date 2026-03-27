/* ════════════════════════════════════════════════
   ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ — script.js (Kannada Edition)
   Features: Confetti, Hearts, Character, Scratch,
             Balloons, Gallery, Emotions, Game,
             Quotes, Gifts, Write Message, Cursor
════════════════════════════════════════════════ */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ═══════════════════════════════
   TOAST UTILITY
═══════════════════════════════ */
function showToast(msg, dur = 2800) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), dur);
}

/* ═══════════════════════════════
   1. CONFETTI
═══════════════════════════════ */
(function Confetti() {
  const canvas = $('#confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;
  const COLORS = ['#e8637a','#f7b2be','#d4a853','#f0d078','#c13a56','#fff0f3','#a855f7','#ec4899'];
  const SHAPES = ['rect','circle','star'];
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  const mkParticle = () => ({
    x: Math.random() * W, y: -20,
    w: Math.random() * 10 + 5, h: Math.random() * 6 + 3,
    color: COLORS[Math.random() * COLORS.length | 0],
    shape: SHAPES[Math.random() * SHAPES.length | 0],
    vx: (Math.random() - .5) * 3, vy: Math.random() * 4 + 2,
    rot: Math.random() * Math.PI * 2, rotV: (Math.random() - .5) * .15, opacity: 1,
  });
  const drawStar = (ctx, x, y, r, c) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = a + (2 * Math.PI) / 5;
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      ctx.lineTo(x + Math.cos(b) * (r / 2.5), y + Math.sin(b) * (r / 2.5));
    }
    ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  };
  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
      if (p.y > H * .65) p.opacity -= .014;
      ctx.save(); ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.shape === 'rect') { ctx.fillStyle = p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); }
      else if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0,0,p.w/2,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill(); }
      else drawStar(ctx, 0, 0, p.w/2, p.color);
      ctx.restore();
      if (p.opacity <= 0 || p.y > H + 20) particles.splice(i, 1);
    }
    if (particles.length > 0) raf = requestAnimationFrame(loop);
  };
  const burst = (count = 200) => {
    resize();
    let launched = 0;
    const iv = setInterval(() => {
      for (let i = 0; i < 7; i++) particles.push(mkParticle());
      launched += 7; if (launched >= count) clearInterval(iv);
    }, 28);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };
  window.triggerConfetti = burst;
  window.addEventListener('resize', resize);
  resize();
  setTimeout(burst, 500);
})();

/* ═══════════════════════════════
   2. STAR FIELD
═══════════════════════════════ */
(function Stars() {
  const sf = $('#star-field');
  if (!sf) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    const sz = Math.random() * 2.5 + .5;
    s.className = 'star';
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*4}s;opacity:${Math.random()*.7+.1};`;
    sf.appendChild(s);
  }
})();

/* ═══════════════════════════════
   3. FLOATING HEARTS
═══════════════════════════════ */
(function Hearts() {
  const layer = $('#hearts-layer');
  const emojis = ['❤️','💕','💗','💓','💞','🌸','✨','🌷','💝','💖','🎀','🌹','🎊','💐'];
  const spawn = () => {
    const el = document.createElement('span');
    el.className = 'heart';
    el.textContent = emojis[Math.random() * emojis.length | 0];
    const sz = (.7 + Math.random() * 1.5).toFixed(2);
    el.style.cssText = `left:${Math.random()*100}%;--sz:${sz}rem;--dur:${7+Math.random()*8}s;--delay:${Math.random()*4}s;--blur:${Math.random()<.3?(Math.random()*2).toFixed(1):0}px;`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 38000);
  };
  for (let i = 0; i < 18; i++) setTimeout(spawn, i * 200);
  setInterval(spawn, 1600);
})();

/* ═══════════════════════════════
   4. AUDIO PLAYER
═══════════════════════════════ */
(function AudioPlayer() {
  const btn   = $('#music-btn');
  const audio = $('#bg-music');
  const bars  = $('#music-bars');
  const label = btn?.querySelector('.music-label');
  const birthdaySong = $('#birthday-song');
  if (!btn || !audio) return;
  let playing = false;
  btn.addEventListener('click', async () => {
    try {
      if (playing) {
        audio.pause(); playing = false;
        bars.classList.remove('active');
        if (label) label.textContent = 'ಸಂಗೀತ ಪ್ಲೇ ಮಾಡಿ';
      } else {
        // Stop birthday song if it's playing
        if (birthdaySong && !birthdaySong.paused) {
          birthdaySong.pause();
          birthdaySong.currentTime = 0;
        }
        await audio.play(); playing = true;
        bars.classList.add('active');
        if (label) label.textContent = 'ನಿಲ್ಲಿಸಿ';
      }
    } catch(e) { console.log('Audio blocked'); }
  });
})();

/* ═══════════════════════════════
   5. CAKE CLICK → CONFETTI
═══════════════════════════════ */
/* ═══════════════════════════════
   5. CAKE CLICK → CUT EFFECT
═══════════════════════════════ */
(function CakeClick() {
  const cake = $('#hero-cake');
  if (!cake) return;
  let cut = false;

  cake.addEventListener('click', () => {
    if (cut) {
      // Reset
      cut = false;
      cake.innerHTML = `
        <div class="cake-candle-row">
          <div class="candle"><div class="flame"></div></div>
          <div class="candle"><div class="flame"></div></div>
          <div class="candle"><div class="flame"></div></div>
        </div>
        <div class="cake-top"></div>
        <div class="cake-mid"></div>
        <div class="cake-base"></div>
        <div class="cake-plate"></div>`;
      showToast('🎂 ohhh ಮತ್ತೆ ಕೇಕ್ ಕಟ್ ಮಾಡಬೇಡಾ..!');
      return;
    }

    cut = true;
    window.triggerConfetti(120);
    
    // Stop background music if it's playing
    const bgMusic = $('#bg-music');
    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      const musicBtn = $('#music-btn');
      if (musicBtn) {
        const musicLabel = musicBtn.querySelector('.music-label');
        if (musicLabel) musicLabel.textContent = 'ಸಂಗೀತ ಪ್ಲೇ ಮಾಡಿ';
        const musicBars = $('#music-bars');
        if (musicBars) musicBars.classList.remove('active');
      }
    }
    
    // Play birthday song
    const birthdaySong = $('#birthday-song');
    if (birthdaySong) {
      birthdaySong.currentTime = 0;
      birthdaySong.play().catch(e => console.log('Birthday song blocked:', e));
    }
    
    showToast('🍰 ಹುಟ್ಟು ಹಬ್ಬದ ಶುಭಾಶಯಗಳು ಡಾಕ್ಟ್ರೇ! 🎉');

    // Replace cake with cut slices
    cake.innerHTML = `
      <div style="display:flex; align-items:flex-end; gap:6px; justify-content:center; animation: cutAppear 0.5s var(--ease-spring) forwards;">
        
        <!-- Left slice -->
        <div style="
          display:flex; flex-direction:column; align-items:center;
          transform: rotate(-18deg) translateX(-8px);
          animation: sliceLeft 0.5s var(--ease-spring) forwards;
          transform-origin: bottom center;">
          <div style="width:52px; height:1.8rem; border-radius:.6rem .6rem 0 0;
            background: linear-gradient(135deg,#f9d1dc,#f4a3b5);
            border:2px solid rgba(255,255,255,.2);"></div>
          <div style="width:62px; height:2.2rem; border-radius:.2rem;
            background: linear-gradient(135deg,var(--rose),var(--rose-deep));"></div>
          <div style="width:72px; height:2.6rem; border-radius:0 0 .4rem .4rem;
            background: linear-gradient(135deg,var(--gold-light),var(--gold));"></div>
          <!-- Cream filling visible on cut side -->
          <div style="position:absolute; right:-3px; top:0; bottom:0; width:6px;
            background: repeating-linear-gradient(to bottom,#fff 0,#fff 6px,#ffccd5 6px,#ffccd5 12px);
            border-radius:0 2px 2px 0; opacity:0.85;"></div>
        </div>

        <!-- Knife -->
        <div id="cake-knife" style="
          font-size:2rem; align-self:flex-end; margin-bottom:.4rem;
          animation: knifeStrike 0.35s ease-out forwards;
          transform-origin: bottom center;">🔪</div>

        <!-- Right slice -->
        <div style="
          display:flex; flex-direction:column; align-items:center;
          transform: rotate(18deg) translateX(8px);
          animation: sliceRight 0.5s var(--ease-spring) forwards;
          transform-origin: bottom center;">
          <div style="width:52px; height:1.8rem; border-radius:.6rem .6rem 0 0;
            background: linear-gradient(135deg,#f9d1dc,#f4a3b5);
            border:2px solid rgba(255,255,255,.2);"></div>
          <div style="width:62px; height:2.2rem; border-radius:.2rem;
            background: linear-gradient(135deg,var(--rose),var(--rose-deep));"></div>
          <div style="width:72px; height:2.6rem; border-radius:0 0 .4rem .4rem;
            background: linear-gradient(135deg,var(--gold-light),var(--gold));"></div>
          <!-- Cream filling on cut side -->
          <div style="position:absolute; left:-3px; top:0; bottom:0; width:6px;
            background: repeating-linear-gradient(to bottom,#fff 0,#fff 6px,#ffccd5 6px,#ffccd5 12px);
            border-radius:2px 0 0 2px; opacity:0.85;"></div>
        </div>
      </div>`;

    // Inject keyframes once
    if (!document.getElementById('cake-cut-style')) {
      const style = document.createElement('style');
      style.id = 'cake-cut-style';
      style.textContent = `
        @keyframes knifeStrike {
          0%   { transform: translateY(-40px) rotate(-30deg); opacity:0; }
          60%  { transform: translateY(4px) rotate(5deg); opacity:1; }
          100% { transform: translateY(0px) rotate(0deg); opacity:1; }
        }
        @keyframes sliceLeft {
          0%   { transform: rotate(0deg) translateX(0); opacity:0.4; }
          100% { transform: rotate(-18deg) translateX(-8px); opacity:1; }
        }
        @keyframes sliceRight {
          0%   { transform: rotate(0deg) translateX(0); opacity:0.4; }
          100% { transform: rotate(18deg) translateX(8px); opacity:1; }
        }
      `;
      document.head.appendChild(style);
    }
  });
})();

/* ═══════════════════════════════
   6. BIRTHDAY GIRL CHARACTER
═══════════════════════════════ */
(function BirthdayGirl() {
  const char     = $('#girl-char');
  const mouth    = $('#g-mouth');
  const bubble   = $('#speech-bubble');
  const bubbleTx = $('#bubble-text');
  const armL     = $('#arm-l');
  const armR     = $('#arm-r');
  const pupilL   = $('#pupil-l');
  const pupilR   = $('#pupil-r');
  const faceWrap = $('#girl-face-wrap');
  if (!char) return;

  // Eye tracking
  window.addEventListener('mousemove', e => {
    if (!faceWrap) return;
    const rect = faceWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const dist = Math.min(3, Math.hypot(e.clientX - cx, e.clientY - cy) / 40);
    const ox = Math.cos(angle) * dist;
    const oy = Math.sin(angle) * dist;
    if (pupilL) pupilL.style.transform = `translate(${ox}px,${oy}px)`;
    if (pupilR) pupilR.style.transform = `translate(${ox}px,${oy}px)`;
  });

  // Response Bank (Kannada)
  const responses = {
    wave: [
      { mouth: "😄", text: "👋 ಹಾಯ್!! OMG ನೀವು ನನ್ನನ್ನು ಗಮನಿಸಿದಿರಿ!! *ಗಟ್ಟಿಯಾಗಿ ಕೈ ಬೀಸುತ್ತಿದ್ದೇನೆ*", anim: "waving" },
      { mouth: "🥰", text: "👋 AHHH! ಹಾಯ್! ಹಾಯ್! ಇಂದು BEST ದಿನ!", anim: "waving" }
    ],
    gift: [
      { mouth: "😱", text: "🎁 ಉಡುಗೊರೆ?! ನನಗಾ?! ನಾನು ಅಳಲಿದ್ದೇನೆ 😭✨", anim: "bounce" },
      { mouth: "🤩", text: "🎁 ನನಗೆ ಉಡುಗೊರೆ?! ನಾನು ತುಂಬಾ ಅದೃಷ್ಟಶಾಲಿ, ನನಗೆ ಇಷ್ಟ!!", anim: "bounce" }
    ],
    cake: [
      { mouth: "😋", text: "🎂 ಕೇಕ್?! ಚಾಕೊಲೇಟ್ ಆ? ದಯವಿಟ್ಟು ಚಾಕೊಲೇಟ್ ಆಗಿರಲಿ!", anim: "bounce" },
      { mouth: "🤤", text: "🎂 ಓ ಆ— ಆ ಕೇಕ್ ಎಷ್ಟು ಸುಂದರ. ನನ್ನಷ್ಟೇ ಸುಂದರ. ಬಹುತೇಕ. 💅", anim: "" }
    ],
    dance: [
      { mouth: "🥳", text: "💃 ಹೋಗೋಣ!! ಇದು ನನ್ನ ಹಾಡು! *ಜನ್ಮದಿನದ ಡ್ಯಾನ್ಸ್ ಮಾಡುತ್ತಿದ್ದೇನೆ* 🎵", anim: "dancing" },
      { mouth: "😂", text: "💃 ನಾನು ನೃತ್ಯ ಮಾಡುತ್ತಿದ್ದೇನೆ, ಯಾರೂ ನಿಲ್ಲಿಸಲಾಗದು! WHEEEEE!", anim: "dancing" }
    ],
    surprise: [
      { mouth: "😱", text: "🎊 AAAAHHHHH!! ನೀವು ಮಾಡಲಿಲ್ಲ— *ಸಂತೋಷ ಚೀರಾಟ*", anim: "bounce" },
      { mouth: "😭", text: "🎊 ಇದು ತುಂಬಾ ಹೆಚ್ಚು. ನಾನು ಅಳುತ್ತಿದ್ದೇನೆ. ಇದು ಎಲ್ಲ. 💕", anim: "" }
    ],
    compliment: [
      { mouth: "😊", text: "💕 ಓ ನಿಲ್ಲಿಸಿ~ (ದಯವಿಟ್ಟು ನಿಲ್ಲಿಸಬೇಡಿ! 😂)", anim: "" },
      { mouth: "😏", text: "✨ ಅಂದರೆ… ನೀವು ತಪ್ಪಲ್ಲ. ನಾನು ನಿಜಕ್ಕೂ ಅದ್ಭುತ.", anim: "" },
      { mouth: "🥰", text: "💕 ನಿಮ್ಮ ಮಾತು ನನ್ನ ಇಡೀ ದಿನ ಮಾಡಿದೆ! 🌸", anim: "" }
    ],
    tickle: [
      { mouth: "😂", text: "😂 HAHAHA ನಿಲ್ಲಿಸಿ ನಿಲ್ಲಿಸಿ HAHAHA ನಾನು ಅಳುತ್ತಿದ್ದೇನೆ!!!", anim: "dancing" },
      { mouth: "🤣", text: "🤣 ನಿಲ್ಲಿ!! *ಗಿಲಿಗಿಲಿ*... HA! HAHA! ತುಂಬಾ ಸ್ನೇಹ!!", anim: "bounce" }
    ],
    sing: [
      { mouth: "🎵", text: "🎵 🎶 ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ ಟು ಮಿ~ ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ ಟು ಮಿ~! 🎂", anim: "dancing" },
      { mouth: "🎤", text: "🎤 *ಮೈಕ್ ತಗೆದುಕೊಳ್ಳುತ್ತಾಳೆ* ಜನ್ಮದಿನ ರಾಣಿ ಇಲ್ಲಿದ್ದಾಳೆ!! 🎵✨", anim: "" }
    ],
    hug: [
      { mouth: "🥰", text: "🤗 ಅಪ್ಪಿಕೋ!! *ತೆಕ್ಕೆ ಹಾಕಿಕೊಳ್ಳುತ್ತಾಳೆ* ನಿಮ್ಮನ್ನು ಭೇಟಿ ಮಾಡಿ ಸಂತೋಷ! 💕", anim: "hugging" },
      { mouth: "💕", text: "💕 ಈ ತೆಕ್ಕೆ ಶಾಶ್ವತ! ಅಗಲಲ್ಲ! 🥰", anim: "hugging" }
    ],
    kiss: [
      { mouth: "😘", text: "💋 *ಮುತ್ತು ಗಾಳಿಯಲ್ಲಿ* ನಿಮಗೆ ಬಹಳ ಪ್ರೀತಿ! 💕✨", anim: "" },
      { mouth: "🥰", text: "😘 ಮ್ಯಾ!! ನೀವು ಎಷ್ಟು ಸ್ವೀಟ್ ಆಗಿದ್ದೀರಿ! 💋💕", anim: "" }
    ]
  };

  let bubbleTimer;
  function showBubble(text, mouthEmoji, anim) {
    if (mouth) mouth.textContent = mouthEmoji;
    if (bubbleTx) bubbleTx.textContent = text;
    if (bubble) bubble.classList.add('show');

    char.classList.remove('dancing','bouncing','waving-anim','hugging-anim');
    if (armL) { armL.classList.remove('waving','hugging'); }
    if (armR) { armR.classList.remove('hugging'); }

    if (anim === 'waving') {
      armL?.classList.add('waving');
    } else if (anim === 'dancing') {
      char.classList.add('dancing');
    } else if (anim === 'bounce') {
      char.classList.add('bouncing');
    } else if (anim === 'hugging') {
      armL?.classList.add('hugging');
      armR?.classList.add('hugging');
    }

    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      bubble?.classList.remove('show');
      if (mouth) mouth.textContent = '😊';
      char.classList.remove('dancing','bouncing');
      armL?.classList.remove('waving','hugging');
      armR?.classList.remove('hugging');
    }, 4000);
  }

  $$('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const pool = responses[action];
      if (!pool) return;
      const r = pool[Math.floor(Math.random() * pool.length)];
      showBubble(r.text, r.mouth, r.anim);
      if (action === 'surprise' || action === 'gift') window.triggerConfetti(80);
    });
  });
})();

/* ═══════════════════════════════
   7. EMOTION BARS
═══════════════════════════════ */
(function EmotionBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.e-bar').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  const section = $('#emotion-section');
  if (section) obs.observe(section);
})();

/* ═══════════════════════════════
   8. SCROLL REVEAL
═══════════════════════════════ */
(function ScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -50px 0px' });
  $$('.reveal').forEach(el => obs.observe(el));
})();

/* ═══════════════════════════════
   9. GALLERY + LIGHTBOX
═══════════════════════════════ */
(function Gallery() {
  const items   = $$('.gallery-item');
  const lightbox = $('#lightbox');
  const lbImg   = $('#lb-img');
  const lbClose = $('#lb-close');
  const lbPrev  = $('#lb-prev');
  const lbNext  = $('#lb-next');
  const lbCap   = $('#lb-caption');
  if (!lightbox) return;

  let current = 0;
  const data = items.map(i => ({ src: i.dataset.src, label: i.dataset.label }));

  const openLb = (idx) => {
    current = idx;
    lbImg.src = data[idx].src;
    if (lbCap) lbCap.textContent = data[idx].label || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  const navigate = (dir) => {
    current = (current + dir + data.length) % data.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = data[current].src;
      if (lbCap) lbCap.textContent = data[current].label || '';
      lbImg.style.opacity = '1';
    }, 200);
  };

  items.forEach((item, idx) => {
    item.addEventListener('click', e => {
      if (e.target.classList.contains('like-btn')) return;
      openLb(idx);
    });
  });
  lbClose?.addEventListener('click', closeLb);
  lbPrev?.addEventListener('click', () => navigate(-1));
  lbNext?.addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
  });

  // Like buttons
  $$('.like-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('liked');
      btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
      if (btn.classList.contains('liked')) showToast('💕 ಇಷ್ಟ!');
    });
  });
})();

/* ═══════════════════════════════
   10. MESSAGE REACTIONS
═══════════════════════════════ */
(function Reactions() {
  $$('.react-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cnt = btn.querySelector('span');
      const n = parseInt(cnt.textContent) + 1;
      cnt.textContent = n;
      btn.classList.add('reacted','pop-anim');
      setTimeout(() => btn.classList.remove('pop-anim'), 400);
      if (n === 1) showToast(btn.dataset.r + ' ಪ್ರತಿಕ್ರಿಯಿಸಿದಿರಿ!');
      if (n >= 10) { showToast('🔥 10 ಪ್ರತಿಕ್ರಿಯೆಗಳು!!'); window.triggerConfetti(80); }
    });
  });
})();

/* ═══════════════════════════════
   11. SCRATCH CARD
═══════════════════════════════ */
(function ScratchCard() {
  const canvas = $('#scratch-card');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let scratching = false, revealed = false;

  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, '#4a2070');
  gradient.addColorStop(.5, '#c13a56');
  gradient.addColorStop(1, '#d4a853');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.font = 'bold 20px "Noto Sans Kannada", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ ತಿಕ್ಕಿ ಬಹಿರಂಗಪಡಿಸಿ! ✦', W / 2, H / 2 - 10);
  ctx.font = '14px "Noto Sans Kannada", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.fillText('ನಿಮ್ಮ ರಹಸ್ಯ ಆಶ್ಚರ್ಯ ಅಡಗಿದೆ…', W / 2, H / 2 + 18);

  const getPos = (e) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };
  const scratch = (e) => {
    if (!scratching) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.fill();
    if (!revealed) {
      const data = ctx.getImageData(0, 0, W, H).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) { if (data[i] < 128) transparent++; }
      if (transparent / (W * H) > 0.55) {
        revealed = true;
        ctx.clearRect(0, 0, W, H);
        showToast('🎁 ನಿಮ್ಮ ಉಡುಗೊರೆ ಬಹಿರಂಗ! 👑');
        window.triggerConfetti(180);
      }
    }
  };
  canvas.addEventListener('mousedown', e => { scratching = true; scratch(e); });
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('mouseup', () => { scratching = false; });
  canvas.addEventListener('touchstart', e => { scratching = true; scratch(e); }, { passive: false });
  canvas.addEventListener('touchmove', scratch, { passive: false });
  canvas.addEventListener('touchend', () => { scratching = false; });
})();

/* ═══════════════════════════════
   12. BALLOON POP
═══════════════════════════════ */
(function Balloons() {
  const area = $('#balloon-area');
  const btn  = $('#pop-balloon-btn');
  if (!area || !btn) return;
  const bEmojis = ['🎈','🎈','🎈','🎀','🎊','💜','💗','🌸','❤️','✨'];
  const spawnBalloon = () => {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = bEmojis[Math.floor(Math.random() * bEmojis.length)];
    b.style.cssText = `left:${10 + Math.random()*80}%;bottom:0;animation-duration:${6+Math.random()*4}s;animation-delay:${Math.random()*1.5}s;font-size:${2+Math.random()*1.5}rem;`;
    b.addEventListener('click', () => {
      b.classList.add('pop');
      showToast('💥 ಸ್ಫೋಟ!');
      window.triggerConfetti(40);
      setTimeout(() => b.remove(), 300);
    });
    area.appendChild(b);
    setTimeout(() => b.remove(), 12000);
  };
  btn.addEventListener('click', () => {
    for (let i = 0; i < 14; i++) setTimeout(spawnBalloon, i * 150);
    showToast('🎈 ಬಲೂನ್‌ಗಳು ಬಂದವು! ಒಡೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ!');
  });
})();

/* ═══════════════════════════════
   13. GIFTS
═══════════════════════════════ */
(function Gifts() {
  $$('.open-gift-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      const giftBox = $(`#gift-${idx}`);
      const giftReveal = $(`#gift-reveal-${idx}`);
      if (!giftReveal) return;

      if (giftReveal.classList.contains('open')) {
        giftReveal.classList.remove('open');
        giftBox.style.display = '';
        btn.textContent = 'ತೆರೆ 🎁';
      } else {
        giftBox.style.display = 'none';
        giftReveal.classList.add('open');
        btn.textContent = '✓ ತೆರೆದಿದೆ';
        window.triggerConfetti(60);
        showToast('🎁 ಉಡುಗೊರೆ ತೆರೆಯಲಾಗಿದೆ! 🎉');
      }
    });
  });
})();

/* ═══════════════════════════════
   14. QUOTES CAROUSEL
═══════════════════════════════ */
(function Quotes() {
  const quotes = [
    { text: "ನಿನ್ನ ನಗು ನೋಡಿದಾಗ ಪ್ರಪಂಚ ಚೆಂದ ಎನಿಸುತ್ತದೆ.", author: "— ಪ್ರೀತಿಯಿಂದ" },
    { text: "ನೀನು ಇಲ್ಲದ ದಿನ ಸೂರ್ಯನಿಲ್ಲದ ಆಕಾಶದಂತೆ.", author: "— ಹೃದಯದಾಳದಿಂದ" },
    { text: "ಪ್ರತಿ ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ ಮತ್ತೊಂದು ವರ್ಷ ನೀನು ಜೀವನದಲ್ಲಿ ಬೆಳಗಿದ ಸಂದರ್ಭ.", author: "— ಜೊತೆಗಿರಿ ಸದಾ" },
    { text: "ನಿನ್ನ ಕಣ್ಣುಗಳಲ್ಲಿ ನಕ್ಷತ್ರಗಳ ಹೊಳಪಿದೆ, ನಿನ್ನ ಹೃದಯದಲ್ಲಿ ಸ್ವರ್ಗದ ಸ್ನೇಹವಿದೆ.", author: "— ಅನಂತ ಪ್ರೀತಿ" },
    { text: "ಜನ್ಮದಿನ ಒಂದು ದಿನ ಮಾತ್ರ, ಆದರೆ ನೀನು ಪ್ರತಿ ದಿನ ಕೊಡುವ ಸಂತೋಷ ಶಾಶ್ವತ.", author: "— ನಿಮ್ಮ ಹೃದಯದ ಸ್ನೇಹಿತ" },
    { text: "ಈ ಪ್ರಪಂಚ ನಿನ್ನ ನಗಿನಿಂದ ಹೆಚ್ಚು ಸುಂದರ, ನಿನ್ನ ಇರುವಿಕೆಯಿಂದ ಹೆಚ್ಚು ಅರ್ಥ.", author: "— ಯಾವತ್ತೂ ನಿನ್ನ ಬೆನ್ನಿಗಿದ್ದೇನೆ" },
    { text: "ನಿನ್ನ ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ ಒಂದು ಹಬ್ಬ — ಜೀವನ ಈ ರೀತಿ ಚೆಂದ ಆಗಿ ಹೊಳೆಯಲು ನಿನ್ನಂತಹವರು ಬೇಕು.", author: "— ಪ್ರೀತಿ ಪೂರ್ಣ" }
  ];

  const qText = $('#quote-text');
  const qAuthor = $('#quote-author');
  const qDots = $('#q-dots');
  const qPrev = $('#q-prev');
  const qNext = $('#q-next');
  if (!qText) return;

  let current = 0;

  // Create dots
  quotes.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'q-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    qDots?.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + quotes.length) % quotes.length;
    qText.style.opacity = '0';
    qText.style.transform = 'translateY(10px)';
    setTimeout(() => {
      qText.textContent = quotes[current].text;
      qAuthor.textContent = quotes[current].author;
      qText.style.opacity = '1';
      qText.style.transform = 'translateY(0)';
    }, 300);
    $$('.q-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  qPrev?.addEventListener('click', () => goTo(current - 1));
  qNext?.addEventListener('click', () => goTo(current + 1));

  // Auto advance
  setInterval(() => goTo(current + 1), 5000);
})();

/* ═══════════════════════════════
   15. WRITE MESSAGE
═══════════════════════════════ */
(function WriteMessage() {
  const textarea = $('#user-message');
  const charCount = $('#char-count');
  const clearBtn = $('#clear-msg');
  const submitBtn = $('#submit-msg');
  const messagesList = $('#messages-list');
  if (!textarea) return;

  const MAX = 500;
  const savedMessages = [];

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    if (charCount) charCount.textContent = Math.min(len, MAX);
    if (len > MAX) textarea.value = textarea.value.substring(0, MAX);
  });

  clearBtn?.addEventListener('click', () => {
    textarea.value = '';
    if (charCount) charCount.textContent = '0';
  });

  submitBtn?.addEventListener('click', () => {
    const msg = textarea.value.trim();
    if (!msg) { showToast('ದಯವಿಟ್ಟು ಮೊದಲು ಸಂದೇಶ ಬರೆಯಿರಿ ✍️'); return; }

    // Add to list
    const now = new Date();
    const timeStr = now.toLocaleTimeString('kn-IN', { hour: '2-digit', minute: '2-digit' });
    savedMessages.push({ text: msg, time: timeStr });

    // Render
    renderMessages();

    // Clear textarea
    textarea.value = '';
    if (charCount) charCount.textContent = '0';

    showToast('💌 ನಿಮ್ಮ ಸಂದೇಶ ಕಳಿಸಲಾಗಿದೆ!');
    window.triggerConfetti(60);
  });

  function renderMessages() {
    if (!messagesList) return;
    if (savedMessages.length === 0) {
      messagesList.innerHTML = '<p class="no-messages">ಇನ್ನು ಯಾವ ಸಂದೇಶಗಳಿಲ್ಲ. ಮೊದಲ ಸಂದೇಶ ಕಳಿಸಿ! 💕</p>';
      return;
    }
    messagesList.innerHTML = '';
    [...savedMessages].reverse().forEach(item => {
      const div = document.createElement('div');
      div.className = 'saved-msg-item';
      div.innerHTML = `<p class="saved-msg-text">💕 ${item.text}</p><p class="saved-msg-time">✦ ${item.time}</p>`;
      messagesList.appendChild(div);
    });
  }

  renderMessages();
})();

/* ═══════════════════════════════
   16. BIRTHDAY GAME 🎮
═══════════════════════════════ */
(function BirthdayGame() {
  const board = $('#game-board');
  const startBtn = $('#start-game-btn');
  const restartBtn = $('#restart-game-btn');
  const startOverlay = $('#game-start');
  const endOverlay = $('#game-end');
  const scoreEl = $('#game-score');
  const timerEl = $('#game-timer');
  const highEl = $('#game-high');
  const finalScoreEl = $('#final-score');
  if (!board || !startBtn) return;

  let score = 0, highScore = 0, timeLeft = 30;
  let gameActive = false, gameInterval, timerInterval;

  const items = ['🎂','🎂','🎂','🍰','🧁','🎁','🌸','💕','✨','🎊','🎈'];
  const bombs = ['💣','🖤','☠️'];

  function spawnItem() {
    if (!gameActive) return;
    const el = document.createElement('div');
    el.className = 'game-item';
    const isBomb = Math.random() < 0.25;
    el.textContent = isBomb
      ? bombs[Math.floor(Math.random() * bombs.length)]
      : items[Math.floor(Math.random() * items.length)];
    el.dataset.bomb = isBomb ? '1' : '0';

    const boardW = board.offsetWidth - 60;
    el.style.left = (10 + Math.random() * boardW) + 'px';
    const dur = 2 + Math.random() * 2;
    el.style.animationDuration = dur + 's';

    el.addEventListener('click', () => {
      if (!gameActive) return;
      el.classList.add('hit');
      if (el.dataset.bomb === '1') {
        score = Math.max(0, score - 5);
        showToast('💣 ಬಾಂಬ್! -5 ಅಂಕ!');
      } else {
        score += 10;
        showToast('🎂 +10!');
        window.triggerConfetti(20);
      }
      scoreEl.textContent = score;
      setTimeout(() => el.remove(), 250);
    });

    board.appendChild(el);
    setTimeout(() => { if (el.parentNode === board) el.remove(); }, dur * 1000 + 200);
  }

  function startGame() {
    score = 0; timeLeft = 30; gameActive = true;
    scoreEl.textContent = '0';
    timerEl.textContent = '30';
    startOverlay.style.display = 'none';
    endOverlay.style.display = 'none';

    gameInterval = setInterval(spawnItem, 700);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    if (score > highScore) { highScore = score; highEl.textContent = highScore; }
    finalScoreEl.textContent = score;
    endOverlay.style.display = 'flex';
    window.triggerConfetti(150);
    showToast('🎊 ಆಟ ಮುಗಿಯಿತು! ಅಂಕ: ' + score);
    // Remove remaining items
    $$('.game-item').forEach(i => i.remove());
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);
})();

/* ═══════════════════════════════
   17. FULLSCREEN
═══════════════════════════════ */
(function FullScreen() {
  const btn  = $('#fullscreen-btn');
  const iconO = $('#fs-open');
  const iconC = $('#fs-close');
  const upd = () => {
    const fs = !!document.fullscreenElement;
    if (iconO) iconO.style.display = fs ? 'none' : '';
    if (iconC) iconC.style.display = fs ? '' : 'none';
  };
  btn?.addEventListener('click', () => {
    document.fullscreenElement
      ? document.exitFullscreen().catch(()=>{})
      : document.documentElement.requestFullscreen().catch(()=>{});
  });
  document.addEventListener('fullscreenchange', upd);
})();

/* ═══════════════════════════════
   18. CONFETTI RESTART
═══════════════════════════════ */
$('#restart-confetti')?.addEventListener('click', () => {
  window.triggerConfetti(250);
  showToast('🎊 ಮತ್ತೆ ಆಚರಿಸೋಣ!');
});

/* ═══════════════════════════════
   19. FIREWORKS
═══════════════════════════════ */
$('#fireworks-btn')?.addEventListener('click', () => {
  window.triggerConfetti(400);
  showToast('🎆 ಸ್ಫೋಟ! ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ! 🎇');
  setTimeout(() => window.triggerConfetti(300), 1000);
  setTimeout(() => window.triggerConfetti(200), 2000);
});

/* ═══════════════════════════════
   20. SMOOTH SCROLL
═══════════════════════════════ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = $(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ═══════════════════════════════
   21. PARALLAX HERO
═══════════════════════════════ */
(function Parallax() {
  const blur = $('.hero-bg-blur');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.3 && blur) {
      blur.style.transform = `translateY(${y * .22}px)`;
    }
  }, { passive: true });
})();

/* ═══════════════════════════════
   22. CURSOR TRAIL (desktop)
═══════════════════════════════ */
(function CursorTrail() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const COUNT = 12;
  const glyphs = ['✦','·','❋','✿','⋆','♡','✧','★','🌸','💕'];
  const trail = [];
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;font-size:${.4+i*.07}rem;opacity:0;color:${i%2?'#e8637a':'#d4a853'};will-change:transform;transition:opacity .3s;`;
    el.textContent = glyphs[i % glyphs.length];
    document.body.appendChild(el);
    trail.push({ el, x:-200, y:-200 });
  }
  let mx=-200, my=-200;
  window.addEventListener('mousemove', e=>{mx=e.clientX;my=e.clientY;},{passive:true});
  const prev = {x:mx,y:my};
  const tick = () => {
    prev.x += (mx-prev.x)*.16;
    prev.y += (my-prev.y)*.16;
    trail.forEach((t,i)=>{
      const r = i/COUNT;
      t.x += (prev.x-t.x)*(.1+r*.06);
      t.y += (prev.y-t.y)*(.1+r*.06);
      t.el.style.transform=`translate(${t.x-6}px,${t.y-6}px)`;
      t.el.style.opacity = mx===-200 ? 0 : (.55-r*.45).toFixed(2);
    });
    requestAnimationFrame(tick);
  };
  tick();
})();

/* ═══════════════════════════════
   23. NAVBAR SCROLL EFFECT
═══════════════════════════════ */
(function NavbarScroll() {
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(13,8,24,.97)';
    } else {
      nav.style.background = 'rgba(13,8,24,.85)';
    }
  }, { passive: true });
})();

/* ═══════════════════════════════
   24. BIRTHDAY COUNTDOWN
═══════════════════════════════ */
(function BirthdayCountdown() {
  // Just show a fun animated number for fun  
  const now = new Date();
  const today = `${now.getDate()}/${now.getMonth()+1}`;
  console.log(`🎂 ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ ಸೋಫಿಯಾ! - ${today}`);
})();

// add a function to play the song after cut the cake
(function PlaySong() {
  const knife = $('#cake-knife');
  if (!knife) return;
  knife.addEventListener('animationend', () => {
    const audio = new Audio('./audio/atlasaudio-birthday-491022.mp3');
    audio.play().catch(() => {
      console.warn('🎵 Cannot autoplay song, user interaction required.');
    });
  });
})();