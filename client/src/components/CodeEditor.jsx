import React, { useEffect, useRef, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { initialize } from 'vscode/services';
import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';

const LANGUAGE_MAP = {
  js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  py: 'python', rb: 'ruby', java: 'java', cpp: 'cpp', c: 'c', cs: 'csharp',
  go: 'go', rs: 'rust', php: 'php', html: 'html', htm: 'html', css: 'css',
  scss: 'scss', less: 'less', json: 'json', md: 'markdown', yml: 'yaml',
  yaml: 'yaml', xml: 'xml', sql: 'sql', sh: 'shell', bash: 'shell',
  toml: 'ini', env: 'ini', txt: 'plaintext'
};

function getLanguage(filePath) {
  const ext = filePath?.split('.').pop().toLowerCase() || '';
  return LANGUAGE_MAP[ext] || 'plaintext';
}

let isInitialized = false;

export default function CodeEditor({ file, content, onChange, onSave, onCursorChange }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    async function setupMonaco() {
      // 1. Initialize VS Code services once
      if (!isInitialized) {
        try {
          await initialize({
            ...getEditorServiceOverride(monaco.editor.IStandaloneCodeEditor)
          });
          isInitialized = true;
          console.log('monaco-vscode-api initialized!');
        } catch (e) {
          console.error('MVA init error:', e);
        }
      }

      // 2. Create the editor instance
      if (containerRef.current && !editorRef.current) {
        const editor = monaco.editor.create(containerRef.current, {
          value: content || '',
          language: getLanguage(file),
          theme: 'vs-dark',
          automaticLayout: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 14,
          tabSize: 2,
          minimap: { enabled: true }
        });

        // 3. Attach event listeners
        editor.onDidChangeModelContent(() => {
          onChange?.(editor.getValue());
        });

        editor.onDidChangeCursorPosition((e) => {
          onCursorChange?.({ line: e.position.lineNumber, col: e.position.column });
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          onSave?.();
        });

        editorRef.current = editor;
      }
    }

    setupMonaco();

    return () => {
      // Clean up the editor on unmount
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  // Sync content updates from parent
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.getValue()) {
      editorRef.current.setValue(content || '');
    }
  }, [content]);

  // Sync file language updates
  useEffect(() => {
    if (editorRef.current && file) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, getLanguage(file));
      }
    }
  }, [file]);

  return <div ref={containerRef} className="w-full h-full" />;
}
