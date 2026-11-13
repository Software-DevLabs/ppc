import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects';
import { blogApi } from '@/api/blog';
import { contactApi } from '@/api/contact';
import { mailApi } from '@/api/mail';
import { workspaceApi } from '@/api/workspace';
import { queryClientInstance } from '@/lib/query-client';

const byFeatured = (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
const byNewest = (a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at);

async function fetchPublishedProjects() {
  const list = await projectsApi.getAll({ published: true });
  return [...list].sort(byFeatured);
}

async function fetchPublishedPosts() {
  const list = await blogApi.getAll({ published: true });
  return [...list].sort(byNewest);
}

// Fresh enough to feel instant, short enough to stay in sync.
const SYNC_OPTS = { staleTime: 60_000, gcTime: 10 * 60_000, retry: 1 };

export function usePublishedProjects() {
  return useQuery({
    queryKey: ['projects', 'published'],
    queryFn: fetchPublishedProjects,
    ...SYNC_OPTS,
  });
}

export function usePublishedPosts(limit) {
  return useQuery({
    queryKey: ['posts', 'published'],
    queryFn: fetchPublishedPosts,
    select: (list) => (limit ? list.slice(0, limit) : list),
    ...SYNC_OPTS,
  });
}

export function useProject(slug) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsApi.getBySlug(slug),
    enabled: Boolean(slug),
    ...SYNC_OPTS,
  });
}

export function usePost(slug) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogApi.getBySlug(slug),
    enabled: Boolean(slug),
    ...SYNC_OPTS,
  });
}

// ---- dashboard (admin) ----
export function useAllProjects() {
  return useQuery({ queryKey: ['projects', 'all'], queryFn: () => projectsApi.getAll(), ...SYNC_OPTS });
}

export function useAllPosts() {
  return useQuery({ queryKey: ['posts', 'all'], queryFn: () => blogApi.getAll(), ...SYNC_OPTS });
}

export function useTasks() {
  return useQuery({ queryKey: ['tasks'], queryFn: () => workspaceApi.getTasks(), ...SYNC_OPTS });
}

export function useActivities() {
  return useQuery({ queryKey: ['activities'], queryFn: () => workspaceApi.getActivities(), ...SYNC_OPTS });
}

export function useContactMessages() {
  return useQuery({ queryKey: ['contact', 'messages'], queryFn: () => contactApi.getAll(), ...SYNC_OPTS });
}

export function useMailThreads() {
  return useQuery({ queryKey: ['mail', 'threads'], queryFn: () => mailApi.threads(false), ...SYNC_OPTS });
}

export function useMailThread(id) {
  return useQuery({
    queryKey: ['mail', 'thread', id],
    queryFn: () => mailApi.thread(id),
    enabled: id !== null && id !== undefined,
    ...SYNC_OPTS,
  });
}

// Warm the cache at boot so first paint already has data.
export function prefetchPublicData() {
  prefetchPublicData.done ??= Promise.allSettled([
    queryClientInstance.prefetchQuery({
      queryKey: ['projects', 'published'],
      queryFn: fetchPublishedProjects,
      ...SYNC_OPTS,
    }),
    queryClientInstance.prefetchQuery({
      queryKey: ['posts', 'published'],
      queryFn: fetchPublishedPosts,
      ...SYNC_OPTS,
    }),
  ]);
  return prefetchPublicData.done;
}

// Warm admin data after login — never for visitors (these 401 otherwise).
export function prefetchAdminData() {
  prefetchAdminData.done ??= Promise.allSettled([
    queryClientInstance.prefetchQuery({ queryKey: ['projects', 'all'], queryFn: () => projectsApi.getAll(), ...SYNC_OPTS }),
    queryClientInstance.prefetchQuery({ queryKey: ['posts', 'all'], queryFn: () => blogApi.getAll(), ...SYNC_OPTS }),
    queryClientInstance.prefetchQuery({ queryKey: ['tasks'], queryFn: () => workspaceApi.getTasks(), ...SYNC_OPTS }),
    queryClientInstance.prefetchQuery({ queryKey: ['activities'], queryFn: () => workspaceApi.getActivities(), ...SYNC_OPTS }),
    queryClientInstance.prefetchQuery({ queryKey: ['contact', 'messages'], queryFn: () => contactApi.getAll(), ...SYNC_OPTS }),
    queryClientInstance.prefetchQuery({ queryKey: ['mail', 'threads'], queryFn: () => mailApi.threads(false), ...SYNC_OPTS }),
  ]);
  return prefetchAdminData.done;
}

// Call after any dashboard create/update/delete so every page re-syncs.
export function invalidateContent() {
  return Promise.all([
    queryClientInstance.invalidateQueries({ queryKey: ['projects'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['posts'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['project'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['post'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['contact'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['mail'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['tasks'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['activities'] }),
  ]);
}
