import React from 'react';
import { Link } from 'react-router-dom';
import projects from '../projects/registry';
import '../styles/home.css';

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">GSAP Practice Hub</h1>
        <p className="home-subtitle">
          A collection of animation experiments and site clones built with GSAP, Three.js, and React.
        </p>
      </header>
      <div className="project-grid">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="project-card"
          >
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="project-card__thumbnail"
              />
            ) : (
              <div className="project-card__thumbnail" />
            )}
            <div className="project-card__body">
              <h2 className="project-card__title">{project.title}</h2>
              <p className="project-card__description">{project.description}</p>
              <div className="project-card__tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
