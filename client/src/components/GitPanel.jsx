import React, { useState, useMemo } from 'react';

const Ico = ({ d, size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

export default function GitPanel({ files, onClose }) {
  const [commitMsg, setCommitMsg] = useState('');
  const [branch, setBranch] = useState('main');
  const [showBranches, setShowBranches] = useState(false);
  const [log, setLog] = useState([
    { hash: 'a1b2c3d', message: 'Initial commit', date: '2 hours ago', author: 'you' },
  ]);

  const branches = ['main', 'develop', 'feature/editor', 'feature/terminal'];

  const changedFiles = useMemo(() => {
    return Object.keys(files).map(path => ({
      path,
      status: 'M',
    }));
  }, [files]);

  const handleCommit = () => {
    if (!commitMsg.trim()) return;
    const hash = Math.random().toString(36).substring(2, 9);
    setLog(prev => [{
      hash,
      message: commitMsg,
      date: 'just now',
      author: 'you',
    }, ...prev]);
    setCommitMsg('');
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-ide-sidebar border-l border-ide-border
                    flex flex-col z-30 shadow-float animate-slideIn">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-ide-border">
        <div className="flex items-center gap-2">
          <Ico d="M18 18a3 3 0 100-6 3 3 0 006 0zM6 6a3 3 0 100 6 3 3 0 000-6zM13 6h3a2 2 0 012 2v7M6 9v12" size={15} className="text-ide-accent" />
          <span className="text-[11px] font-semibold text-ide-text uppercase tracking-widest">Source Control</span>
        </div>
        <button onClick={onClose}
          className="p-1 text-ide-textMuted hover:text-ide-error rounded-md hover:bg-ide-error/10 transition-colors">
          <Ico d="M18 6L6 18M6 6l12 12" size={13} />
        </button>
      </div>

      {/* Branch selector */}
      <div className="px-3 py-2 border-b border-ide-border">
        <div className="relative">
          <button
            onClick={() => setShowBranches(!showBranches)}
            className="flex items-center gap-1.5 text-xs text-ide-accent hover:text-ide-accentHover transition-colors"
          >
            <Ico d="M6 3v12M18 9a3 3 0 100 6 3 3 0 000-6zM6 21a3 3 0 100-6 3 3 0 000 6z" size={13} />
            <span className="font-medium">{branch}</span>
            <Ico d="M6 9l6 6 6-6" size={11} />
          </button>

          {showBranches && (
            <div className="absolute top-7 left-0 bg-ide-panel border border-ide-border rounded-lg shadow-float z-10 min-w-[160px] overflow-hidden">
              {branches.map(b => (
                <button
                  key={b}
                  onClick={() => { setBranch(b); setShowBranches(false); }}
                  className={`w-full flex items-center gap-2 text-xs px-3 py-2 hover:bg-ide-bg/50 transition-colors
                    ${b === branch ? 'text-ide-accent' : 'text-ide-text'}`}
                >
                  {b === branch && <Ico d="M20 6L9 17l-5-5" size={12} />}
                  <span className={b !== branch ? 'ml-[20px]' : ''}>{b}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Changes */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="text-[11px] font-semibold text-ide-textMuted uppercase tracking-widest mb-2">
            Changes ({changedFiles.length})
          </div>
          <div className="space-y-0.5">
            {changedFiles.map(f => (
              <div key={f.path} className="flex items-center gap-1.5 text-xs py-1 px-2 rounded-md hover:bg-ide-bg/40 transition-colors">
                <span className={`font-mono text-[10px] w-3 font-bold ${
                  f.status === 'M' ? 'text-ide-warning' :
                  f.status === 'A' ? 'text-ide-success' :
                  f.status === 'D' ? 'text-ide-error' : 'text-ide-textMuted'
                }`}>
                  {f.status}
                </span>
                <span className="text-ide-text truncate">{f.path}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commit section */}
        <div className="px-3 py-2 border-t border-ide-border">
          <textarea
            value={commitMsg}
            onChange={e => setCommitMsg(e.target.value)}
            placeholder="Commit message..."
            className="w-full px-2.5 py-2 bg-ide-bg border border-ide-border rounded-md text-xs
                       text-ide-text placeholder-ide-textSubtle resize-none h-16
                       focus:outline-none focus:border-ide-accent transition-colors"
          />
          <button
            onClick={handleCommit}
            disabled={!commitMsg.trim()}
            className="w-full mt-2 py-2 bg-ide-accent text-ide-bg text-xs font-semibold rounded-md
                       hover:bg-ide-accentHover transition-all disabled:opacity-30 active:scale-[0.98]
                       flex items-center justify-center gap-1.5"
          >
            <Ico d="M20 6L9 17l-5-5" size={13} />
            Commit
          </button>
          <div className="flex gap-1.5 mt-2">
            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-ide-textMuted
                               border border-ide-border rounded-md hover:bg-ide-bg/50 hover:text-ide-text transition-colors">
              <Ico d="M12 19V5M5 12l7-7 7 7" size={11} /> Push
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-ide-textMuted
                               border border-ide-border rounded-md hover:bg-ide-bg/50 hover:text-ide-text transition-colors">
              <Ico d="M12 5v14M19 12l-7 7-7-7" size={11} /> Pull
            </button>
          </div>
        </div>

        {/* Commit log */}
        <div className="px-3 py-2 border-t border-ide-border">
          <div className="text-[11px] font-semibold text-ide-textMuted uppercase tracking-widest mb-2">Commit Log</div>
          <div className="space-y-2">
            {log.map((entry) => (
              <div key={entry.hash} className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-ide-accent text-[10px] bg-ide-accent/10 px-1 rounded">{entry.hash}</span>
                  <span className="text-ide-textSubtle text-[10px]">{entry.date}</span>
                </div>
                <div className="text-ide-text truncate mt-0.5">{entry.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
