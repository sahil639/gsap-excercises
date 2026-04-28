# GSAP Practice Hub

A portfolio of GSAP animation experiments and site clones, built with React, Vite, GSAP, and Three.js. The hub is structured so each experiment lives in its own self-contained folder and is registered into a single index page.

## Stack

- **React 19** + **React Router 7** — routing between hub and individual projects
- **Vite 7** — dev server and build
- **GSAP 3** (with `ScrollTrigger`) — scroll-driven and timeline animations
- **Three.js** — WebGL scenes, custom shader materials, environment maps

## Getting started

```bash
npm install
npm run dev      # start Vite dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
GSAP/
├── index.html                    Vite entry HTML, loads /src/main.jsx
├── vite.config.js                Vite config (React plugin only)
├── public/
│   └── images/                   Static assets served at /images/...
├── src/
│   ├── main.jsx                  Mounts <App /> inside <BrowserRouter>
│   ├── App.jsx                   Routes: "/" → Home, "/project/:id" → ProjectRoute
│   ├── components/
│   │   └── Layout.jsx            Glassmorphism "Hub" back button + Suspense fallback
│   ├── pages/
│   │   └── Home.jsx              Project grid, reads from registry
│   ├── projects/
│   │   ├── registry.js           Single source of truth for all projects
│   │   └── measured/             First experiment — measured.site clone
│   │       ├── index.jsx         Project root component
│   │       ├── style.css         Project-scoped styles
│   │       └── components/       Navbar, HeroText, PixelCanvas, FloatingObject, Sections
│   └── styles/
│       ├── global.css            App-wide styles (resets, hub button)
│       └── home.css              Hub landing page styles
└── dist/                         Production build output
```

## Routing

Defined in [src/App.jsx](src/App.jsx):

| Path                | Renders                                           |
| ------------------- | ------------------------------------------------- |
| `/`                 | [Home](src/pages/Home.jsx) — grid of all projects |
| `/project/:id`      | Looks up `id` in the registry and renders the matching project inside [Layout](src/components/Layout.jsx) |
| (unknown `id`)      | Inline "Project not found" message with a link back to `/` |

Project components are loaded via `React.lazy`, so each experiment is code-split into its own bundle. [Layout.jsx](src/components/Layout.jsx) wraps them in `<Suspense>` and overlays a circular "Hub" back button (bottom-right) for returning to `/`.

## Adding a new project

The registry in [src/projects/registry.js](src/projects/registry.js) is the only file you need to touch outside your project folder.

1. Create a folder under `src/projects/<slug>/` with an `index.jsx` that **default-exports a React component**. Put any project-specific components, styles, and assets inside that folder so the experiment stays self-contained.
2. Append an entry to the `projects` array:

   ```js
   {
     id: 'slug',                                      // matches /project/:id
     title: 'Project Name',
     description: 'What it demonstrates.',
     tags: ['ScrollTrigger', 'Parallax'],             // shown as chips on the card
     thumbnail: '/images/slug/preview.png',           // optional; placed in public/images/<slug>/
     component: lazy(() => import('./slug/index.jsx')),
   }
   ```

3. Drop a thumbnail into `public/images/<slug>/` if you want one — the hub card falls back to an empty placeholder if `thumbnail` is omitted.

That's it. The home page reads the registry on render, so the new card appears automatically.

## The "Measured" project

A clone of [measured.site](https://measured.site) — an analytics landing page demonstrating scroll-driven reveals, a custom shader pixel-grid canvas, and a floating 3D torus knot. Composed in [src/projects/measured/index.jsx](src/projects/measured/index.jsx).

### Components

- **[FloatingObject.jsx](src/projects/measured/components/FloatingObject.jsx)** — Three.js scene with a `TorusKnotGeometry` rendered using `MeshPhysicalMaterial` (clearcoat + custom cube-camera environment map). Mounted at the top of the page so it floats over all sections.
  - Cursor tracking with lerp-smoothed rotation.
  - Scroll progress (`window.scrollY / docHeight`) drives a progressive rotation across the page.
  - When the `.footer-tagline` enters the lower 70% of the viewport, the object animates from the top-left corner to the page center, between the words "Get" and "Measured." in the footer.
- **[Navbar.jsx](src/projects/measured/components/Navbar.jsx)** — Right-aligned in-hero nav (not viewport-fixed), with `Analytics`, `Leaderboard`, `Pricing` anchor links and a `Join` CTA.
- **[HeroText.jsx](src/projects/measured/components/HeroText.jsx)** — The large "Measured" wordmark. Sizing uses `clamp(80px, 18vw, 320px)` (see the comment block in the file for full typography spec).
- **[PixelCanvas.jsx](src/projects/measured/components/PixelCanvas.jsx)** — Full-bleed `OrthographicCamera` + `ShaderMaterial` plane.
  - Vertex shader: passthrough UVs.
  - Fragment shader: snap-to-grid dot field with a noise-driven density mask, gentle wave animation, and a vertical blue→white background gradient.
  - **Click ripples** — clicking the canvas pushes a ripple position + timestamp into a uniform array (max 8 concurrent). The shader expands a soft ring outward, brightening dots within it and fading over ~3 seconds.
- **[Sections.jsx](src/projects/measured/components/Sections.jsx)** — All scrollable content (leaderboard, about, showcase, pricing, testimonials, CTA, footer) plus all GSAP `ScrollTrigger` setup. Cleans up triggers on unmount via `ScrollTrigger.getAll().forEach(t => t.kill())`.

### Animations

| Where                      | Effect                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| Leaderboard rows           | Scrubbed fade/scale-in as each `.lb-item` enters the viewport, then scrubbed fade-out as it leaves |
| About / Showcase / Pricing / Testimonials / CTA / Footer | One-shot reveal (`y → 0`, `opacity 0 → 1`, `power3.out`) when the section's trigger hits 70% from the top |
| Nav links                  | Smooth `scrollIntoView` on click for any `href="#..."`                                         |
| Floating object            | Continuous cursor lerp + scroll-driven rotation; lerps to footer center when tagline visible   |
| Pixel canvas               | Continuous wave animation; click adds a ripple                                                 |

## Conventions

- **Project isolation** — each experiment owns its components, styles, and assets. Cross-project imports should be avoided so projects can be added or removed without breaking siblings.
- **Styles** — global resets and the hub button live in [src/styles/global.css](src/styles/global.css); the hub landing page uses [src/styles/home.css](src/styles/home.css); per-project styles live next to the project (e.g. [src/projects/measured/style.css](src/projects/measured/style.css)).
- **Code-splitting** — register projects with `React.lazy` so each experiment ships in its own chunk and only loads when visited.
- **Cleanup** — components that attach window/document listeners or instantiate Three.js renderers must dispose them in the `useEffect` cleanup. See `FloatingObject.jsx` and `PixelCanvas.jsx` for the pattern (cancel `requestAnimationFrame`, remove listeners, `dispose()` geometry/material/renderer, detach the canvas DOM node).
