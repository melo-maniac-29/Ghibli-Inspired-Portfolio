import { ReactNode } from 'react';

// Common shared types for components
export interface WithChildren {
  children: ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface WithChildrenAndClassName extends WithChildren, WithClassName {}

export interface ImageProps extends WithClassName {
  src?: string;
  alt?: string;
  priority?: boolean;
}
