import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, ExternalLink, FileText, Pencil, Trash2 } from 'lucide-react';
import { blogApi } from '@/api/blog';
import { invalidateContent, useAllPosts } from '@/lib/queries';
import BlogForm from '@/components/dashboard/BlogForm';
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
];

export default function BlogAdmin() {
  const { data: postsData, isLoading: postsLoading } = useAllPosts();
  const posts = postsData ?? (postsLoading ? null : []);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(undefined);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = search.trim().toLowerCase();
    return posts.filter(p => {
      const passFilter = filter === 'all' || (filter === 'published' ? p.published : !p.published);
      const passSearch = !q || p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
      return passFilter && passSearch;
    });
  }, [posts, filter, search]);

  const togglePublish = async (post) => {
    setBusyId(post.id);
    const patch = !post.published && !post.published_at
      ? { ...post, published: true, published_at: new Date().toISOString() }
      : { ...post, published: !post.published };
    try {
      await blogApi.update(post.id, patch);
      invalidateContent();
    } finally { setBusyId(null); }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await blogApi.delete(confirmId);
      setConfirmId(null);
      invalidateContent();
    } finally { setDeleting(false); }
  };

  if (editing !== undefined) {
    return (
      <BlogForm initial={editing || null}
        onDone={() => { setEditing(undefined); invalidateContent(); }}
        onCancel={() => setEditing(undefined)} />
    );
  }

  return (
    <div>
      <AdminToolbar search={search} onSearch={setSearch} placeholder="ابحث بالعنوان أو المعرّف..."
        filters={FILTERS} filter={filter} onFilter={setFilter}
        actionLabel="مقال جديد" onAction={() => setEditing(null)} />

      {posts === null ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-card animate-pulse border border-border" />)}</div>
      ) : posts.length === 0 ? (
        <EmptyState icon={FileText} title="لا توجد مقالات بعد" description="اكتب مقالك الأول." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileText} title="لا نتائج مطابقة" description="جرّب تعديل البحث أو التصفية." />
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-card/60">
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3">المقال</th>
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3">الحالة</th>
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3 hidden md:table-cell">آخر تحديث</th>
                <th scope="col" className="text-start font-mono text-xs text-muted-foreground px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="border-b border-border last:border-b-0 hover:bg-card/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-body text-foreground">{post.title}</div>
                    <div className="font-mono text-xs text-muted-foreground" dir="ltr">{post.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    {post.published ? <StatusBadge type="published">منشور</StatusBadge> : <StatusBadge type="draft">مسودة</StatusBadge>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-muted-foreground">
                    {formatDate(post.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconBtn title={post.published ? 'إلغاء النشر' : 'نشر'} onClick={() => togglePublish(post)} disabled={busyId === post.id}>
                        {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </IconBtn>
                      {post.published && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                          title="عرض" aria-label="عرض المقال"
                          className="p-2 border border-border text-muted-foreground hover:border-cobalt hover:text-cobalt transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <IconBtn title="تعديل" onClick={() => setEditing(post)}>
                        <Pencil className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn title="حذف" danger onClick={() => setConfirmId(post.id)}>
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

      <ConfirmDialog open={!!confirmId} title="حذف المقال"
        message="سيتم حذف المقال نهائيًا ولا يمكن التراجع عن ذلك. هل أنت متأكد؟"
        confirmLabel="حذف نهائي" busy={deleting} onConfirm={remove} onCancel={() => setConfirmId(null)} />
    </div>
  );
}
