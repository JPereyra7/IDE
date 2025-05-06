'use client';

import Link from 'next/link';
import { FlipWords } from './components/ui/flip-words';

export default function Home() {
  const words = ["Coder", "Engineer", "Developer", "Creator"];

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      {/* top bar */}
      <header className="flex items-center gap-2 px-6 py-4">
        <div className="h-6 w-6 bg-gradient-to-br from-orange-400 to-cyan-600 rounded-sm" />
        <span className="font-semibold tracking-wide">ReactPen Playground</span>
      </header>

      {/* greeting & choices */}
      <section className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold">Hello, 
              <FlipWords words={words} className='text-orange-400'/>
            </h1>
          <p className="text-lg text-zinc-400">Click below to get started</p>
        </div>

        <div className="flex gap-8">
          {/* <Link
            href="/playground?type=vanilla"
            className="w-56 h-40 bg-zinc-800 rounded-xl border border-zinc-700 hover:border-orange-500
                       flex flex-col items-center justify-center gap-3 transition">
            <img src="/htmlcssjs.jpeg" alt="" className="w-18 h-18" />
            <span className="font-medium">Vanilla JavaScript</span>
          </Link> */}

          <Link
            href="/playground?type=react"
            className="w-56 h-40 bg-zinc-800 hover:bg-zinc-900 rounded-xl border border-zinc-700 hover:border-sky-300
                       flex flex-col items-center justify-center gap-3 hover:shadow-[0px_0px_49px_10px_rgba(46,213,255,1)] transition-all duration-500">
            <img src="/react.png" alt="" className="w-12 h-12" />
            <span className="font-medium">React.ts</span>
          </Link>
        </div>
      </section>

      <footer className="text-center py-4 text-xs text-zinc-500">
        Built with <span className='hover:text-slate-200 transition-all duration-300'>
          Next 
          </span> 
          &middot; 
          {' '}
          <span className='hover:text-slate-200 transition-all duration-300'>
          Tailwind CSS 
          </span>
          &middot; 
          {' '}
          <span className='hover:text-slate-200 transition-all duration-300'>
          CodeMirror 6
          </span>
      </footer>
    </main>
  );
}
