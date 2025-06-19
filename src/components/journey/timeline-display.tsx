
"use client";

import { timelineData, type TimelineEvent } from '@/data/timeline';
import TimelineItem from './timeline-item';
// Removed AI generation related imports and logic

export default function TimelineDisplay() {
  const currentTimelineData: TimelineEvent[] = timelineData; // Directly use static data

  return (
    <div>
      {currentTimelineData.length > 0 ? (
        <div className="space-y-2">
          {currentTimelineData.map((event, index) => (
            <TimelineItem key={event.id} event={event} isLast={index === currentTimelineData.length - 1} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          No journey information available.
        </p>
      )}
    </div>
  );
}
