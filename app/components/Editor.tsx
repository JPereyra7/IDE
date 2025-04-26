"use client";

import { Controlled as ControlledEditor } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import Image from "next/image";

interface EditorProps {
  displayName: string;
  displayImage?: string;
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export function Editor({
  displayName,
  language,
  value,
  onChange,
  displayImage,
}: EditorProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-black text-neutral-700 hover:text-neutral-100 hover:transition-all duration-200 px-2 py-1 text-sm font-semibold rounded-t-md">
        {displayImage && (
          <Image
            width={16}
            height={16}
            src={displayImage}
            alt="displayImage"
            className="w-6 h-6 inline-block mr-1"
          ></Image>
        )}
        {displayName}
      </div>

      <ControlledEditor
        value={value}
        onBeforeChange={(_editor, _data, val) => onChange(val)}
        className="flex-1 rounded-md"
        options={{
          mode: language,
          theme: "ayu-dark",
          lineNumbers: true,
          lineWrapping: true,
        }}
      />
    </div>
  );
}
