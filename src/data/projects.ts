
export type Technology = 'Python' | 'TensorFlow' | 'PyTorch' | 'Scikit-learn' | 'Next.js' | 'React' | 'Node.js' | 'MongoDB' | 'SQL' | 'AWS' | 'Docker' | 'TypeScript' | 'TailwindCSS';

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: Technology[];
  imageUrl: string;
  sourceCodeUrl: string;
  liveDemoUrl?: string;
  year: number;
  imageAiHint?: string;
}

export const projectsData: Project[] = [
  {
    id: '1',
    name: 'Intelligent Recommendation System',
    description: 'A personalized recommendation engine for e-commerce, utilizing collaborative filtering and content-based approaches to enhance user engagement and sales.',
    technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'AWS'],
    imageUrl: 'https://placehold.co/600x400.png',
    sourceCodeUrl: 'https://github.com/ankitkumar/recommendation-system',
    liveDemoUrl: '#',
    year: 2023,
    imageAiHint: 'data algorithm',
  },
  {
    id: '2',
    name: 'Natural Language Query Interface for Databases',
    description: 'Developed a system that allows users to query databases using natural language, translating queries into SQL using advanced NLP models.',
    technologies: ['Python', 'PyTorch', 'SQL', 'Docker'],
    imageUrl: 'https://placehold.co/600x400.png',
    sourceCodeUrl: 'https://github.com/ankitkumar/nlq-database',
    year: 2022,
    imageAiHint: 'database code',
  },
  {
    id: '3',
    name: 'Real-time Anomaly Detection in Sensor Data',
    description: 'Built a streaming data processing pipeline with an ML model to detect anomalies in IoT sensor data for predictive maintenance.',
    technologies: ['Python', 'Scikit-learn', 'AWS', 'Node.js'],
    imageUrl: 'https://placehold.co/600x400.png',
    sourceCodeUrl: 'https://github.com/ankitkumar/anomaly-detection',
    liveDemoUrl: '#',
    year: 2023,
    imageAiHint: 'iot sensor',
  },
  {
    id: '4',
    name: 'Portfolio Website (This one!)',
    description: 'My personal portfolio website built with Next.js, Tailwind CSS, and integrated with GenAI for content generation and 3D animations.',
    technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
    imageUrl: 'https://placehold.co/600x400.png',
    sourceCodeUrl: 'https://github.com/ankitkumar/portfolio-nextjs',
    year: 2024,
    imageAiHint: 'website design',
  },
];

export const allTechnologies: Technology[] = Array.from(new Set(projectsData.flatMap(p => p.technologies))).sort() as Technology[];
