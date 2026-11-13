import React, { useState } from 'react';
import { CheckCircle2, FileText, FolderGit2, ListTodo } from 'lucide-react';
import { useAllPosts, useAllProjects, useTasks } from '@/lib/queries';
import TaskBoard from '@/components/workspace/TaskBoard';
import ActivityFeed from '@/components/workspace/ActivityFeed';
import GoogleServices from '@/components/workspace/GoogleServices';
import StatCard from '@/components/workspace/StatCard';

export default function Workspace() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: tasks } = useTasks();
  const { data: projects } = useAllProjects();
  const { data: posts } = useAllPosts();

  const stats = tasks && projects && posts ? {
    openTasks: tasks.filter(t => t.status === 'open').length,
    doneTasks: tasks.filter(t => t.status === 'done').length,
    projects: projects.length,
    posts: posts.length,
  } : null;

  const onChanged = () => setRefreshKey(k => k + 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-body text-2xl font-light text-foreground">مساحة العمل</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1.5">مهامك ونشاطك — في مكان واحد</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard Icon={ListTodo} label="مهام مفتوحة" value={stats ? stats.openTasks : '…'} accent />
        <StatCard Icon={CheckCircle2} label="مهام منجزة" value={stats ? stats.doneTasks : '…'} />
        <StatCard Icon={FolderGit2} label="المشاريع" value={stats ? stats.projects : '…'} />
        <StatCard Icon={FileText} label="المقالات" value={stats ? stats.posts : '…'} />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TaskBoard onChanged={onChanged} />
        </div>
        <ActivityFeed refreshKey={refreshKey} />
      </div>
      <GoogleServices />
    </div>
  );
}
