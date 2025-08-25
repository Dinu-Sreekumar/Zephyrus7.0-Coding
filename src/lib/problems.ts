
export type Problem = {
  title: string;
  description: string;
};

export const problems: Problem[] = [
  {
    title: 'Variable Declaration and Initialization',
    description: 'Write a program that declares a variable to store an integer, a variable to store a floating-point number, and a variable to store a character. Initialize each variable and then print their values to the console.',
  },
  {
    title: 'Even or Odd Number Check',
    description: 'Write a program that asks the user to input a number. Use an if-else statement to check if the number is even or odd, and then print the result to the console.',
  },
  {
    title: 'Print Numbers with a For Loop',
    description: 'Write a program that uses a for loop to print the numbers from 1 to 10. Each number should be on a new line.',
  },
  {
    title: 'Iterate and Print an Array',
    description: 'Write a program that initializes an array (or list) with the numbers 1, 2, 3, 4, and 5. Then, use a loop to iterate through the array and print each element to the console.',
  },
  {
    title: 'Function to Add Two Integers',
    description: 'Write a function that takes two integer arguments, adds them together, and returns the sum. In the main part of your program, call this function with two numbers and print the returned result.',
  },
];
