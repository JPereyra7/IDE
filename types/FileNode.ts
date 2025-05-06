export type Lang = 'typescript' | 'css';

interface NodeBase {
  id: string;
  name: string;
}

export interface FileLeaf extends NodeBase {
  type: 'file';
  language: Lang;
  content: string;
}

export interface DirNode extends NodeBase {
  type: 'dir';
  isOpen: boolean;
  children: FileNode[];
}

export type FileNode = FileLeaf | DirNode;
