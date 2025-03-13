'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

export function ExamTimer({ endAt }: { endAt: Date }) {
  const [timeLeft, setTimeLeft] = useState(Math.floor((new Date(endAt).getTime() - Date.now()) / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [endAt]);

  const percentage = (timeLeft / (timeLeft + 1)) * 100;

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-2" />
      <p className="text-sm text-muted-foreground">
        Time Remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </p>
    </div>
  );
}