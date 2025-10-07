/**
 * Client-side initializer for Carousel.astro using Swiper.
 */
import type { SwiperOptions, NavigationOptions } from 'swiper/types'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

let SwiperCtor: typeof import('swiper').Swiper | undefined;
let moduleCache: typeof import('swiper/modules') | undefined;

type CarouselOptions = {
	autoplay?: number;
	loop?: boolean;
	slidesPerView?: number | 'auto';
	spaceBetween?: number;
	centeredSlides?: boolean;
	centered?: boolean;
	showArrows?: boolean;
	showPagination?: boolean;
	breakpoints?: SwiperOptions['breakpoints'];
	initialSlide?: number;
};

const loadSwiper = async () => {
	if (SwiperCtor && moduleCache) {
		return { Swiper: SwiperCtor, modules: moduleCache };
	}
	const [{ Swiper }, modules] = await Promise.all([
		import('swiper'),
		import('swiper/modules')
	]);
	SwiperCtor = Swiper;
	moduleCache = modules;
	return { Swiper, modules };
};

const parseOptions = (value?: string): CarouselOptions => {
	if (!value) return {};
	try {
		return JSON.parse(value) as CarouselOptions;
	} catch (error) {
		console.warn('Carousel: failed to parse options', error);
		return {};
	}
};

const initCarousel = async (root: HTMLElement) => {
	if (root.dataset.carouselBound === 'true') return;
	root.dataset.carouselBound = 'true';

	const { Swiper, modules } = await loadSwiper();
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const optionsData = parseOptions(root.dataset.carouselOptions);
	const { Navigation, Pagination, A11y, Autoplay } = modules;
	const moduleList = [Navigation, Pagination, A11y];
	const autoplayDelay = optionsData.autoplay ?? 0;
	const autoplayEnabled = Boolean(autoplayDelay) && !prefersReducedMotion.matches;
	if (autoplayDelay && Autoplay) {
		moduleList.push(Autoplay);
	}
	const swiperEl = root.querySelector<HTMLElement>('.swiper');
	if (!swiperEl) return;

	const prevEl = root.querySelector<HTMLElement>('[data-carousel-prev]') || undefined;
	const nextEl = root.querySelector<HTMLElement>('[data-carousel-next]') || undefined;
	const paginationEl = root.querySelector<HTMLElement>('[data-carousel-pagination]') || undefined;
	const navigationOpts: NavigationOptions | false = optionsData.showArrows && prevEl && nextEl
		? { prevEl, nextEl }
		: false;
	// Swiper expects false (not undefined) to disable navigation cleanly

	const config: SwiperOptions = {
		modules: moduleList,
		initialSlide: typeof optionsData.initialSlide === 'number' ? optionsData.initialSlide : 0,
		loop: Boolean(optionsData.loop),
		slidesPerView: optionsData.slidesPerView ?? 1,
		spaceBetween: optionsData.spaceBetween ?? 0,
		centeredSlides: Boolean(optionsData.centeredSlides ?? optionsData.centered),
		navigation: navigationOpts,
		breakpoints: optionsData.breakpoints,
		a11y: { enabled: true },
		pagination: optionsData.showPagination && paginationEl
			? {
				el: paginationEl,
				clickable: true,
				renderBullet: (index, className) =>
					`<button type="button" class="${className}" aria-label="Go to slide ${index + 1}"></button>`
			}
			: undefined
	};

	if (!config.pagination) {
		delete config.pagination;
	}

	if (autoplayEnabled) {
		config.autoplay = {
			delay: autoplayDelay,
			disableOnInteraction: false,
			pauseOnMouseEnter: true
		};
	}

	const swiper = new Swiper(swiperEl, config);

	const handleMotionChange = () => {
		if (!swiper.autoplay) return;
		if (prefersReducedMotion.matches) {
			swiper.autoplay.stop();
		} else {
			swiper.autoplay.start();
		}
	};

	prefersReducedMotion.addEventListener('change', handleMotionChange);
};

const initAll = () => {
	document
		.querySelectorAll<HTMLElement>('[data-carousel-root]')
		.forEach((root) => {
			initCarousel(root).catch((error) => console.error('Carousel init failed', error));
		});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll, { once: true });
} else {
	initAll();
}

document.addEventListener('astro:after-swap', initAll);
