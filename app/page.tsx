"use client";

import { useState } from "react";
import { Editor } from "./components/Editor";

export default function Home() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  const srcDoc = `
    <html>
      <head>
        <style>
          html,body{height:100%;margin:0}
          body{
            font-family:system-ui,sans-serif;
            color:#fff;
            margin: 20px;
          }
        </style>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `;
  return (
    <div className="h-screen flex flex-col">
      <div className="top-pane flex gap-1 p-4">
        <Editor
          language="xml"
          displayName="index.html"
          value={html}
          onChange={setHtml}
          displayImage="https://img.icons8.com/?size=100&id=EAUyKy3IwmqM&format=png&color=000000"
        />
        <Editor
          language="css"
          displayName="style.css"
          value={css}
          onChange={setCss}
          displayImage="https://img.icons8.com/?size=100&id=7gdY5qNXaKC0&format=png&color=000000"
        />
        <Editor
          language="javascript"
          displayName="script.js"
          displayImage="https://img.icons8.com/?size=100&id=108784&format=png&color=000000"
          value={js}
          onChange={setJs}
        />
      </div>
      <div className="pane flex-1">
        <iframe
          title="output"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          className="w-full h-full rounded-md px-2 py-1"
          frameBorder={0}
        />
      </div>
    </div>
  );
}
