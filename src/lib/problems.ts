
export type Problem = {
  title: string;
  description: string;
};

export const problems: Problem[] = [
  {
    title: 'Towers of Hanoi',
    description: 'Write a program that solves the Towers of Hanoi puzzle for N disks. The goal is to move N disks from a source peg to a destination peg, using an auxiliary peg, following the rules of the puzzle.',
  },
  {
    title: 'Largest Rectangle in Histogram',
    description: 'You are given an array representing bar heights of a histogram.Find the largest rectangular area that can be formed.\nExample:\nInput: 6 2 5 4 5 1 6\nOutput: 12',
  },
  {
    title: "Pascal's Triangle",
    description: "Write a program that generates and prints Pascal's triangle up to a specified number of rows. The program should take the number of rows as input and then print the triangle to the console.",
  },
  {
    title: 'Matrix Spiral Traversal',
    description: 'Write a program to print the elements of an N x M matrix in spiral order.\nExample:\nInput:\n1 2 3\n4 5 6\n7 8 9\nOutput:\n1 2 3 6 9 8 7 4 5',
  },
  {
    title: 'N-Queens Problem',
    description: 'Write a program that solves the N-Queens problem on an N x N chessboard. The goal is to place N non-attacking queens on the board.',
  },
];
