/* ============================================
   共通JS — 全セクションHTML共通で読み込む
   - Lenis スムーズスクロール
   - カスタムカーソル
============================================ */

(function () {
  'use strict';

  /* ============================================
     1. Lenis スムーズスクロール
  ============================================ */
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;
  }

  /* ============================================
     2. カスタムカーソル
  ============================================ */
  // タッチデバイスでは何もしない
  if (window.matchMedia('(hover: none)').matches) return;

  // DOM にカーソル要素を追加
  const dot = document.createElement('div');
  dot.className = 'Cursor is-hidden';
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.className = 'Cursor-ring is-hidden';
  document.body.appendChild(ring);

  // マウス座標
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  // マウス移動でドットは即座に追従
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });

  // ページ離脱時に非表示
  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });

  // リングはイージングで遅れて追従（ぬるっと感）
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // ホバー対象の検出
  function addHoverListeners() {
    // リンク・ボタン
    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hover');
        ring.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hover');
        ring.classList.remove('is-hover');
      });
    });

    // テキスト要素（見出し・段落）
    document.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-text');
        ring.classList.add('is-text');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-text');
        ring.classList.remove('is-text');
      });
    });
  }

  // DOM読み込み完了後にリスナー登録
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHoverListeners);
  } else {
    addHoverListeners();
  }
})();
