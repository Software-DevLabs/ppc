import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, FolderOpen, Pencil, Star, Trash2 } from 'lucide-react';
import { projectsApi } from '@/api/projects';
import { invalidateContent, useAllProjects } from '@/lib/queries';
import ProjectForm from '@/components/dashboard/ProjectForm';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import AdminToolbar from '@/components/dashboard/AdminToolbar';
import IconBtn from '@/components/dashboard/IconBtn';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/portfolio/EmptyState';
import { formatDate } from '@/lib/site';

const FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: 'published', label: 'منشور' },
  { id: 'draft', label: 'مسودة' },
  { id: 'featured', label: 'مميز' },
];

export default function ProjectsAdmin() {
  const { data: projectsData, isLoading: projectsLoading } = useAllProjects();
  const projects = projectsData ?? (projectsLoading ? null : []);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(undefined);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => {
    if (!projects) return [];
    const q = search.trim().toLowerCase();
    return projects.filter(p => {
      const passFilter = filter === 'all' || (filter === 'published' ? p.published : filter === 'draft' ? !p.published : p.featured);
      const passSearch = !q || p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
      return passFilter && passSearch;
    });
  }, [projects, filter, search]);

  const toggle = async (project, field) => {
    setBusyId(project.id);
    try {
      await projectsApi.update(project.id, { ...project, [field]: !project[field] });
      invalidateContent();
    } finally { setBusyId(null); }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await projectsApi.delete(confirmId);
      setConfirmId(null);
      invalidateContent();
    } finally { setDeleting(false); }
  };

  if (editing !== undefined) {
    return (
      <ProjectForm initial={editing || null}
        onDone={() => { setEditing(undefined); invalidateContent(); }}
        onCancel={() => setEditing(undefined)} />
    );
  }

  return (
    <div>
      <AdminToolbar search={search} onSearch={setSearch} placeholder="ابحث بالعنوان أو المعرّف..."
        filters={FILTERS} filter={filter} onFilter={setFilter}
        actionLabel="مشروع جديد" onAction={() => setEditing(null)} />

      {projects === null ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-card animate-pulse border border-border" />)}</div>
      ) : projects.length === 0 ? (
        <EmptyState icon={FolderOpen} title="لا توجد مشاريع بعد" description="أنشئ مشروعك الأول." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FolderOpen} title="لا نتائج مطابقة" description="جرّب تعديل البحث أو التصفية." />
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-card/60">
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3">المشروع</th>
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3">الحالة</th>
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3 hidden md:table-cell">آخر تحديث</th>
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-card/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-body text-foreground">{p.title}</div>
                    <div className="font-mono text-xs text-muted-foreground" dir="ltr">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.published ? <StatusBadge type="published">منشور</StatusBadge> : <StatusBadge type="draft">مسودة</StatusBadge>}
                      {p.featured && <StatusBadge type="featured">مميز</StatusBadge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-muted-foreground">
                    {formatDate(p.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconBtn title={p.published ? 'إلغاء النشر' : 'نشر'} onClick={() => toggle(p, 'published')} disabled={busyId === p.id}>
                        {p.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </IconBtn>
                      <IconBtn title={p.featured ? 'إزالة التمييز' : 'تمييز'} onClick={() => toggle(p, 'featured')} disabled={busyId === p.id}>
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-current text-cobalt' : ''}`} />
                      </IconBtn>
                      <IconBtn title="تعديل" onClick={() => setEditing(p)}>
                        <Pencil className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn title="حذف" danger onClick={() => setConfirmId(p.id)}>
                        <Trash2 className="w-4 h-4" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="حذف المشروع"
        message="سيتم حذف المشروع نهائيًا ولا يمكن التراجع عن ذلك. هل أنت متأكد؟"
        confirmLabel="حذف نهائي" busy={deleting} onConfirm={remove} onCancel={() => setConfirmId(null)} />
    </div>
  );
}
