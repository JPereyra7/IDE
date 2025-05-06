'use client';

import dynamic from 'next/dynamic';
import { javascript } from '@codemirror/lang-javascript';
import { css as cssLang } from '@codemirror/lang-css';
import { useCallback } from 'react';


const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

const extensions = {
  typescript: javascript({ jsx: true, typescript: true }),
  css: cssLang(),
} as const;

interface Props {
  language: keyof typeof extensions;
  displayName: string;
  value: string;
  onChange: (v: string) => void;
}

export function Editor({ language, displayName, value, onChange }: Props) {
  const handle = useCallback((val: string) => onChange(val), [onChange]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-black text-neutral-300 px-2 py-1 text-sm rounded-t-md">
        {displayName}
      </div>

      <CodeMirror
        height="100%"
        value={value}
        onChange={handle}
        extensions={[extensions[language]]}
        theme="dark"
        className="flex-1 rounded-b-md"
        basicSetup={{ lineNumbers: true }}
      />
    </div>
  );
}
