if (typeof window !== 'undefined') {
	const PLAY_THRESHOLD = 0.3;
	const PAUSE_THRESHOLD = 0.2;
	const observerOptions = {
		threshold: [0, 0.2, 0.3, 0.4, 1]
	};

	const ensureVideoDefaults = (video) => {
		if (!(video instanceof HTMLVideoElement)) return;
		if (!video.muted) video.muted = true;
		if (!video.loop) video.loop = true;
		if (!video.playsInline) video.playsInline = true;
		if (video.hasAttribute('controls')) {
			video.removeAttribute('controls');
		}
	};

	const handleEntry = (entry) => {
		const video = entry.target;
		if (!(video instanceof HTMLVideoElement)) return;
		ensureVideoDefaults(video);

		const ratio = entry.intersectionRatio;

		if (ratio >= PLAY_THRESHOLD && video.paused) {
			try {
				const playPromise = video.play();
				if (playPromise && typeof playPromise.catch === 'function') {
					playPromise.catch(() => {});
				}
			} catch {
				// Ignore autoplay rejections
			}
			return;
		}

		if (ratio <= PAUSE_THRESHOLD && !video.paused) {
			video.pause();
		}
	};

	const init = () => {
		const videos = Array.from(
			document.querySelectorAll('.video-section video[data-autoplay="visibility"]')
		).filter((video) => video instanceof HTMLVideoElement);

		if (videos.length === 0) {
			return;
		}

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				handleEntry(entry);
			}
		}, observerOptions);

		for (const video of videos) {
			ensureVideoDefaults(video);
			observer.observe(video);
		}
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init, { once: true });
	} else {
		init();
	}
}
