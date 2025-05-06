/* app/playground/page.tsx ------------------------------------------------*/
'use client';

import { DirNode, FileLeaf } from '@/types/FileNode';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { FileSidebar } from '../components/Filebar';   // ändra sökväg vid behov
import { Editor } from '../components/Editor';

/* ── initialt workspace: App.tsx + style.css ─────────────────────────── */
const initialTree: DirNode = {
  id: 'root',
  type: 'dir',
  name: 'src',
  isOpen: true,
  children: [
    {
      id: nanoid(),
      type: 'file',
      name: 'App.tsx',
      language: 'typescript',
      content: `export default function App() {
  return (
    <main>
      <h1 className="title">Hello React + CSS</h1>
      <p>Edit <code>style.css</code> to style me ✨</p>
    </main>
  );
}
`,
    },
    {
      id: nanoid(),
      type: 'file',
      name: 'style.css',
      language: 'css',
      content: `body {
  margin: 0;
  font-family: system-ui;
  background: #121212;
  color: #fff;
}

.title {
  font-size: 3rem;
  color: aquamarine;
}`,
    },
  ],
};

/* ── React‑IDE‑komponenten ───────────────────────────────────────────── */
export default function Playground() {
  const [tree, setTree]     = useState<DirNode>(initialTree);
  const [active, setActive] = useState<FileLeaf | null>(null);
  const [srcDoc, setSrcDoc] = useState(() => buildReactDoc(initialTree));

  /* mjuk uppdatering av preview (300 ms debounce) */
  useEffect(() => {
    const t = setTimeout(() => setSrcDoc(buildReactDoc(tree)), 300);
    return () => clearTimeout(t);
  }, [tree]);

  const updateContent = (id: string, txt: string) =>
    setTree((prev) => updateFile(prev, id, txt));

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-zinc-100">
        <div className='flex flex-row gap-1.5 mb-3.5 ml-2.5'>
              <div className="h-6 w-6 bg-gradient-to-br from-orange-400 to-cyan-600 rounded-sm" />
              <span className="font-semibold tracking-wide">ReactPen Playground</span>
        </div>

      <div className="flex flex-1 overflow-hidden">
        <FileSidebar root={tree} setRoot={setTree} onSelect={setActive} />

        {/* editor‑kolumn */}
        <div className="basis-1/2 flex flex-col p-2 overflow-hidden min-h-0">
          {active ? (
            <Editor
              language={active.language}
              displayName={active.name}
              value={active.content}
              onChange={(v) => updateContent(active.id, v)}
            />
          ) : (
            <p className="text-zinc-500 m-auto">Select or create a file…</p>
          )}
        </div>

        {/* live‑preview */}
        <iframe
          title="preview"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={srcDoc}
          className="basis-1/2 bg-zinc-950 border-l border-zinc-800"
        />
      </div>
    </div>
  );
}

/* ── bygger HTML‑dokumentet med React UMD + Babel classic runtime ────── */
function buildReactDoc(root: DirNode) {
    /* ① sortera så App sist */
    const files = root.children
      .filter((c): c is FileLeaf => c.type === 'file' && c.language === 'typescript')
      .sort((a) => (a.name === 'App.tsx' ? 1 : -1));
  
    /* ② transformera varje fil */
    const tsx = files
      .map(({ name, content }) => {
        const base = name.replace(/\.[tj]sx?$/, '');        // Korv.tsx -> Korv
        return (
          `// ---- ${name} ----\n` +
          content
            /* ta bort import‑rader */
            .replace(/import[^;]+;\n?/g, '')
            /* ersätt "export default" med global var */
            .replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
            .replace(/export\s+default\s+(\w+)/, `const ${base} = $1`)
        );
      })
      .join('\n');
  
    /* ③ samla CSS */
    const css = root.children
      .filter((c): c is FileLeaf => c.type === 'file' && c.language === 'css')
      .map((f) => f.content)
      .join('\n');
  
    /* ④ alias för hooks */
    const helpers =
      'const { useState, useEffect, useRef, useMemo, useCallback } = React;';
  
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>${css}</style>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    </head>
    <body>
      <div id="root"></div>
  
      <script type="text/babel" data-presets="typescript,react">
  /* @jsx React.createElement */
  ${helpers}
  ${tsx}
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
      <\/script>
    </body>
  </html>`;
  }
  

/* ── immutabel fil‑update ──────────────────────────────────────────── */
function updateFile(node: DirNode, id: string, txt: string): DirNode {
  return {
    ...node,
    children: node.children.map((c) => {
      if (c.id === id && c.type === 'file') return { ...c, content: txt };
      if (c.type === 'dir') return updateFile(c, id, txt);
      return c;
    }),
  };
}
