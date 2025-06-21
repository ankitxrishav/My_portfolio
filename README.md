# Ankit Kumar – Portfolio & Template

A modern, interactive, and fully customizable personal portfolio website built with Next.js, React, Tailwind CSS, and Three.js. This template is designed to help you showcase your work, skills, and professional journey in a visually appealing way.

**Live Demo:** [ankitxk.vercel.app](https://ankitxk.vercel.app)

![Screenshot of Landing Page](https://github.com/user-attachments/assets/9080c3a0-0390-40c7-9ecd-c9b0a953f834)

## ✨ Features

- **Modern Tech Stack**: Built with Next.js 14 (App Router) & React 18.
- **Dynamic 3D Background**: Interactive particle and shape animations using Three.js.
- **Responsive Design**: Looks great on all devices, from desktops to mobile phones.
- **Customizable Theme**: Easily change colors for both light and dark modes via CSS variables.
- **Component-Based**: Built with reusable components from ShadCN UI.
- **Data-Driven Content**: All personal data (projects, skills, journey) is managed in separate data files, making it easy to update.
- **SEO Friendly**: Configured with meta tags for better search engine visibility.
- **Custom Cursor**: An elegant trailing cursor to enhance user experience.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and customization.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ankitxrishav/My_portfolio.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

## 🛠️ How to Customize

All personal data is centralized in the `src/data/` directory. This makes it easy to add your own content without digging through component files.

### 1. Personal Information

-   **Page Title & Meta Description**: Open `src/app/layout.tsx` and modify the `<title>` and `<meta name="description" ... />` tags.
-   **Profile Picture**: Replace `/public/images/ankit-kumar-profile.jpg` with your own photo. You can update the path in `src/components/about/about-content.tsx`.
-   **About Me Text**: Edit the text and details in `src/components/about/about-content.tsx`.

### 2. Projects (`src/data/projects.ts`)

To update the projects section:
-   Open `src/data/projects.ts`.
-   The `projectsData` array contains objects, where each object represents a project.
-   Add, remove, or edit objects in this array.
-   **Project Images**: Place your project images in the `/public/images/` directory and update the `imageUrl` property for each project.

Example of a project object:
```ts
{
  id: 'proj-1',
  name: 'My Awesome Project',
  description: 'A brief, engaging description of what this project does and the problems it solves.',
  technologies: ['React', 'TypeScript', 'TailwindCSS'],
  imageUrl: '/images/my-project-image.png',
  sourceCodeUrl: 'https://github.com/your-username/your-repo',
  liveDemoUrl: 'https://my-project-live.com', // Optional
  year: 2024,
}
```

### 3. Professional Journey (`src/data/timeline.ts`)

To update your career and education timeline:
-   Open `src/data/timeline.ts`.
-   Modify the `timelineData` array. Each object represents an event on your timeline.
-   You can change the `icon`, `type`, `date`, `title`, and `description`.

### 4. Skills (`src/data/skills.ts`)

To update your skills:
-   Open `src/data/skills.ts`.
-   Skills are grouped into categories in the `skillsData` array.
-   You can add or remove skills, change categories, and adjust icons (from `lucide-react`).
-   To make a skill stand out, set its `highlight` property to `true`.

### 5. Contact & Social Links

-   Open `src/components/contact/static-contact-info.tsx`.
-   Update the `href` attributes in the `<a>` tags for your email, LinkedIn, and GitHub profiles.

### 6. Theming & Styling

-   **Colors**: Open `src/app/globals.css`. You can change the HSL values for `--primary`, `--accent`, `--background`, etc., for both `:root` (light mode) and `.dark` (dark mode).
-   **Fonts**: Open `tailwind.config.ts`. You can change the `fontFamily` properties under `theme.extend` to use different fonts. Remember to also update the font import links in `src/app/layout.tsx`.

## 💻 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **3D Graphics**: [Three.js](https://threejs.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📜 License

This project is licensed under the MIT License. You are free to use, modify, and distribute it. (It's recommended to add a `LICENSE` file to your repository).

---

⭐ If you find this template helpful, please give it a star on GitHub
