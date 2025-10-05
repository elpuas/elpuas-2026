// Navigation model derived from existing pages under /src/pages
// Update this list when adding or removing public routes.

export interface NavLink {
	title: string
	href: string
	order: number
}

export const navigationLinks: NavLink[] = [
	{ title: 'Home', href: '/', order: 1 },
	{ title: 'About', href: '/about', order: 2 },
	{ title: 'What I Do', href: '/what-i-do', order: 3 },
	{ title: 'Blog', href: '/blog', order: 4 },
	{ title: "Let's Talk", href: '/lets-talk', order: 5 }
];

export const sortedNavigationLinks = [...navigationLinks].sort((a, b) => a.order - b.order);
