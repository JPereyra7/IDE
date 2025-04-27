"use client";

import dynamic from "next/dynamic";
import { html } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { useCallback } from "react";
import Image from "next/image";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

interface EditorProps {
  displayName: string;
  displayImage?: string;
  language: string;
  value: string;
  onChange: (v: string) => void;
  minHeight?: string | number
}

const languageExt = {
  xml: html(),
  css: cssLang(),
  javascript: javascript(),
} as const;

export function Editor({
  displayName,
  displayImage,
  language,
  value,
  onChange,
}: EditorProps) {
  const handleChange = useCallback((val: string) => onChange(val), [onChange]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-black text-neutral-700 px-2 py-1 text-sm font-semibold rounded-t-md hover:text-neutral-100 transition-all duration-200">
        {displayImage && (
          <Image
            src={displayImage}
            alt=""
            width={16}
            height={16}
            className="inline-block mr-1"
          />
        )}
        {displayName}
      </div>

      <CodeMirror
        value={value}
        onChange={handleChange}
        extensions={[languageExt[language as keyof typeof languageExt]]}
        className="flex-1 rounded-md"
        theme="dark"
        basicSetup={{ lineNumbers: true }}
        minHeight="250px"
      />
    </div>
  );
}
