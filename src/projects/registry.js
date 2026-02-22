import { lazy } from 'react';

const projects = [
  {
    id: 'measured',
    title: 'Measured',
    description:
      'Clone of measured.site — analytics landing page with scroll-driven animations, interactive pixel canvas, and floating 3D object.',
    tags: ['ScrollTrigger', 'Three.js', 'ShaderMaterial', 'Scroll Reveal', 'Parallax'],
    thumbnail: '/images/measured/dashboard.png',
    component: lazy(() => import('./measured/index.jsx')),
  },
  // To add a new project:
  // 1. Create src/projects/<slug>/index.jsx (default export a React component)
  // 2. Add an entry here:
  // {
  //   id: 'slug',
  //   title: 'Project Name',
  //   description: 'What it demonstrates.',
  //   tags: ['ScrollTrigger', 'Parallax'],
  //   thumbnail: '/images/slug/preview.png',
  //   component: lazy(() => import('./slug/index.jsx')),
  // },
];

export default projects;
