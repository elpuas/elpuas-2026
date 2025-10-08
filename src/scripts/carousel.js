import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

let SwiperCtor;
let moduleCache;

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

const parseOptions = (value) => {
	if (!value) return {};
	try {
		return JSON.parse(value);
	} catch (error) {
		console.warn('Carousel: failed to parse options', error);
		return {};
	}
};

const initCarousel = async (root) => {
	if (root.dataset.carouselBound === 'true') return;
	root.dataset.carouselBound = 'true';

	const { Swiper, modules } = await loadSwiper();
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const optionsData = parseOptions(root.dataset.carouselOptions);
	const { Navigation, Pagination, A11y, Autoplay } = modules;
	const moduleList = [Navigation, Pagination, A11y].filter(Boolean);
	const autoplayDelay = optionsData.autoplay ?? 0;
	const autoplayEnabled = Boolean(autoplayDelay) && !prefersReducedMotion.matches;
	if (autoplayDelay && Autoplay) {
		moduleList.push(Autoplay);
	}
	const swiperEl = root.querySelector('.swiper');
	if (!swiperEl) return;

	const prevEl = root.querySelector('[data-carousel-prev]') || undefined;
	const nextEl = root.querySelector('[data-carousel-next]') || undefined;
	const paginationEl = root.querySelector('[data-carousel-pagination]') || undefined;
	const navigationOpts = optionsData.showArrows && prevEl && nextEl
		? { prevEl, nextEl }
		: false;

	const config = {
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
		.querySelectorAll('[data-carousel-root]')
		.forEach((root) => {
			initCarousel(root).catch((error) => console.error('Carousel init failed', error));
		});
};

if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAll, { once: true });
	} else {
		initAll();
	}

	document.addEventListener('astro:after-swap', initAll);
}
