import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6 text-primary">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mb-3 mt-6">{children}</h3>
    ),
    p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 bg-base-200 p-4 rounded">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-base-200 px-2 py-1 rounded text-sm">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
    ),
    ...components,
  };
}
