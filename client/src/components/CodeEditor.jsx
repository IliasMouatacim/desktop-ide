import React, { useEffect, useRef, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { initialize } from 'vscode/services';
import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import getExtensionServiceOverride from '@codingame/monaco-vscode-extensions-service-override';

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
      // 1. Initialize VS Code services containing the Extension Host
      if (!isInitialized) {
        try {
          await initialize({
            ...getEditorServiceOverride(monaco.editor.IStandaloneCodeEditor),
            ...getExtensionServiceOverride({})
          });
          isInitialized = true;
          console.log('monaco-vscode-api with Extension Host initialized!');
        } catch (e) {
          console.error('MVA init error:', e);
        }
      }

      // 2. Create the standalone Monaco instance inside the wrapper
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

        // 3. Attach standard React handlers
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
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  // Sync content and language properties safely
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.getValue()) {
      editorRef.current.setValue(content || '');
    }
  }, [content]);

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
