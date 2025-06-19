
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  type: 'education' | 'work' | 'milestone';
  icon?: React.ComponentType<{ className?: string }>;
}

import { GraduationCap, Briefcase, Award, Zap, Users } from 'lucide-react'; // Added Zap, Users for variety

export const timelineData: TimelineEvent[] = [
  {
    id: 'journey-5',
    date: 'Looking Ahead',
    title: 'Vision Going Forward',
    subtitle: 'Ethical & Engaging AI Systems',
    description: 'My goal is to build ethical, intelligent, and emotionally resonant AI systems that don’t just function — they engage, adapt, and enhance the world around them.',
    type: 'milestone',
    icon: Award,
  },
  {
    id: 'journey-4',
    date: 'During B.Tech',
    title: 'Evolving into a Creator',
    subtitle: 'Real-world Problem Solving & Project Development',
    description: 'Moved beyond classroom knowledge into real-world problem-solving. I explored diverse fields — energy, safety, music, privacy — building tools that merged data, AI, and design.',
    type: 'milestone',
    icon: Briefcase,
  },
  {
    id: 'journey-3',
    date: '2023 - Present',
    title: 'B.Tech in AI & ML',
    subtitle: 'Madhav Institute of Technology and Science (MITS), Gwalior',
    description: 'Currently in my third year. From day one, I immersed myself in coding, machine learning fundamentals, and hands-on experimentation — from time-series modeling to real-time computer vision systems.',
    type: 'education',
    icon: Zap, 
  },
  {
    id: 'journey-2',
    date: '2022',
    title: 'PNPS, Sasaram',
    subtitle: 'Senior Secondary (12th Grade) — Achieved 81%',
    description: 'Completed my 12th grade with an 81% score. My early love for math and logic naturally guided me toward a career in technology.',
    type: 'education',
    icon: GraduationCap,
  },
  {
    id: 'journey-1',
    date: '2020',
    title: 'DAV Public School, Bikramganj',
    subtitle: 'High School (10th Grade) — Achieved 94%',
    description: 'Laid a strong academic foundation with a 94% score in my 10th grade, fueling my interest in analytical thinking.',
    type: 'education',
    icon: GraduationCap,
  },
];
