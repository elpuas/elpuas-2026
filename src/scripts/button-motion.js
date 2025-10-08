import { animate } from 'motion';

if (typeof window !== 'undefined') {
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const bindMotion = (btn) => {
    if (!(btn instanceof HTMLElement) || btn.dataset.motionBound === 'true') return;
    btn.dataset.motionBound = 'true';

    const icon = btn.querySelector('[data-button-icon]');
    const getIcon = () => (icon instanceof HTMLElement ? icon : null);

    const hoverIn = () => {
      animate(btn, { scale: 1.02 }, { duration: 0.22, easing: 'ease-out' });
      const iconEl = getIcon();
      if (iconEl) {
        animate(iconEl, { x: 6, opacity: 1 }, { duration: 0.22, easing: 'ease-out' });
      }
    };

    const hoverOut = () => {
      animate(btn, { scale: 1 }, { duration: 0.18, easing: 'ease-out' });
      const iconEl = getIcon();
      if (iconEl) {
        animate(iconEl, { x: 0, opacity: 1 }, { duration: 0.18, easing: 'ease-out' });
      }
    };

    const pressDown = () => {
      animate(btn, { scale: 0.98 }, { duration: 0.12, easing: 'ease-out' });
    };

    const pressUp = () => {
      animate(btn, { scale: 1.02 }, { duration: 0.18, easing: 'ease-out' });
    };

    btn.addEventListener('mouseenter', hoverIn);
    btn.addEventListener('mouseleave', hoverOut);
    btn.addEventListener('focus', hoverIn);
    btn.addEventListener('blur', hoverOut);
    btn.addEventListener('mousedown', pressDown);
    btn.addEventListener('mouseup', pressUp);
    btn.addEventListener('touchstart', pressDown, { passive: true });
    btn.addEventListener('touchend', pressUp);
  };

  const activate = () => {
    document
      .querySelectorAll('[data-animated-button]')
      .forEach((btn) => bindMotion(btn));
  };

  const init = () => {
    if (reduceMotionQuery.matches) return;
    activate();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  document.addEventListener('astro:after-swap', init);

  reduceMotionQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      activate();
    }
  });
}
