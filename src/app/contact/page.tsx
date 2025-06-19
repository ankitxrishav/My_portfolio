
import SectionWrapper from '@/components/ui/section-wrapper';
import ContactForm from '@/components/contact/contact-form';

export default function ContactPage() {
  return (
    <SectionWrapper
      title="Contact Me"
      subtitle="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions."
      aria-labelledby="contact-heading"
    >
      <ContactForm />
    </SectionWrapper>
  );
}
