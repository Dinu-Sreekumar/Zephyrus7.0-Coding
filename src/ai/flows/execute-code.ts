'use server';

/**
 * @fileOverview An AI agent that executes code and returns the output.
 *
 * - executeCode - A function that handles code execution.
 * - ExecuteCodeInput - The input type for the executeCode function.
 * - ExecuteCodeOutput - The return type for the executeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExecuteCodeInputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  code: z.string().describe('The code to execute.'),
  userInput: z.string().optional().describe("The input to provide to the code's standard input (stdin)."),
});
export type ExecuteCodeInput = z.infer<typeof ExecuteCodeInputSchema>;

const ExecuteCodeOutputSchema = z.object({
  output: z.string().describe('The output of the executed code (stdout).'),
  error: z.string().optional().describe('The error output of the executed code (stderr), if any.'),
});
export type ExecuteCodeOutput = z.infer<typeof ExecuteCodeOutputSchema>;

export async function executeCode(input: ExecuteCodeInput): Promise<ExecuteCodeOutput> {
  return executeCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'executeCodePrompt',
  input: {schema: ExecuteCodeInputSchema},
  output: {schema: ExecuteCodeOutputSchema},
  prompt: `You are a non-interactive code execution terminal. Your ONLY function is to receive a block of code, an optional block of text for standard input (stdin), execute the code, and return the raw, unmodified standard output (stdout) and standard error (stderr).

**CRITICAL RULES:**
1.  **DO NOT SIMULATE A USER.** Do not act like a person running the code. Do not add any conversational text, explanations, or apologies. Your response must *only* contain what the program itself would print.
2.  **HANDLE INPUT CORRECTLY.** The user's input is provided in the 'userInput' block. You must treat this as if it was piped directly to the program's stdin.
3.  **YOUR RESPONSE IS ONLY THE PROGRAM'S OUTPUT.** The 'output' field must contain *only* the stdout from the executed code. The 'error' field must contain *only* the stderr. Do not add any other text.
4.  **FOR C/C++/PYTHON (IMPORTANT!):** When a program uses input functions (like C's \`scanf\` or Python's \`input\`), you MUST simulate the output as it would appear in a real terminal. The program prints a prompt, then the user's input appears *on the same line*, and then the program continues its output. The user's input is followed by a newline character (\\n) as if they pressed 'Enter'.

---
**Example Scenario for C/C++:**

*   **Language:** \`c\`
*   **Code:**
    \`\`\`c
    #include <stdio.h>
    int main() {
        int age;
        printf("Please enter your age: ");
        scanf("%d", &age);
        printf("\\nYou entered the age: %d\\n", age);
        return 0;
    }
    \`\`\`
*   **User Input:** \`22\`

**CORRECT RESPONSE (What you MUST do):**
\`\`\`json
{
  "output": "Please enter your age: 22\\nYou entered the age: 22\\n",
  "error": ""
}
\`\`\`
**Notice how the user input \`22\` is interleaved with the program's output, followed by a newline.**

---
**Example Scenario for Python:**

*   **Language:** \`python\`
*   **Code:**
    \`\`\`python
    name = input("Enter your name: ")
    print(f"Hello, {name}")
    \`\`\`
*   **User Input:** \`Alice\`

**CORRECT RESPONSE (What you MUST do):**
\`\`\`json
{
  "output": "Enter your name: Alice\\nHello, Alice\\n",
  "error": ""
}
\`\`\`
**Notice how Python's 'input()' function prints its prompt, the user's input appears next, and the program's final output follows, separated by a newline.**

---

**EXECUTION TASK**

*   **Language:** \`{{{language}}}\`
{{#if userInput}}
*   **User Input (stdin):** \`{{{userInput}}}\`
{{/if}}
*   **Code to Execute:**
    \`\`\`{{{language}}}
    {{{code}}}
    \`\`\`

Now, execute the code and provide only the raw stdout and stderr, following the specific formatting rules for C/C++/Python if applicable.
`,
});


const executeCodeFlow = ai.defineFlow(
  {
    name: 'executeCodeFlow',
    inputSchema: ExecuteCodeInputSchema,
    outputSchema: ExecuteCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
