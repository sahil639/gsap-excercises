import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import projects from './projects/registry';

function ProjectRoute() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h1>Project not found</h1>
        <a href="/">Back to hub</a>
      </div>
    );
  }

  const Component = project.component;
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectRoute />} />
    </Routes>
  );
}
