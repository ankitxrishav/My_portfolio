
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string | React.ReactNode;
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
          <div className="mb-10 md:mb-16 flex justify-center">
            <Card className="relative p-4 md:p-6 max-w-xl w-full text-center text-lg md:text-xl text-muted-foreground shadow-xl overflow-visible">
              {typeof subtitle === 'string' ? subtitle : <div>{subtitle}</div>}
              <div 
                className="absolute left-1/2 bottom-0 w-4 h-4 bg-card transform -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-border"
              ></div>
            </Card>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
