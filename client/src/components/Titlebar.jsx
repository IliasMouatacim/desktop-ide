import React from 'react';

/* ── SVG micro-icons (16 × 16, stroke-based) ─────────────────────── */
const Icon = ({ d, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const icons = {
  eye:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  eyeOff:   'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22M10.59 10.59a3 3 0 004.24 4.24',
  terminal: 'M4 17l6-5-6-5M12 19h8',
  play:     'M5 3l14 9-14 9V3z',
  user:     'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z',
  logOut:   'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  cloud:    'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z',
};

export default function Titlebar({
  user, onLogin, onLogout, onTogglePreview, onToggleTerminal, onRun,
  showPreview, showTerminal, projectName, onProjectNameChange
}) {
  return (
    <div className="h-11 bg-ide-sidebar flex items-center px-3 border-b border-ide-border select-none shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-5 h-5 rounded-md bg-gradient-accent flex items-center justify-center">
          <Icon d={icons.cloud} size={12} className="text-ide-panel" />
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-ide-text">
          Cloud <span className="text-ide-accent">IDE</span>
        </span>
      </div>

      {/* Menu items */}
      <div className="flex items-center gap-0.5 text-xs text-ide-textMuted">
        <MenuButton label="File" />
        <MenuButton label="Edit" />
        <MenuButton label="View" />
        <MenuButton label="Run" />
        <MenuButton label="Help" />
      </div>

      {/* Project name — centered */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-ide-bg/40 transition-colors group">
          <input
            type="text"
            value={projectName}
            onChange={e => onProjectNameChange(e.target.value)}
            className="bg-transparent text-center text-xs text-ide-textMuted hover:text-ide-text
                       focus:text-ide-text focus:outline-none max-w-[200px] font-medium"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-0.5">
        <ToolButton
          label={showPreview ? 'Hide Preview' : 'Show Preview'}
          iconPath={showPreview ? icons.eye : icons.eyeOff}
          active={showPreview}
          onClick={onTogglePreview}
        />
        <ToolButton
          label={showTerminal ? 'Hide Terminal' : 'Show Terminal'}
          iconPath={icons.terminal}
          active={showTerminal}
          onClick={onToggleTerminal}
        />
        <button
          onClick={onRun}
          className="flex items-center gap-1.5 px-3 py-1.5 ml-1.5 text-xs font-medium rounded-md
                     bg-ide-success/15 text-ide-success hover:bg-ide-success/25 transition-all
                     active:scale-95"
          title="Run code (Ctrl+Enter)"
        >
          <Icon d={icons.play} size={12} />
          <span>Run</span>
        </button>

        <div className="w-px h-5 bg-ide-border mx-2" />

        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-ide-textMuted">
              <div className="w-5 h-5 rounded-full bg-ide-accent/20 flex items-center justify-center">
                <Icon d={icons.user} size={11} className="text-ide-accent" />
              </div>
              <span className="font-medium">{user.username}</span>
            </div>
            <button onClick={onLogout}
              className="p-1.5 text-ide-textMuted hover:text-ide-error rounded-md hover:bg-ide-error/10 transition-colors"
              title="Sign out"
            >
              <Icon d={icons.logOut} size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="text-xs px-3 py-1.5 rounded-md font-medium
                       bg-ide-accent/15 text-ide-accent hover:bg-ide-accent/25 transition-all active:scale-95"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}

function MenuButton({ label }) {
  return (
    <button className="px-2.5 py-1 rounded-md text-xs font-medium hover:bg-ide-bg/40 hover:text-ide-text transition-colors">
      {label}
    </button>
  );
}

function ToolButton({ label, iconPath, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-all ${
        active
          ? 'text-ide-accent bg-ide-accent/10 shadow-[inset_0_0_0_1px_rgba(137,180,250,0.15)]'
          : 'text-ide-textMuted hover:text-ide-text hover:bg-ide-bg/40'
      }`}
      title={label}
    >
      <Icon d={iconPath} size={15} />
    </button>
  );
}
