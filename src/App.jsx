import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import PageNotFound from '@/lib/PageNotFound';

import Layout from '@/components/layout/Layout';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

import About from '@/pages/About';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Accessibility from '@/pages/Accessibility';
import Ver2 from '@/pages/Ver2';
import Ver5 from '@/pages/Ver5';
import Ver6 from '@/pages/Ver6';
import Ver7 from '@/pages/Ver7';
import Ver9 from '@/pages/Ver9';
import Ver10 from '@/pages/Ver10';
import Products from '@/pages/Products';
import MacTerm from '@/pages/MacTerm';
import MacTermV2 from '@/pages/MacTermV2';
import { prefetchPublicData, prefetchAdminData } from '@/lib/queries';

import Overview from '@/pages/dashboard/Overview';
import ProjectsAdmin from '@/pages/dashboard/ProjectsAdmin';
import BlogAdmin from '@/pages/dashboard/BlogAdmin';
import Messages from '@/pages/dashboard/Messages';
import Mail from '@/pages/dashboard/Mail';
import Workspace from '@/pages/dashboard/Workspace';
import Settings from '@/pages/dashboard/Settings';

function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();
  useEffect(() => { prefetchPublicData(); }, []);
  useEffect(() => { if (isAuthenticated) prefetchAdminData(); }, [isAuthenticated]);
  if (isLoadingAuth) return <Spinner />;

  return (
    <Routes>
      <Route path="/" element={<Ver2 />} />
      <Route element={<Layout />}>
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/accessibility" element={<Accessibility />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="blog" element={<BlogAdmin />} />
        <Route path="messages" element={<Messages />} />
        <Route path="mail" element={<Mail />} />
        <Route path="workspace" element={<Workspace />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/ver2" element={<Navigate to="/" replace />} />
      <Route path="/ver5" element={<Ver5 />} />
      <Route path="/ver6" element={<Ver6 />} />
      <Route path="/ver7" element={<Ver7 />} />
      <Route path="/ver9" element={<Ver9 />} />
      <Route path="/ver10" element={<Ver10 />} />
      <Route path="/products" element={<Products />} />
      <Route path="/macterm" element={<MacTerm />} />
      <Route path="/mactermv2" element={<MacTermV2 />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
