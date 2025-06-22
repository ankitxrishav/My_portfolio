
import { cn } from '@/lib/utils';

interface HeroTextLineProps {
  text: string;
  className?: string;
  delay?: string;
}

const HeroTextLine = ({ text, className, delay }: HeroTextLineProps) => {
  return (
    <div
      className={cn("hero-text-line", className)}
      style={{ animationDelay: delay }}
    >
      {text}
    </div>
  );
};

export default HeroTextLine;
