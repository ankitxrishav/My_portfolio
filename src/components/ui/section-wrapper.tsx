
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ title, subtitle, children, className, ...props }: SectionWrapperProps) {
  return (
    <section className={cn('py-12 md:py-16 lg:py-20', className)} {...props}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-8 md:mb-12 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
