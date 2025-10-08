/**
 * Mobile navigation controller for the site header.
 */
const focusSelectors = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

const init = () => {
	const header = document.querySelector('[data-site-header]');
	if (!header || header.dataset.menuBound === 'true') return;

	header.dataset.menuBound = 'true';
	header.dataset.menuState = header.dataset.menuState || 'closed';

	const toggle = header.querySelector('[data-menu-toggle]');
	const nav = header.querySelector('[data-menu-nav]');
	const navLinks = Array.from(nav?.querySelectorAll('a[href]') || []);
	let previousFocus = null;

	if (!toggle || !nav) return;

	const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	const updateMotionState = () => {
		const shouldReduce = reduceMotionQuery.matches;
		header.dataset.reduceMotion = shouldReduce ? 'true' : 'false';
		header.classList.toggle('no-motion', shouldReduce);
	};
	updateMotionState();
	reduceMotionQuery.addEventListener('change', updateMotionState);

	const getLabels = () => ({
		open: toggle.dataset.openLabel || 'Open menu',
		close: toggle.dataset.closeLabel || 'Close menu'
	});

	const setState = (open) => {
		header.dataset.menuState = open ? 'open' : 'closed';
		toggle.setAttribute('aria-expanded', String(open));
		toggle.classList.toggle('is-active', open);
		const { open: openLabel, close: closeLabel } = getLabels();
		const labelText = open ? closeLabel : openLabel;
		toggle.setAttribute('aria-label', labelText);

		if (open) {
			previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			requestAnimationFrame(() => {
				const firstFocusable = nav.querySelector(focusSelectors);
				firstFocusable?.focus();
			});
		} else if (previousFocus) {
			previousFocus.focus();
			previousFocus = null;
		}
	};

	const isOpen = () => header.dataset.menuState === 'open';

	const closeMenu = () => {
		if (isOpen()) setState(false);
	};

	toggle.addEventListener('click', () => {
		setState(!isOpen());
	});

	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			setState(false);
		});
	});

	document.addEventListener('keydown', (event) => {
		if (!isOpen()) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			setState(false);
			return;
		}
		if (event.key === 'Tab') {
			const focusables = Array.from(header.querySelectorAll(focusSelectors)).filter(
				(el) => el.offsetParent !== null || el === toggle
			);
			if (focusables.length === 0) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	});

	document.addEventListener('focusin', (event) => {
		if (!isOpen()) return;
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (!header.contains(target)) {
			closeMenu();
		}
	});

	// Ensure initial aria-label aligns with collapsed state
	setState(false);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
	init();
}

document.addEventListener('astro:after-swap', init);
