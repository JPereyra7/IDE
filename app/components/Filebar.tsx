'use client';

import { DirNode, FileLeaf, FileNode } from '@/types/FileNode';
import { nanoid } from 'nanoid';
import { useState, useRef, useEffect, JSX } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  /* focus input när man börjar rename */
  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  /* ────────────────────────── render tree ────────────────────────── */
  const renderNode = (n: FileNode, depth = 0): JSX.Element => {
    const padding = { paddingLeft: depth * 14 };

    /* editing state */
    if (n.id === editingId) {
      return (
        <div key={n.id} style={padding} className="flex items-center">
          <input
            ref={editInputRef}
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename(n.id);
              if (e.key === 'Escape') cancelRename();
            }}
            onBlur={() => commitRename(n.id)}
            className="w-full bg-zinc-800 px-1 py-0.5 text-sm rounded outline-none"
          />
        </div>
      );
    }

    /* directory */
    if (n.type === 'dir') {
      return (
        <div key={n.id}>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                style={padding}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-400"
                onClick={() => toggleDir(n.id)}
                onDoubleClick={() => setCreateTarget(n)}
              >
                {n.isOpen ? '📂' : '📁'} {n.name}
              </div>
            </ContextMenuTrigger>

            <DarkMenu onRename={() => startRename(n)} onDelete={() => deleteNode(n.id)} />
          </ContextMenu>

          {n.isOpen && n.children.map((c) => renderNode(c, depth + 1))}
        </div>
      );
    }

    /* file leaf */
    const iconSrc = n.language === 'css' ? ICON_CSS : ICON_REACT;
    return (
      <ContextMenu key={n.id}>
        <ContextMenuTrigger asChild>
          <div
            style={{ ...padding, paddingLeft: depth * 14 + 22 }}
            className="cursor-pointer hover:text-gray-400 flex items-center gap-1 select-none"
            onClick={() => onSelect(n)}
          >
            <img src={iconSrc} className="w-4 h-4" alt="" /> {n.name}
          </div>
        </ContextMenuTrigger>

        <DarkMenu onRename={() => startRename(n)} onDelete={() => deleteNode(n.id)} />
      </ContextMenu>
    );
  };

  /* ────────────────────────── context menu ───────────────────────── */
  const DarkMenu = ({
    onRename,
    onDelete,
  }: {
    onRename: () => void;
    onDelete: () => void;
  }) => (
    <ContextMenuContent
      className="w-36 rounded-md border border-zinc-700 bg-zinc-800 p-1 text-zinc-100 shadow-lg"
    >
      <ContextMenuItem onClick={onRename} className="px-2 py-1.5 text-sm hover:bg-zinc-700 rounded">
        Rename
      </ContextMenuItem>
      <ContextMenuSeparator className="-mx-1 my-1 h-px bg-zinc-700" />
      <ContextMenuItem
        onClick={onDelete}
        className="px-2 py-1.5 text-sm text-red-400 hover:bg-red-900/40 rounded"
      >
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );

  /* ────────────────────────── actions ────────────────────────────── */
  const startRename = (node: FileNode) => {
    setEditingId(node.id);
    setEditingName(node.name);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  const commitRename = (id: string) => {
    if (!editingId) return;
    const newName = editingName.trim();
    if (newName && newName !== editingName) {
      setRoot((prev) => walkDir(prev, id, (d) => ({ ...d, name: newName })));
    }
    cancelRename();
  };

  const toggleDir = (id: string) =>
    setRoot((prev) => walkDir(prev, id, (d) => ({ ...d, isOpen: !d.isOpen })));

  const deleteNode = (id: string) => setRoot((prev) => removeNode(prev, id));

  const getLang = (name: string): FileLeaf['language'] =>
    name.endsWith('.css') ? 'css' : 'typescript';

  const addChild = (child: FileNode) =>
    setRoot((prev) =>
      walkDir(prev, createTarget.id, (d) => ({ ...d, children: [...d.children, child] }))
    );

  const handleCreate = () => {
    if (!filename.trim()) return;
    if (showForm === 'file') {
      addChild({
        id: nanoid(),
        type: 'file',
        name: filename,
        language: getLang(filename),
        content: '',
      } as FileLeaf);
    } else {
      addChild({
        id: nanoid(),
        type: 'dir',
        name: filename,
        isOpen: true,
        children: [],
      } as DirNode);
    }
    setFilename('');
    setShowForm(null);
  };

  /* ────────────────────────── UI shell ───────────────────────────── */
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
      </div>

      {/* file tree */}
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

/* ────────────────────────── tree utils ────────────────────────────── */
function walkDir(node: DirNode, id: string, fn: (d: DirNode) => DirNode): DirNode {
  if (node.id === id) return fn(node);
  return { ...node, children: node.children.map((c) => (c.type === 'dir' ? walkDir(c, id, fn) : c)) };
}

function removeNode(node: DirNode, id: string): DirNode {
  return {
    ...node,
    children: node.children
      .filter((c) => c.id !== id)
      .map((c) => (c.type === 'dir' ? removeNode(c, id) : c)),
  };
}
