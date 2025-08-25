import type { SVGProps } from 'react';

export function CIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.5 16C7.36 16 4 12.64 4 8.5S7.36 1 11.5 1s7.5 3.36 7.5 7.5" />
      <path d="M11.5 23C7.36 23 4 19.64 4 15.5S7.36 8 11.5 8s7.5 3.36 7.5 7.5" />
    </svg>
  );
}

export function PythonIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M13.86 6.14a4 4 0 0 1-5.72 5.72" />
            <path d="M10.14 17.86a4 4 0 0 1 5.72-5.72" />
            <path d="M14.5 7.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" fill="currentColor" />
            <path d="M9.5 16.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" fill="currentColor" />
            <path d="M6 13.5a3.5 3.5 0 1 1-3.5-3.5H4v-1A5.5 5.5 0 0 1 9.5 3h1a5.5 5.5 0 0 1 5.5 5.5v1h1.5a3.5 3.5 0 1 1 0 7H18v1a5.5 5.5 0 0 1-5.5 5.5h-1a5.5 5.5 0 0 1-5.5-5.5v-1H2.5A3.5 3.5 0 0 1 6 13.5z"/>
        </svg>
    );
}
