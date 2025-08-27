
"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, FileText, Loader2, ListChecks } from 'lucide-react';
import { CodePanel, type SubmissionData, type CodePanelRef } from '@/components/code-panel';
import { useToast } from '@/hooks/use-toast';
import { problems } from '@/lib/problems';
import * as htmlToImage from 'html-to-image';
import { type Submission } from '@/app/page';
import { cn, formatTime } from '@/lib/utils';

type ZephyrusProps = {
    problemIndex: number;
    initialSubmissions: Submission[];
    onSaveAndNext: (submission: SubmissionData) => void;
    onSaveAndPrevious: (submission: SubmissionData) => void;
    onGoToReview: (submission: SubmissionData) => void;
    timeLeft: number;
};

export type ZephyrusRef = {
  getCurrentSubmission: () => SubmissionData | null;
};

export const Zephyrus = forwardRef<ZephyrusRef, ZephyrusProps>(
  ({ problemIndex, onSaveAndNext, onSaveAndPrevious, onGoToReview, timeLeft, initialSubmissions }, ref) => {
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const problemStatementRef = useRef<HTMLDivElement>(null);
  const [problemImageUrl, setProblemImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showProblemForRender, setShowProblemForRender] = useState(false);

  const codePanelRef = useRef<CodePanelRef>(null);

  const currentProblem = problems[problemIndex];
  const isLastProblem = problemIndex === problems.length - 1;

  useImperativeHandle(ref, () => ({
    getCurrentSubmission: () => {
      return codePanelRef.current?.getSubmissionData() || null;
    }
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Step 1: When problemIndex changes, reset state and trigger a re-render
  // of the hidden div with the new problem content.
  useEffect(() => {
    setIsGeneratingImage(true);
    setShowProblemForRender(true); // This triggers the next useEffect
  }, [problemIndex]);

  // Step 2: Once the hidden div is rendered (showProblemForRender is true),
  // run the image generation logic.
  useEffect(() => {
    if (showProblemForRender && problemStatementRef.current) {
      htmlToImage.toPng(problemStatementRef.current, {
        backgroundColor: 'hsl(0 0% 0%)',
        pixelRatio: 2,
        skipFonts: true,
        style: {
          color: 'hsl(var(--muted-foreground))'
        }
      })
      .then((dataUrl) => {
        setProblemImageUrl(dataUrl);
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
        toast({
          title: "Error generating problem statement",
          description: "Could not render the problem. Please try refreshing.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsGeneratingImage(false);
        setShowProblemForRender(false); // Hide the div again after capture
      });
    }
  }, [showProblemForRender, toast]);

  const handleSave = (submissionData: SubmissionData) => {
    onSaveAndNext(submissionData);
  };
  
  const handleGoToReviewClick = () => {
    const submissionData = codePanelRef.current?.getSubmissionData();
    if(submissionData){
        onGoToReview(submissionData);
    } else {
        toast({
            title: "Error",
            description: "Could not get submission data. Please try again.",
            variant: "destructive"
        })
    }
  };
  
  const handleSaveAndPrevious = (submissionData: SubmissionData) => {
    onSaveAndPrevious(submissionData);
  };

  const currentSubmission = initialSubmissions.find(s => s.problem.title === currentProblem.title);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4">
      {showProblemForRender && (
        <div className="absolute -left-[9999px] top-auto">
          <div ref={problemStatementRef} className="p-4 bg-background text-muted-foreground w-[600px]">
            <h2 className="text-lg font-semibold text-foreground mb-2">{currentProblem.title}</h2>
            <p className="whitespace-pre-wrap">{currentProblem.description}</p>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Zephyrus Icon" width={32} height={32} />
            <h1 className="text-2xl font-bold text-primary">Zephyrus</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleGoToReviewClick}>
            <ListChecks className="w-5 h-5 mr-2" />
            Review Answers
          </Button>
          <div className={cn(
            "flex items-center gap-2 bg-card p-2 rounded-lg border transition-colors",
            timeLeft <= 60 && "border-destructive"
          )}>
            <Timer className={cn("w-6 h-6 text-accent", timeLeft <= 60 && "text-destructive")} />
            <span className={cn(
              "text-xl font-semibold text-accent-foreground font-mono transition-colors",
              timeLeft <= 60 && "animate-blink text-destructive"
            )}>
              {isClient ? formatTime(timeLeft) : '00:45:00'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Problem Statement {problemIndex + 1} / {problems.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {isGeneratingImage && !problemImageUrl && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                     <p className="ml-4 text-muted-foreground">Loading Problem...</p>
                </div>
            )}
            {problemImageUrl && (
              <div className="w-full h-full overflow-hidden bg-card" style={{ userSelect: 'none' }} onContextMenu={(e) => e.preventDefault()}>
                <Image src={problemImageUrl} alt="Problem Statement" width={600} height={400} className="w-full h-auto object-contain" />
              </div>
            )}
          </CardContent>
        </Card>

        <CodePanel
            ref={codePanelRef}
            key={problemIndex}
            onSave={handleSave} 
            onSaveAndPrevious={handleSaveAndPrevious}
            onGoToReview={onGoToReview}
            isLastProblem={isLastProblem} 
            problemIndex={problemIndex}
            initialSubmission={currentSubmission}
            problem={currentProblem}
        />
      </main>
    </div>
  );
});

Zephyrus.displayName = "Zephyrus";
