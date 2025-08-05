
export type Technology = 
  'Python' | 
  'TensorFlow' | 
  'PyTorch' | 
  'Scikit-learn' | 
  'Next.js' | 
  'React' | 
  'Node.js' | 
  'MongoDB' | 
  'SQL' | 
  'AWS' | 
  'Docker' | 
  'TypeScript' | 
  'TailwindCSS' |
  'Pandas' |
  'NumPy' |
  'Matplotlib' |
  'Seaborn' |
  'OpenCV' |
  'MediaPipe' |
  'SoundDevice' |
  'JavaScript' |
  'HTML/CSS' |
  'LSTM' |
  'Three.js';

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: Technology[];
  imageUrl: string;
  sourceCodeUrl: string;
  liveDemoUrl?: string;
  year: number;
}

export const projectsData: Project[] = [
  {
    id: 'proj-portfolio',
    name: 'Personal Portfolio Website',
    description: 'The interactive portfolio website you are currently viewing. Designed to showcase my skills, projects, and journey as an ML Engineer and Creative Technologist. Built with Next.js, React, Tailwind CSS, and Three.js for dynamic 3D visuals.',
    technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Three.js'],
    imageUrl: '/images/port.png', 
    sourceCodeUrl: 'https://github.com/ankitxrishav/', 
    liveDemoUrl: 'https://ankitxk.vercel.app',
    year: new Date().getFullYear(),
  },
  {
    id: 'proj-fenrirpdf',
    name: 'FenrirPDF',
    description: 'A lightweight, fast, and privacy-focused web application that provides essential PDF utilities right in your browser. Merge multiple PDFs into a single file or extract and reorder pages from an existing document with a simple drag-and-drop interface. No sign-ups, no wait times, and absolutely no file uploads to any server.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'JavaScript'],
    imageUrl: '/images/fenrirpdf.png',
    sourceCodeUrl: 'https://github.com/ankitxrishav/FenrirPDF',
    liveDemoUrl: 'https://fenrirpdf.netlify.app',
    year: 2024,
  },
  {
    id: 'proj-3',
    name: 'Hand Gesture–Controlled Music Generator',
    description: 'A creative computer vision project that converts real-time hand gestures into sitar-like musical sounds. Used OpenCV to detect hand positions using webcam input. Mapped gestures to MIDI sounds to generate musical notes. Created a real-time performance experience.',
    technologies: ['Python', 'OpenCV', 'MediaPipe', 'SoundDevice', 'NumPy'],
    imageUrl: '/images/hand.png',
    sourceCodeUrl: 'https://github.com/ankitxrishav/HandGesture_Music.git',
    year: 2022,
  },
  {
    id: 'proj-4',
    name: 'FenrirMessage — Secure Messaging App',
    description: 'A privacy-first messaging application with clean UX and end-to-end message handling. Designed the UI and built the full-stack structure. Focused on minimalism, responsiveness, and data protection. Integrated core messaging features.',
    technologies: ['JavaScript', 'HTML/CSS', 'Node.js'],
    imageUrl: '/images/mess.png',
    sourceCodeUrl: 'https://github.com/ankitxrishav/fenrirmessage.git',
    liveDemoUrl: 'https://fenrirmessage.onrender.com',
    year: 2024,
  },
  {
    id: 'proj-1',
    name: 'Electricity Demand Prediction',
    description: 'A machine learning system that forecasts electricity demand based on historical data and weather features. Built a predictive model using time-series (LSTM) and deep learning techniques. Engineered features like holidays, temperature, solar generation, and seasonality. Visualized demand trends for smart energy planning.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'LSTM'],
    imageUrl: '/images/elec.png',
    sourceCodeUrl: 'https://github.com/ankitxrishav/electricityDemandPrediction.git',
    year: 2024,
  },
  {
    id: 'proj-2',
    name: 'Crimes Against Women — Analysis & Prediction',
    description: 'A social-impact-driven ML pipeline analyzing and predicting trends in crimes against women across Indian states. Cleaned and analyzed crime datasets. Built classification/regression models to predict crime rates. Provided region-wise visual insights for awareness.',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Seaborn', 'Matplotlib'],
    imageUrl: '/images/crime.png',
    sourceCodeUrl: 'https://github.com/ankitxrishav/Crimes-Against-Women-Analysis-and-prediction',
    year: 2024,
  },
];

export const allTechnologies: Technology[] = Array.from(new Set(projectsData.flatMap(p => p.technologies))).sort() as Technology[];
