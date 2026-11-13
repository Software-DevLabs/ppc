export const SITE_NAME = 'Software Dev Labs';
export const CONTACT_EMAIL = 'software.dev.labs1@gmail.com';
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'rare69963@gmail.com';
// Client-side convenience only — real enforcement is server-side
// (api/middleware/auth.js checks the session email against ADMIN_EMAILS).
export const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || 'rare69963@gmail.com'
).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
export const isAdmin = (email) => ADMIN_EMAILS.includes((email || '').trim().toLowerCase());
export const LOGO_URL = 'https://media.base44.com/images/public/6ab126d9bbebf6cd2efd3c0c/902fd50d6_logo.png';

export const SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Next.js',
  'FastAPI', 'Django', 'TanStack', 'HTML', 'CSS',
  'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Neon',
  'AI Agents', 'Photoshop', 'Figma',
];

export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('ar', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
