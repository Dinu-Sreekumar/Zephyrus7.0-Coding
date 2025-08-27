
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Zephyrus, type ZephyrusRef } from '@/components/zephyrus';
import { WelcomeScreen } from '@/components/welcome-screen';
import { FinishScreen } from '@/components/finish-screen';
import { ReviewScreen } from '@/components/review-screen';
import { problems, type Problem } from '@/lib/problems';
import { useToast } from "@/hooks/use-toast";
import { type SubmissionData } from '@/components/code-panel';
import { formatTime } from '@/lib/utils';
import { executeCode, type ExecuteCodeOutput } from '@/ai/flows/execute-code';

export type Submission = {
    problem: Problem;
    code: string;
    language: string;
    output: string | null;
    timeSubmitted: number;
};

export default function Home() {
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'review' | 'finished'>('welcome');
  const [userName, setUserName] = useState('');
  const [chestNumber, setChestNumber] = useState('');
  const [finalTime, setFinalTime] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const { toast } = useToast();
  const zephyrusRef = useRef<ZephyrusRef>(null);

  const handleDownloadSummary = useCallback((finalSubmissions: Submission[]) => {
    let fileContent = `** Zephyrus Coding Event Submission Summary **\n\n`;
    fileContent += `** Name: ${userName} **\n`;
    fileContent += `** Chest Number: ${chestNumber} **\n\n`;

    problems.forEach((problem, index) => {
        const sub = finalSubmissions.find(s => s.problem.title === problem.title);
        fileContent += `========================================\n`;
        fileContent += `** Problem ${index + 1}: ${problem.title} **\n`;
        fileContent += `========================================\n\n`;
        if (sub && sub.code) {
            fileContent += `** Language: ${sub.language.charAt(0).toUpperCase() + sub.language.slice(1)} **\n\n`;
            
            fileContent += `+--------------------------------------------------------------------+\n`;
            fileContent += `| Code                                                               |\n`;
            fileContent += `+--------------------------------------------------------------------+\n`;
            fileContent += `${sub.code}\n`;
            fileContent += `+--------------------------------------------------------------------+\n\n`;

            fileContent += `+--------------------------------------------------------------------+\n`;
            fileContent += `| Output                                                             |\n`;
            fileContent += `+--------------------------------------------------------------------+\n`;
            fileContent += `${sub.output || 'No output was generated or an error occurred.'}\n`;
            fileContent += `+--------------------------------------------------------------------+\n\n\n`;
        } else {
            fileContent += `Not Attempted.\n\n\n`;
        }
    });

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zephyrus_summary_${userName.replace(/\s+/g, '_')}_${chestNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [userName, chestNumber]);

  const handleTimeUp = useCallback(() => {
    toast({
        title: "Time's up!",
        description: "The coding session has ended. Your submission is being finalized.",
        variant: "destructive"
    });
    setFinalTime(0);
    const lastSubmission = zephyrusRef.current?.getCurrentSubmission();
    let finalSubmissions = submissions;

    if(lastSubmission){
        const newSubmission: Submission = { ...lastSubmission, timeSubmitted: 0 };
        const existingSubmissionIndex = submissions.findIndex(s => s.problem.title === lastSubmission.problem.title);
        
        if (existingSubmissionIndex > -1) {
            finalSubmissions = [...submissions];
            finalSubmissions[existingSubmissionIndex] = newSubmission;
        } else {
            finalSubmissions = [...submissions, newSubmission];
        }
        setSubmissions(finalSubmissions);
    } 
    
    handleDownloadSummary(finalSubmissions);
    setGameState('finished');
  }, [toast, submissions, handleDownloadSummary]);

  useEffect(() => {
    if (gameState === 'playing' && !isTimerRunning) {
        setIsTimerRunning(true);
    }
  }, [gameState, isTimerRunning]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    
    if (gameState === 'playing' || gameState === 'review') {
        window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameState]);

  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        
        if (prevTime === 1201) { // ~20 minutes
          toast({
              title: "20 Minutes Remaining",
              description: "Keep up the great work!",
          });
        }
    
        if (prevTime === 601) { // ~10 minutes
            toast({
                title: "10 Minutes Remaining",
                description: "Time to start wrapping up.",
                variant: "destructive"
            });
        }
    
        if (prevTime === 61) { // ~1 minute
            toast({
                title: "1 Minute Remaining!",
                description: "Finalize your solutions now.",
                variant: "destructive"
            });
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, toast, handleTimeUp]);


  const handleStart = (name: string, chest: string) => {
    setUserName(name);
    setChestNumber(chest);
    setGameState('playing');
  };

  const handleRevisitProblem = (index: number) => {
    setCurrentProblemIndex(index);
    setGameState('playing');
  };

  const updateSubmissions = (submission: SubmissionData, callback?: () => void) => {
    const newSubmission: Submission = { ...submission, timeSubmitted: timeLeft };
    const existingSubmissionIndex = submissions.findIndex(s => s.problem.title === submission.problem.title);
    let updatedSubmissions;
    if (existingSubmissionIndex > -1) {
      updatedSubmissions = [...submissions];
      updatedSubmissions[existingSubmissionIndex] = newSubmission;
    } else {
      updatedSubmissions = [...submissions, newSubmission];
    }
    setSubmissions(updatedSubmissions);
    if (callback) {
        callback();
    }
  }

  const handleGoToReview = (submission: SubmissionData) => {
    updateSubmissions(submission, () => {
        setGameState('review');
    });
  };
  
  const handleSaveAndNext = (submission: SubmissionData) => {
    updateSubmissions(submission);

    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      setGameState('review');
    }
  };

  const handleSaveAndPrevious = (submission: SubmissionData) => {
    updateSubmissions(submission);

    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    setFinalTime(timeLeft);
    toast({
        title: "Finalizing Submission",
        description: "Running all your saved code. Please wait...",
    });

    try {
        const executionPromises = submissions.map(async (sub) => {
            if (sub.code) {
                const result: ExecuteCodeOutput = await executeCode({
                    language: sub.language,
                    code: sub.code,
                });
                return { ...sub, output: result.output || result.error || "Execution failed." };
            }
            return sub;
        });

        const finalSubmissions = await Promise.all(executionPromises);
        setSubmissions(finalSubmissions);
        handleDownloadSummary(finalSubmissions);
        setGameState('finished');
    } catch (error) {
        console.error("Error during final execution:", error);
        toast({
            title: "Error",
            description: "An error occurred while running your code. Please notify the invigilator.",
            variant: "destructive",
        });
    } finally {
        setIsFinishing(false);
    }
}
  
  if (gameState === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (gameState === 'playing') {
    return (
        <Zephyrus 
            ref={zephyrusRef}
            userName={userName}
            chestNumber={chestNumber}
            problemIndex={currentProblemIndex}
            onSaveAndNext={handleSaveAndNext}
            onSaveAndPrevious={handleSaveAndPrevious}
            onGoToReview={handleGoToReview}
            initialSubmissions={submissions}
            timeLeft={timeLeft}
        />
    );
  }

  if (gameState === 'review') {
      return (
          <ReviewScreen 
              submissions={submissions}
              onRevisit={handleRevisitProblem}
              onFinish={handleFinish}
              timeLeft={timeLeft}
              isFinishing={isFinishing}
          />
      );
  }

  if (gameState === 'finished') {
    return (
        <FinishScreen 
            userName={userName}
            chestNumber={chestNumber}
            finalTime={finalTime}
        />
    );
  }

  return null;
}
