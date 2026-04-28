"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, Users, Building2, Layers, LogOut } from 'lucide-react';
import { Sidebar, SidebarNavItems } from '@/components/sidebar/Sidebar';
import { getCurrentSuperAdmin } from '@/services/superadmin.service';
import { Admin } from '@/types/common/api.types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { isAdminToken, clearAuthTokens } from '@/lib/auth-utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { showSuccess } from '@/ui/toast';
import { SuperAdminUser } from '@/types/superadmin/index.types';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<SuperAdminUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const loadUser = async () => {
      if (pathname === '/superadmin/login') return;

      // Check if we have an admin token before making any API calls
      if (!isAdminToken()) {
        clearAuthTokens(); // Clear any invalid tokens (like student tokens)
        window.location.href = '/superadmin/login';
        return;
      }

      try {
        const userData = await getCurrentSuperAdmin();
        setUser(userData);
      } catch (err) {
        // Error is handled by API client interceptor
        console.error('Failed to load superadmin user:', err);
        window.location.href = '/superadmin/login';
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [pathname]);

  const handleLogout = (showToast = true) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    if (showToast) {
      showSuccess('Logged out successfully.');
    }
    window.location.href = '/superadmin/login';
  };

  const navItems = [
    { label: 'Dashboard', href: '/superadmin', icon: LayoutDashboard },
    { label: 'Admins', href: '/superadmin/admins', icon: Users, showDivider: true, dividerLabel: 'Management' },
    { label: 'Cities', href: '/superadmin/cities', icon: Building2 },
    { label: 'Batches', href: '/superadmin/batches', icon: Layers },
  ];

  if (pathname === '/superadmin/login') {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <BruteForceLoader size="md" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden absolute top-5 left-5 z-50 p-2 items-center rounded-md bg-card border border-border hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[85%] sm:w-[80%] max-w-[320px]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="h-full glass border-r border-border/20 backdrop-blur-md">
          {/* Mobile Menu Header */}
          <div className="p-4 border-b border-border/20 flex items-center justify-between">
            <h1 className="font-serif text-2xl font-bold text-logo tracking-tight">
              <span className="text-2xl font-bold leading-[1.05] tracking-tight">
                <span className="text-foreground">Brute</span>
                <span className="text-(--accent-primary)">Force</span>
              </span>
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 transition-colors
                    ${isActive
                      ? 'bg-(--accent-primary)/10 text-(--accent-primary) border-l-4 border-(--accent-primary)'
                      : 'text-muted-foreground hover:text-foreground hover:bg-[rgba(204,255,0,0.05)]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu User Section */}
          <div className="border-t border-border/20 p-4">
            <button
              onClick={() => handleLogout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[rgba(204,255,0,0.05)] transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center font-bold text-sm uppercase">
                {user.name?.charAt(0) || "A"}
              </div>
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-foreground">
                  {user.name || "Admin"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Logout Session
                </div>
              </div>
              <LogOut className="w-5 h-5 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block">
        <Sidebar
          role="superadmin"
          isOpen={true}
          onClose={() => {}}
          user={user}
          navItems={navItems}
          onLogout={() => handleLogout()}
          portalLabel="SuperAdmin Portal"
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-20 min-w-0 ps-2 mt-3 ">

        {/* Topbar */}
        <header className="h-14 glass rounded-2xl border border-border/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30 w-full">
          <div className=" ms-8 lg:ms-0 flex items-center gap-3">
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle/>
            {mounted && (
              <div className="ml-3 hidden sm:block">
                <img
                  src={
                    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
                      ? '/pwioi_dark.jpg'
                      : '/pwioi_light.png'
                  }
                  alt="PWIO Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Page Wrapper */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-8 sm:p-8 relative">
          <div className="max-w-[1200px]  mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
