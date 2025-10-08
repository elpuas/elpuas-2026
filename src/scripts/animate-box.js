import { animate } from 'motion';

const animateHeroMedia = () => {
  const media = document.querySelectorAll('[data-hero-box]');
  media.forEach((element) => {
    animate(element, { scale: 1 }, { ease: 'circInOut', duration: 1 });
  });
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateHeroMedia, { once: true });
  } else {
    animateHeroMedia();
  }

  document.addEventListener('astro:after-swap', animateHeroMedia);
}
