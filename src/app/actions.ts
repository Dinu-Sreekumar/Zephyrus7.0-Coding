
"use server";

import { z } from "zod";
import { executeCode, type ExecuteCodeOutput } from "@/ai/flows/execute-code";

const ExecuteCodeOutputSchema = z.object({
  output: z.string().describe('The output of the executed code (stdout).'),
  error: z.string().optional().describe('The error output of the executed code (stderr), if any.'),
});

const ExecuteCodeState = ExecuteCodeOutputSchema.extend({
  error: z.string().nullable(),
  output: z.string().nullable(),
});

const ExecuteCodeFormSchema = z.object({
  language: z.enum(["c", "python"]),
  code: z.string().min(1, { message: "Code must not be empty." }),
  userInput: z.string().optional(),
});

export async function handleExecuteCode(
  prevState: z.infer<typeof ExecuteCodeState>,
  formData: FormData
): Promise<z.infer<typeof ExecuteCodeState>> {
  const validatedFields = ExecuteCodeFormSchema.safeParse({
    language: formData.get("language"),
    code: formData.get("code"),
    userInput: formData.get("userInput"),
  });

  if (!validatedFields.success) {
    return {
      output: null,
      error: validatedFields.error.flatten().fieldErrors.code?.[0] || 'Invalid input.',
    };
  }

  try {
    const result: ExecuteCodeOutput = await executeCode({
      language: validatedFields.data.language,
      code: validatedFields.data.code,
      userInput: validatedFields.data.userInput,
    });
    
    return { ...result, error: result.error || null, output: result.output || null };

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { output: null, error: `An unexpected error occurred: ${errorMessage}` };
  }
}
