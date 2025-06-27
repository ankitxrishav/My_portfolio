<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Next.js-14-blue?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
</p>
<h1 align="center">🚀 Ankit Kumar – Portfolio & Template</h1>

<p align="center">
  A sleek, modern, and highly interactive personal portfolio built with <strong>Next.js</strong>, <strong>React</strong>, <strong>Tailwind CSS</strong>, and <strong>Three.js</strong>. Designed to visually showcase your work, journey, and digital identity with a developer-first approach.
</p>

<p align="center">
  🔗 <strong>Live Demo:</strong> <a href="https://ankitxk.vercel.app" target="_blank">ankitxk.vercel.app</a>
</p>

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/14097c5c-11bb-45b4-a084-5a10d21f8d68" width="47%" style="margin: 1%;" />
  <img src="https://github.com/user-attachments/assets/49b8cc9c-f6d9-428a-813e-7c269c501be5" width="47%" style="margin: 1%;" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/42c156aa-d948-4402-8544-398eb1f7b850" width="47%" style="margin: 1%;" />
  <img src="https://github.com/user-attachments/assets/0c94c41f-d522-4bd8-ad1f-d7244cb497f3" width="47%" style="margin: 1%;" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c046f1a6-92fa-4ffb-836f-66c64638c7a7" width="47%" style="margin: 1%;" />
</p>

---

## ✨ Features

- 🎯 Built with **Next.js 14** (App Router) & **React 18**
- 🎨 **3D Dynamic Background** with Three.js for immersive experience
- 📱 **Fully Responsive** – Desktop, Tablet, and Mobile ready
- 🌙 **Light/Dark Mode** with easy CSS variable tweaks
- 🧩 **Component-Based UI** using ShadCN UI and Tailwind CSS
- 📊 **Data-Driven Content** – Easy to manage via `src/data/`
- 🔍 **SEO Optimized** with proper meta tags
- 🖱️ **Animated Cursor** to enhance interactivity

---

## 🧰 Getting Started

### ⚙️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- npm / yarn / pnpm

### 🔧 Installation Steps

```bash
# 1. Clone the repo
git clone https://github.com/ankitxrishav/My_portfolio.git

# 2. Enter project directory
cd My_portfolio

# 3. Install dependencies
npm install
```

# 4. Start development server
npm run dev
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

This project is licensed under the <a href = "https://github.com/ankitxrishav/My_portfolio/blob/master/LICENSE">MIT License.</a> You are free to use, modify, and distribute it. 

---

⭐ If you find this template helpful, please give it a star on GitHub

<p align="center"><strong>Made with ❤️ by <a href="https://github.com/ankitxrishav" target="_blank">Ankit Kumar</a></strong></p>
