"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-gray-200 bg-[#F5F5F5] my-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        {language ? (
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {language}
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono text-gray-800 whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  );
}
