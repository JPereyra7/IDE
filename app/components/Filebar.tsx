'use client';

import { DirNode, FileLeaf, FileNode } from '@/types/FileNode';
import { nanoid } from 'nanoid';
import { JSX, useState } from 'react';

/* små SVG‑ikoner (CDN) */
const ICON_REACT =
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
const ICON_CSS =
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg';

interface Props {
  root: DirNode;
  setRoot: React.Dispatch<React.SetStateAction<DirNode>>;
  onSelect: (f: FileLeaf) => void;
}

export function FileSidebar({ root, setRoot, onSelect }: Props) {
  const [createTarget, setCreateTarget] = useState<DirNode>(root);
  const [showForm, setShowForm] = useState<'file' | 'folder' | null>(null);
  const [filename, setFilename] = useState('');

  /* ─ render tree ─────────────────────────────────────────────────── */
  const renderNode = (n: FileNode, depth = 0): JSX.Element => {
    if (n.type === 'dir')
      return (
        <div key={n.id}>
          <div
            style={{ paddingLeft: depth * 14 }}
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => toggleDir(n.id)}
            onDoubleClick={() => setCreateTarget(n)}
          >
            {n.isOpen ? '📂' : '📁'} {n.name}
          </div>
          {n.isOpen && n.children.map((c) => renderNode(c, depth + 1))}
        </div>
      );

    /* file leaf with icon */
    const iconSrc =
      n.language === 'css' ? ICON_CSS : ICON_REACT;

    return (
      <div
        key={n.id}
        style={{ paddingLeft: depth * 14 + 22 }}
        className="cursor-pointer hover:text-gray-600 transition-all duration-200 select-none flex items-center gap-1"
        onClick={() => onSelect(n)}
      >
        <img src={iconSrc} className="w-4 h-4" alt="" /> {n.name}
      </div>
    );
  };

  /* ─ helpers ─────────────────────────────────────────────────────── */
  const toggleDir = (id: string) =>
    setRoot((prev) => walkDir(prev, id, (d) => ({ ...d, isOpen: !d.isOpen })));

  const addChild = (child: FileNode) =>
    setRoot((prev) =>
      walkDir(prev, createTarget.id, (d) => ({ ...d, children: [...d.children, child] }))
    );

  const getLang = (name: string): FileLeaf['language'] =>
    name.endsWith('.css') ? 'css' : 'typescript';

  const handleCreate = () => {
    if (!filename.trim()) return;

    if (showForm === 'file') {
      const file: FileLeaf = {
        id: nanoid(),
        type: 'file',
        name: filename,
        language: getLang(filename),
        content: '',
      };
      addChild(file);
    } else {
      const dir: DirNode = {
        id: nanoid(),
        type: 'dir',
        name: filename,
        isOpen: true,
        children: [],
      };
      addChild(dir);
    }
    setFilename('');
    setShowForm(null);
  };

  /* ─ UI ──────────────────────────────────────────────────────────── */
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 text-sm flex flex-col">
      {/* toolbar */}
      <div className="px-2 py-1 border-b border-zinc-800 flex items-center gap-2">
        <button
          className="px-2 py-0.5 bg-zinc-800 rounded hover:bg-zinc-700"
          onClick={() => { setShowForm('file'); setFilename(''); }}
        >
          + File
        </button>
        <button
          className="px-2 py-0.5 bg-zinc-800 rounded hover:bg-zinc-700"
          onClick={() => { setShowForm('folder'); setFilename(''); }}
        >
          + Folder
        </button>
        <span className="ml-auto text-zinc-500 truncate max-w-[7rem]">
          {createTarget.name}
        </span>
      </div>

      {/* tree */}
      <div className="flex-1 overflow-y-auto p-2">{renderNode(root)}</div>

      {/* create form */}
      {showForm && (
        <div className="border-t border-zinc-800 p-2 space-x-1">
          <input
            autoFocus
            placeholder={showForm === 'file' ? 'new-file.tsx' : 'new-folder'}
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-zinc-800 px-2 py-0.5 w-40 rounded outline-none"
          />
          <button onClick={handleCreate} className="px-2 py-0.5 bg-sky-600 rounded">
            OK
          </button>
          <button onClick={() => setShowForm(null)} className="text-zinc-400">
            ✕
          </button>
        </div>
      )}
    </aside>
  );
}

/* ─ walkDir – immutabel dir‑mutation ────────────────────────────────── */
function walkDir(node: DirNode, id: string, fn: (d: DirNode) => DirNode): DirNode {
  if (node.id === id) return fn(node);
  return {
    ...node,
    children: node.children.map((c) =>
      c.type === 'dir' ? walkDir(c, id, fn) : c
    ),
  };
}
