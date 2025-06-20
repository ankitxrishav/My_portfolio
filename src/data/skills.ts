
'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Code, Layers, AppWindow, Atom, Server, Palette, Cpu, Sigma, Table2, Calculator, BarChart3, PieChart, Camera, Eye, Hand, BoxIcon, LineChart, MessageCircle, Touchpad, Network, Github, DatabaseZap, ContainerIcon, Presentation, FileCode2, Volume2, Video, DraftingCompass, Wrench, Paintbrush, BrainCog
} from 'lucide-react';

export interface Skill {
  name: string;
  icon: LucideIcon;
  level: number; // Proficiency level from 0 to 100
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
      { name: "Python", icon: Code, level: 90 },
      { name: "TypeScript", icon: Code, level: 75 },
      { name: "C++", icon: Code, level: 65 },
    ],
  },
  {
    name: "Frameworks & Libraries",
    categoryIcon: Layers,
    skills: [
      { name: "Tailwind CSS", icon: Palette, level: 85 },
      { name: "TensorFlow", icon: Cpu, level: 80 },
      { name: "PyTorch", icon: Cpu, level: 75 },
      { name: "Scikit-learn", icon: Sigma, level: 85 },
      { name: "Pandas", icon: Table2, level: 90 },
      { name: "NumPy", icon: Calculator, level: 85 },
      { name: "Matplotlib", icon: BarChart3, level: 70 },
      { name: "Seaborn", icon: PieChart, level: 70 },
      { name: "OpenCV", icon: Camera, level: 75 },
      { name: "MediaPipe", icon: Hand, level: 70 },
      { name: "Three.js", icon: BoxIcon, level: 60 },
    ],
  },
  {
    name: "AI/ML Expertise",
    categoryIcon: Cpu,
    skills: [
      { name: "Machine Learning", icon: Cpu, level: 90 },
      { name: "Deep Learning", icon: BrainCog, level: 80 },
      { name: "Time-Series Analysis", icon: LineChart, level: 85 },
      { name: "Computer Vision (CV)", icon: Eye, level: 75 },
      { name: "Natural Language Processing (NLP)", icon: MessageCircle, level: 70 },
      { name: "Interactive Systems", icon: Touchpad, level: 65 },
      { name: "LSTM Networks", icon: Network, level: 80 },
    ],
  },
  {
    name: "Tools & Platforms",
    categoryIcon: Wrench,
    skills: [
      { name: "Git & GitHub", icon: Github, level: 85 },
      { name: "Streamlit", icon: Presentation, level: 70 },
      { name: "HTML/CSS", icon: FileCode2, level: 80 },
      { name: "SoundDevice", icon: Volume2, level: 60 },
    ],
  },
  {
    name: "Creative Skills",
    categoryIcon: Paintbrush,
    skills: [
      { name: "Video Editing", icon: Video, level: 75 },
      { name: "Graphics Design", icon: DraftingCompass, level: 70 },
    ],
  },
];
