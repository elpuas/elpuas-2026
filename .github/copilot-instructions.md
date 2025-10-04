# Copilot Instructions for ElPuas Personal Site 2026

## Project Overview
This is Alfredo Navas's personal website built with **Astro 5.14.1** targeting minimalist, dark-mode-first design with accessibility-first principles. The site integrates DatoCMS for blog content and deploys automatically to Netlify.

## Architecture & Stack
- **Framework**: Astro with Islands architecture for selective interactivity
- **Styling**: Vanilla CSS with modern features (nesting, `:is`, `:has`, `:where`)
- **CMS**: DatoCMS (GraphQL API) for blog content
- **Icons**: `astro-icon` package for SVG management
- **Performance**: Partytown for third-party script optimization
- **Node**: v22.19.0 (specified in AGENT.md)

## Development Workflow
```bash
npm run dev          # Local development on localhost:4321
npm run build        # Production build to ./dist/
astro check          # TypeScript/Astro validation before commits
```

## Code Standards (Critical)
- **Indentation**: Tabs only (not spaces)
- **Quotes**: Single quotes `'` always
- **Semicolons**: Disabled (`semi: false`)
- **Comments**: English, concise, functional purpose
- **TypeScript**: Used selectively for complex logic only

## Component Architecture
- **Layout Pattern**: Single `Layout.astro` in `/src/layouts/` with minimal HTML5 structure
- **Components**: `/src/components/` for reusable Astro components
- **Pages**: File-based routing in `/src/pages/` (index.astro, about, what-i-do, blog, contact)
- **Assets**: Organized under `/src/assets/` with subdirectories for css, js, img

## Styling Guidelines
- **Dark-mode-first**: Default theme with monochromatic palette
- **CSS Custom Properties**: Use for all colors, avoid hardcoded values
- **No Frameworks**: No Tailwind, Bootstrap, or utility CSS libraries
- **Modern CSS**: Leverage logical properties, container queries, `dvh` units
- **Accessibility**: WCAG AA compliance minimum, validate contrast ratios

## Content Integration
- **DatoCMS**: Blog posts fetched via GraphQL (API key in `.env`)
- **Static Content**: Personal pages in Astro format with frontmatter
- **Voice**: First-person ("I"), personal, thoughtful, honest tone
- **Images**: Alt text required, responsive picture elements, lazy loading

## Performance Requirements
- **Lighthouse Scores**: 95+ for performance and accessibility
- **JavaScript**: Minimal usage, prefer Astro features over client-side JS
- **Astro Islands**: Only for essential interactivity (scroll video, carousels)
- **Images**: Compress, optimize, use responsive formats

## Deployment & Environment
- **Netlify**: Auto-deploy from `main` branch
- **Environment**: `.env` contains `DATOCMS_API_KEY`
- **Build Validation**: Check `astro build` success before merging

## Commit Convention
Use Conventional Commits format:
```
feat(home): add scroll-based hero video component
fix(styles): improve dark mode contrast ratios
content(blog): publish JAMStack workflow article
```

## Key Files to Reference
- `AGENT.md`: Comprehensive project specification and guidelines
- `astro.config.mjs`: Integration setup (icon, partytown)
- `src/layouts/Layout.astro`: Base HTML structure pattern
- `.env`: DatoCMS API configuration (not in git)

## AI Agent Priorities
1. **Accessibility First**: Validate ARIA roles, focus states, keyboard navigation
2. **Performance**: Optimize assets, minimize JavaScript, leverage Astro's SSG
3. **Maintainability**: Follow established patterns, modular CSS, clean components
4. **Brand Consistency**: Maintain minimalist aesthetic and personal voice