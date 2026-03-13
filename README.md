# Project Portfolio Manager

A web application to manage and showcase projects with ease, allowing CRUD operations, project categorization, and display of featured projects.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Overview
This project allows users to create, update, delete, and display projects in a portfolio format. It supports categorization, featured projects, and links to GitHub repositories or live demos.

## Installation
1. Clone the repository:
```bash
git clone <repository-url>
```
2. Navigate to the project directory:
```bash
cd project-portfolio-manager
```
3. Install dependencies:
```bash
npm install
```
4. Start the development server:
```bash
npm run dev
```

## Usage
- Access the admin panel to add, edit, or delete projects.
- Projects can have title, description, image, category, technologies, and links.
- Featured projects will be highlighted on the main portfolio page.

## Folder Structure
```
project-portfolio-manager/
│
├─ app/                  # Main application code
│  ├─ admin/             # Admin pages for managing projects
│  │  └─ projects/       # Project CRUD pages
│  ├─ projects/          # Public project display pages
│  └─ ...                # Other application files
├─ components/           # Reusable UI components
├─ public/               # Static assets (images, fonts, etc.)
├─ styles/               # Global and component-specific styles
├─ package.json          # Project dependencies and scripts
└─ README.md             # Project documentation
```

## Technologies Used
- **Next.js** - React framework for server-side rendering
- **TypeScript** - Strongly typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Toast Notifications** - User feedback
- **Vercel** - Deployment platform (optional)

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## License
This project is licensed under the MIT License.