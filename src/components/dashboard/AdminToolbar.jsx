import React from 'react';
import { Plus, Search } from 'lucide-react';

export default function AdminToolbar({
  search, onSearch, placeholder = 'بحث...',
  filters, filter, onFilter, actionLabel, onAction,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div className="relative flex-1 max-w-xs">
        <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground" aria-hidden="true" />
        <input type="search" value={search} onChange={e => onSearch(e.target.value)}
          placeholder={placeholder} aria-label="بحث"
          className="w-full bg-card border border-border pr-9 pl-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cobalt focus:border-cobalt" />
      </div>
      <div className="flex flex-wrap gap-1" role="group" aria-label="تصفية">
        {filters.map(f => (
          <button key={f.id} type="button" onClick={() => onFilter(f.id)} aria-pressed={filter === f.id}
            className={`px-3 py-1.5 font-mono text-xs border transition-colors ${filter === f.id ? 'border-cobalt text-cobalt bg-cobalt/10' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onAction}
        className="sm:mr-auto inline-flex items-center justify-center gap-2 bg-cobalt text-gallery px-4 py-2 font-mono text-xs font-bold hover:opacity-90 transition-opacity">
        <Plus className="w-3.5 h-3.5" aria-hidden="true" /> {actionLabel}
      </button>
    </div>
  );
}
