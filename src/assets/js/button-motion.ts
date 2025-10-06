import { animate } from 'motion';

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const bindMotion = (btn: HTMLElement) => {
  if (!btn || btn.dataset.motionBound === 'true') return;
  btn.dataset.motionBound = 'true';

  const icon = btn.querySelector('[data-button-icon]') as HTMLElement | null;

  const hoverIn = () => {
    animate(btn, { scale: 1.02 } as any, { duration: 0.22, easing: 'ease-out' } as any);
    if (icon) {
      animate(icon, { x: 6, opacity: 1 } as any, { duration: 0.22, easing: 'ease-out' } as any );
    }
  };

  const hoverOut = () => {
    animate(btn, { scale: 1 } as any, { duration: 0.18, easing: 'ease-out' } as any);
    if (icon) {
      animate(icon, { x: 0, opacity: 1 } as any, { duration: 0.18, easing: 'ease-out' } as any);
    }
  };

  const pressDown = () => {
    animate(btn, { scale: 0.98 } as any, { duration: 0.12, easing: 'ease-out' } as any);
  };

  const pressUp = () => {
    animate(btn, { scale: 1.02 } as any, { duration: 0.18, easing: 'ease-out' } as any);
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
  const buttons = document.querySelectorAll('[data-animated-button]');
  buttons.forEach((btn) => bindMotion(btn as HTMLElement));
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
