
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type WelcomeScreenProps = {
    onStart: (name: string, chestNumber: string) => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [chestNumber, setChestNumber] = useState('');

  const handleStart = () => {
    if (name.trim() && chestNumber.trim()) {
      onStart(name, chestNumber);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">
        Welcome to the Coding Event
      </h1>
      <p className="text-lg text-muted-foreground mb-4">Powered by Zephyrus.</p>
      <Image src="/icon.png" alt="App Icon" width={60} height={60} className="mb-8" />
      
      <div className="w-full max-w-sm space-y-6 mb-8">
          <div className="relative">
              <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                      "peer h-10 w-full border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-transparent",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Full Name"
              />
              <Label 
                  htmlFor="name"
                  className={cn(
                      "absolute left-3 -top-2.5 bg-background px-1 text-sm text-primary transition-all",
                      "peer-placeholder-shown:left-1/2 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground",
                      "peer-focus:left-3 peer-focus:-top-2.5 peer-focus:-translate-x-0 peer-focus:text-sm peer-focus:text-primary"
                  )}
              >
                  Full Name
              </Label>
          </div>
          <div className="relative">
              <Input 
                  id="chestNumber"
                  value={chestNumber}
                  onChange={(e) => setChestNumber(e.target.value)}
                  className={cn(
                      "peer h-10 w-full border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-transparent",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Chest Number"
              />
              <Label 
                  htmlFor="chestNumber"
                   className={cn(
                      "absolute left-3 -top-2.5 bg-background px-1 text-sm text-primary transition-all",
                      "peer-placeholder-shown:left-1/2 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground",
                      "peer-focus:left-3 peer-focus:-top-2.5 peer-focus:-translate-x-0 peer-focus:text-sm peer-focus:text-primary"
                  )}
              >
                  Chest Number
              </Label>
          </div>
      </div>

      <div className="max-w-xl w-full text-left bg-muted/30 p-6 rounded-lg border mb-8">
          <h2 className="text-xl font-bold text-center mb-4 text-primary">Competition Rules</h2>
          <ul className="space-y-3 text-muted-foreground list-disc list-inside">
              <li>This is the second round of the competition and tests your coding skills.</li>
              <li>There is option to toggle between Python and C programming languages; participants can use any one to solve the question.</li>
              <li>To ensure fairness, all participants will be strictly monitored, and any form of malpractice will not be tolerated and will result in immediate disqualification.</li>
              <li>This round (Round 2) has a 45 minute time limit.</li>
              <li>The final rankings are based on the speed and accuracy of completing this round.</li>
          </ul>
      </div>

        <p className="text-muted-foreground mb-8 max-w-md">
            Click below to start the challenge. When you start the challenge, the timer of 45 minutes will also start.
        </p>

      <Button size="lg" onClick={handleStart} disabled={!name.trim() || !chestNumber.trim()}>
        <Play className="mr-2" />
        Start Challenge
      </Button>
    </div>
  );
}
