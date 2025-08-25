
"use client";

import { useState, useEffect, useActionState, useImperativeHandle, forwardRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Code, Play, Terminal, Loader2, Send, ListChecks, ArrowLeft } from 'lucide-react';
import { CIcon, PythonIcon } from './icons';
import { handleExecuteCode } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { type Submission } from '@/app/page';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { type Problem } from '@/lib/problems';

const initialExecuteState = {
  output: null,
  error: null,
}

export type SubmissionData = {
    problem: Problem;
    code: string;
    language: string;
    output: string | null;
};

type CodePanelProps = {
    userName: string;
    chestNumber: string;
    onSave: (submission: SubmissionData) => void;
    onSaveAndPrevious: (submission: SubmissionData) => void;
    onGoToReview: (submission: SubmissionData) => void;
    isLastProblem: boolean;
    problemIndex: number;
    initialSubmission?: Submission;
    problem: Problem;
};

export type CodePanelRef = {
  getSubmissionData: () => SubmissionData;
};

export const CodePanel = forwardRef<CodePanelRef, CodePanelProps>(
  ({ userName, chestNumber, onSave, onSaveAndPrevious, onGoToReview, isLastProblem, problemIndex, initialSubmission, problem }, ref) => {
  const [language, setLanguage] = useState(initialSubmission?.language || 'python');
  const [pythonCode, setPythonCode] = useState(initialSubmission?.language === 'python' ? (initialSubmission.code || '') : '');
  const [cCode, setCCode] = useState(initialSubmission?.language === 'c' ? (initialSubmission.code || '') : '');
  const [userInput, setUserInput] = useState('');
  
  const [executeState, executeAction, isExecuting] = useActionState(handleExecuteCode, initialExecuteState);
  const [activeTab, setActiveTab] = useState('editor');

  const placeholderCode: Record<string, string> = {
    c: `// Write your C code here\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    python: `# Write your Python code here\n\ndef hello_world():\n    print("Hello, World!")\n\nhello_world()`,
  };

  const userCode = language === 'python' ? pythonCode : cCode;
  const isFirstProblem = problemIndex === 0;
  
  useImperativeHandle(ref, () => ({
    getSubmissionData: () => ({
      problem,
      code: language === 'python' ? pythonCode : cCode,
      language,
      output: executeState.output,
    }),
  }));

  useEffect(() => {
    if(initialSubmission) {
        setLanguage(initialSubmission.language);
        if (initialSubmission.language === 'python') {
            setPythonCode(initialSubmission.code || '');
            setCCode('');
        } else {
            setCCode(initialSubmission.code || '');
            setPythonCode('');
        }
        setUserInput('');
        const formData = new FormData();
        if (initialSubmission.code) {
            formData.append('code', initialSubmission.code);
            formData.append('language', initialSubmission.language);
            executeAction(formData);
        } else {
            executeAction(new FormData()); 
        }
    } else {
        setPythonCode('');
        setCCode('');
        setLanguage('python');
        setUserInput('');
        executeAction(new FormData());
    }
    setActiveTab('editor');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemIndex, initialSubmission]);

  const handleFormAction = (formData: FormData) => {
    formData.set('code', userCode);
    executeAction(formData);
    setActiveTab('output');
  }

  const getSubmissionData = (): SubmissionData => ({
    problem,
    code: language === 'python' ? pythonCode : cCode,
    language,
    output: executeState.output,
  });

  const handleSaveClick = () => {
    onSave(getSubmissionData());
  };

  const handlePreviousClick = () => {
    onSaveAndPrevious(getSubmissionData());
  };

  const handleReviewClick = () => {
    onGoToReview(getSubmissionData());
  };

  const onCodeChange = (value: string) => {
    if (language === 'python') {
        setPythonCode(value);
    } else {
        setCCode(value);
    }
  };


  return (
    <Card className="flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
        <TabsList className="m-2">
          <TabsTrigger value="editor"><Code className="w-4 h-4 mr-2" /> Code Editor</TabsTrigger>
          <TabsTrigger value="output"><Terminal className="w-4 h-4 mr-2" /> Output</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="flex-grow flex flex-col m-0 mt-0 p-4 pt-0">
          <form action={handleFormAction} className="flex flex-col h-full gap-2">
            <div className="flex items-center justify-between">
                <Select name="language" value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c">
                        <div className="flex items-center gap-2"><CIcon className="w-4 h-4" /> C</div>
                    </SelectItem>
                    <SelectItem value="python">
                        <div className="flex items-center gap-2"><PythonIcon className="w-4 h-4" /> Python</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                    <Button type="submit" variant="secondary" disabled={isExecuting}>
                      {isExecuting ? <Loader2 className="mr-2 animate-spin" /> : <Play className="mr-2" />}
                      Run Code
                    </Button>
                     <Button variant="outline" type="button" onClick={handlePreviousClick} disabled={isFirstProblem}>
                        <ArrowLeft className="mr-2" />
                        Save & Previous
                    </Button>
                    <Button variant="default" type="button" onClick={handleSaveClick}>
                        <Send className="mr-2" />
                        {isLastProblem ? 'Save and Go to Review' : 'Save & Next'}
                    </Button>
                </div>
            </div>
            <div className='flex-grow rounded-md border overflow-hidden'>
                <CodeMirror
                    value={userCode}
                    height="100%"
                    extensions={language === 'python' ? [python()] : [cpp()]}
                    onChange={onCodeChange}
                    theme="dark"
                    style={{height: '100%'}}
                    placeholder={placeholderCode[language]}
                    basicSetup={{
                        lineNumbers: true,
                        tabSize: 4,
                        foldGutter: true,
                        autocompletion: false,
                    }}
                />
            </div>
             <div className="flex flex-col gap-2 pt-2">
              <Label htmlFor="userInput" className="flex items-center gap-2 text-sm font-medium">Standard Input (stdin)</Label>
              <Textarea
                id="userInput"
                name="userInput"
                rows={3}
                placeholder="Enter input for your code here, separated by new lines."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="font-mono"
              />
            </div>
          </form>
        </TabsContent>
        <TabsContent value="output" className="flex-grow flex flex-col m-0 mt-0 p-4 pt-0 gap-2">
          <h3 className="text-sm font-medium flex items-center gap-2"><Terminal className="w-4 h-4" /> Execution Result</h3>
            <div className="flex-grow bg-muted/50 rounded-md p-3 overflow-auto">
              {isExecuting && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> Running...</div>}
              {executeState.output && (
                  <pre className="text-sm font-mono whitespace-pre-wrap"><code>{executeState.output}</code></pre>
              )}
              {executeState.error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{executeState.error}</AlertDescription>
                </Alert>
              )}
            </div>
             <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={handleReviewClick}>
                    <ListChecks className="mr-2" />
                    Review Answers
                </Button>
                 <Button variant="outline" type="button" onClick={handlePreviousClick} disabled={isFirstProblem}>
                    <ArrowLeft className="mr-2" />
                    Save & Previous
                </Button>
                <Button variant="default" type="button" onClick={handleSaveClick}>
                    <Send className="mr-2" />
                    {isLastProblem ? 'Save and Go to Review' : 'Save & Next'}
                </Button>
            </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
});

CodePanel.displayName = "CodePanel";
