
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Edit, Send, ShieldAlert, Timer, Loader2 } from 'lucide-react';
import { problems } from '@/lib/problems';
import { type Submission } from '@/app/page';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn, formatTime } from '@/lib/utils';


type ReviewScreenProps = {
    submissions: Submission[];
    onRevisit: (index: number) => void;
    onFinish: () => void;
    timeLeft: number;
    isFinishing: boolean;
};

export function ReviewScreen({ submissions, onRevisit, onFinish, timeLeft, isFinishing }: ReviewScreenProps) {
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const preventAction = (e: React.ClipboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        toast({
            title: 'Action Disabled',
            description: 'Copying, cutting, and right-clicking are disabled on this page.',
            variant: 'destructive',
        });
    };

    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative"
            onCopy={preventAction}
            onCut={preventAction}
            onPaste={preventAction}
            onContextMenu={preventAction}
            style={{ userSelect: 'none' }}
        >
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">Review Your Submissions</CardTitle>
                    <CardDescription className="text-lg">You can revisit any question to modify your answer before the final submission.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center mb-6">
                        <div className={cn(
                          "flex items-center gap-2 bg-card p-2 rounded-lg border transition-colors",
                          timeLeft <= 60 && "border-destructive"
                        )}>
                            <Timer className={cn("w-6 h-6 text-accent", timeLeft <= 60 && "text-destructive")} />
                            <span className={cn(
                              "text-xl font-semibold text-accent-foreground font-mono transition-colors",
                              timeLeft <= 60 && "animate-blink text-destructive"
                            )}>
                              {isClient ? formatTime(timeLeft) : '...'}
                            </span>
                        </div>
                    </div>
                    <Alert variant="destructive" className="mb-6">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Fair Play Policy</AlertTitle>
                        <AlertDescription>
                            Do not take screenshots or attempt to copy the questions. Any form of malpractice will result in immediate disqualification.
                        </AlertDescription>
                    </Alert>
                    <div className="space-y-4">
                        {problems.map((problem, index) => {
                            const submission = submissions.find(s => s.problem.title === problem.title);
                            const isAttempted = !!submission && (!!submission.code || !!submission.output);

                            return (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        {isAttempted ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-destructive" />
                                        )}
                                        <div>
                                            <p className="font-semibold text-foreground">Problem {index + 1}: {problem.title}</p>
                                            <p className="text-sm text-muted-foreground">{isAttempted ? "Attempted" : "Not Attempted"}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => onRevisit(index)} disabled={isFinishing}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Revisit
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Button size="lg" onClick={() => onFinish()} disabled={isFinishing}>
                            {isFinishing ? (
                                <Loader2 className="mr-2 animate-spin" />
                            ) : (
                                <Send className="mr-2" />
                            )}
                            {isFinishing ? 'Finalizing...' : 'Finish & Submit'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
