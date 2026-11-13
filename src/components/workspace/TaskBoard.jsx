import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { workspaceApi } from '@/api/workspace';
import { invalidateContent, useTasks } from '@/lib/queries';

export default function TaskBoard({ onChanged }) {
  const { data: tasksData, isLoading: tasksLoading } = useTasks();
  const tasks = tasksData ?? (tasksLoading ? null : []);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = () => { invalidateContent(); onChanged?.(); };

  const logActivity = (action, detail) =>
    workspaceApi.createActivity({ source: 'workspace', action, detail }).catch(() => {});

  const add = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || busy) return;
    setBusy(true);
    try {
      await workspaceApi.createTask({ title: t, status: 'open' });
      await logActivity('إضافة مهمة', t);
      setTitle('');
      refresh();
    } finally { setBusy(false); }
  };

  const toggle = async (task) => {
    const status = task.status === 'done' ? 'open' : 'done';
    await workspaceApi.updateTask(task.id, { status });
    await logActivity(status === 'done' ? 'إنجاز مهمة' : 'إعادة فتح مهمة', task.title);
    refresh();
  };

  const remove = async (task) => {
    await workspaceApi.deleteTask(task.id);
    await logActivity('حذف مهمة', task.title);
    refresh();
  };

  return (
    <section className="border border-border bg-card p-6" aria-label="المهام">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-body text-lg text-foreground">المهام</h2>
        <span className="font-mono text-xs text-muted-foreground">
          {tasks ? `${tasks.filter(t => t.status === 'open').length} مفتوحة` : '...'}
        </span>
      </div>
      <form onSubmit={add} className="flex gap-2 mb-6">
        <input value={title} onChange={e => setTitle(e.target.value)} maxLength={240}
          placeholder="مهمة جديدة…" aria-label="عنوان المهمة الجديدة"
          className="flex-1 bg-background border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-cobalt focus:border-cobalt" />
        <button type="submit" disabled={busy || !title.trim()}
          className="inline-flex items-center gap-1.5 bg-cobalt text-gallery px-4 font-mono text-xs font-bold hover:opacity-90 disabled:opacity-50">
          <Plus className="w-4 h-4" aria-hidden="true" /> إضافة
        </button>
      </form>
      {tasks === null ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-secondary animate-pulse" />)}</div>
      ) : tasks.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4">لا توجد مهام بعد.</p>
      ) : (
        <ul className="divide-y divide-border">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center gap-3 py-3">
              <button type="button" onClick={() => toggle(task)}
                aria-label={task.status === 'done' ? 'إعادة فتح المهمة' : 'إنجاز المهمة'}
                className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${task.status === 'done' ? 'bg-cobalt border-cobalt text-gallery' : 'border-border text-transparent hover:border-cobalt'}`}>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <span className={`font-body text-sm flex-1 ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {task.title}
              </span>
              <button type="button" onClick={() => remove(task)} aria-label="حذف المهمة"
                className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
