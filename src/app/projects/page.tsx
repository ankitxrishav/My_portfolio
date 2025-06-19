
import SectionWrapper from '@/components/ui/section-wrapper';
import ProjectList from '@/components/projects/project-list';

export default function ProjectsPage() {
  return (
    <SectionWrapper
      title="My Projects"
      subtitle="A selection of projects I've worked on, showcasing my skills in machine learning and software development."
      aria-labelledby="projects-heading"
    >
      <ProjectList />
    </SectionWrapper>
  );
}
