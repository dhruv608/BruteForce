/**
 * Layout component types for student
 */

export interface StudentLayoutProps {
  children: React.ReactNode;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface DrawerNavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}
