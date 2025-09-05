
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award } from 'lucide-react';
import Image from 'next/image';
import { formatTime } from '@/lib/utils';

type FinishScreenProps = {
    userName: string;
    chestNumber: string;
    finalTime: number;
};

export function FinishScreen({ userName, chestNumber, finalTime }: FinishScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Award className="w-20 h-20 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Congratulations, {userName}!</CardTitle>
          <CardDescription className="text-lg">You have successfully completed the coding event.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-left bg-muted/50 p-4 rounded-lg border">
              <p className="text-muted-foreground">Name: <span className="font-semibold text-foreground">{userName}</span></p>
              <p className="text-muted-foreground">Chest Number: <span className="font-semibold text-foreground">{chestNumber}</span></p>
              <p className="text-muted-foreground">Final Time Remaining: <span className="font-semibold text-foreground font-mono">{formatTime(finalTime)}</span></p>
          </div>
          <p className="text-sm text-muted-foreground">Please inform the nearest invigilator that you have finalized your submission</p>
           <div className="flex items-center justify-center pt-4">
            <Image src="/icon.png" alt="Zephyrus Icon" width={24} height={24} />
            <p className="ml-2 text-sm text-muted-foreground">Powered by Zephyrus</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
