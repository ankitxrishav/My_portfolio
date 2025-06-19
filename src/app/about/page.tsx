
import SectionWrapper from '@/components/ui/section-wrapper';
import AboutContent from '@/components/about/about-content';

export default function AboutPage() {
  return (
    <SectionWrapper
      title="About Me"
      subtitle="Discover more about my background, skills, and passion for machine learning."
      aria-labelledby="about-heading"
    >
      <AboutContent />
    </SectionWrapper>
  );
}
