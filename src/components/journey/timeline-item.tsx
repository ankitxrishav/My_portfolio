
import type { TimelineEvent } from '@/data/timeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

export default function TimelineItem({ event, isLast }: TimelineItemProps) {
  const IconComponent = event.icon;
  return (
    <div className="relative pl-8 sm:pl-12 py-6 group">
      {/* Vertical line */}
      {!isLast && (
        <div className={cn(
          "absolute left-3 sm:left-5 top-0 w-0.5 h-full group-hover:bg-accent transition-colors duration-300",
           event.type === 'work' ? 'bg-primary/50' : event.type === 'education' ? 'bg-secondary/50' : 'bg-muted-foreground/30'
        )} />
      )}
      
      {/* Dot */}
      <div className={cn(
        "absolute left-[0.30rem] sm:left-[0.80rem] top-[calc(1.5rem-0.5rem)] w-4 h-4 rounded-full border-2 border-background group-hover:border-accent transition-colors duration-300",
        event.type === 'work' ? 'bg-primary' : event.type === 'education' ? 'bg-secondary' : 'bg-muted-foreground'
      )}>
        {IconComponent && <IconComponent className="absolute -top-[1px] -left-[1px] w-4 h-4 p-0.5 text-background" />}
      </div>

      <Card className="transition-all duration-300 transform group-hover:scale-[1.01] hover:shadow-accent/20 bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
            <CardTitle className="font-headline text-lg sm:text-xl text-foreground">{event.title}</CardTitle>
            <p className="text-xs sm:text-sm text-accent font-medium mt-1 sm:mt-0">{event.date}</p>
          </div>
          {event.subtitle && <CardDescription className="text-sm text-muted-foreground">{event.subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 text-sm leading-relaxed">{event.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
