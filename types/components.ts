import { ReactNode } from 'react';

// Common shared types for components
export interface BaseComponentProps {
  className?: string;
}

export interface WithChildrenProps extends BaseComponentProps {
  children: ReactNode;
}

export interface ImageProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  priority?: boolean;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  technologies: string[];
  link: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Category {
  id: string;
  label: string;
}
