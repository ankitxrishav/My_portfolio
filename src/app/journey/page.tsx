
import SectionWrapper from '@/components/ui/section-wrapper';
import TimelineDisplay from '@/components/journey/timeline-display';

export default function JourneyPage() {
  return (
    <SectionWrapper
      title="My Journey"
      subtitle="Follow my professional path, key milestones, and educational background."
      aria-labelledby="journey-heading"
    >
      <TimelineDisplay />
    </SectionWrapper>
  );
}
