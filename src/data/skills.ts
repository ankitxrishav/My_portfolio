
'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Code, Layers, AppWindow, Atom, Server, Palette, Cpu, Sigma, Table2, Calculator, BarChart3, PieChart, Camera, Eye, Hand, BoxIcon, LineChart, MessageCircle, Touchpad, Network, Github, DatabaseZap, ContainerIcon, Presentation, FileCode2, Volume2, Video, DraftingCompass, Wrench, Paintbrush
} from 'lucide-react';

export interface Skill {
  name: string;
  icon: LucideIcon;
}

export interface SkillCategory {
  name: string;
  categoryIcon: LucideIcon;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    name: "Programming Languages",
    categoryIcon: Code,
    skills: [
      { name: "Python", icon: Code },
      { name: "JavaScript", icon: Code },
      { name: "TypeScript", icon: Code },
    ],
  },
  {
    name: "Frameworks & Libraries",
    categoryIcon: Layers,
    skills: [
      { name: "Next.js", icon: AppWindow },
      { name: "React", icon: Atom },
      { name: "Node.js", icon: Server },
      { name: "Tailwind CSS", icon: Palette },
      { name: "TensorFlow", icon: Cpu },
      { name: "PyTorch", icon: Cpu },
      { name: "Scikit-learn", icon: Sigma },
      { name: "Pandas", icon: Table2 },
      { name: "NumPy", icon: Calculator },
      { name: "Matplotlib", icon: BarChart3 },
      { name: "Seaborn", icon: PieChart },
      { name: "OpenCV", icon: Camera },
      { name: "MediaPipe", icon: Hand },
      { name: "Three.js", icon: BoxIcon },
    ],
  },
  {
    name: "AI/ML Expertise",
    categoryIcon: Cpu, 
    skills: [
      { name: "Machine Learning", icon: Cpu },
      { name: "Deep Learning", icon: BrainCog },
      { name: "Time-Series Analysis", icon: LineChart },
      { name: "Computer Vision (CV)", icon: Eye },
      { name: "Natural Language Processing (NLP)", icon: MessageCircle },
      { name: "Interactive Systems", icon: Touchpad },
      { name: "LSTM Networks", icon: Network },
    ],
  },
  {
    name: "Tools & Platforms",
    categoryIcon: Wrench,
    skills: [
      { name: "Git & GitHub", icon: Github },
      { name: "Firebase", icon: DatabaseZap },
      { name: "Docker", icon: ContainerIcon },
      { name: "Streamlit", icon: Presentation },
      { name: "HTML/CSS", icon: FileCode2 },
      { name: "SoundDevice", icon: Volume2 },
    ],
  },
  {
    name: "Creative Skills",
    categoryIcon: Paintbrush,
    skills: [
      { name: "Video Editing", icon: Video },
      { name: "Graphics Design", icon: DraftingCompass },
    ],
  },
];
