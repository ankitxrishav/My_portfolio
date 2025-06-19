
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  type: 'education' | 'work' | 'milestone';
  icon?: React.ComponentType<{ className?: string }>;
}

// You can use lucide-react icons here if desired, e.g. GraduationCap, Briefcase
import { GraduationCap, Briefcase, Award } from 'lucide-react';

export const timelineData: TimelineEvent[] = [
  {
    id: '1',
    date: '2023 - Present',
    title: 'Senior ML Engineer',
    subtitle: 'Innovatech Solutions Inc.',
    description: 'Leading development of cutting-edge AI products, focusing on NLP and computer vision. Mentor junior engineers and drive research initiatives.',
    type: 'work',
    icon: Briefcase,
  },
  {
    id: '2',
    date: '2021 - 2023',
    title: 'Machine Learning Engineer',
    subtitle: 'DataDriven Corp.',
    description: 'Designed and implemented machine learning models for predictive analytics and fraud detection. Collaborated with cross-functional teams to integrate ML solutions.',
    type: 'work',
    icon: Briefcase,
  },
  {
    id: '3',
    date: '2020',
    title: 'Master of Science in Computer Science (AI Specialization)',
    subtitle: 'Prestigious University',
    description: 'Focused on advanced machine learning algorithms, deep learning, and big data technologies. Thesis on "Efficient Neural Network Architectures".',
    type: 'education',
    icon: GraduationCap,
  },
  {
    id: '4',
    date: '2018',
    title: 'Bachelor of Technology in Computer Engineering',
    subtitle: 'Tech Institute of Excellence',
    description: 'Graduated with honors, active in coding clubs and AI research groups. Final year project on automated text summarization.',
    type: 'education',
    icon: GraduationCap,
  },
   {
    id: '5',
    date: 'Ongoing',
    title: 'AI Research & Open Source Contributions',
    subtitle: 'Personal Endeavors',
    description: 'Actively contribute to open-source ML projects and publish research papers in AI ethics and explainable AI.',
    type: 'milestone',
    icon: Award,
  },
];
