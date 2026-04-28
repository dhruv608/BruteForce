import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  preventOutsideClose?: boolean;
}

export function Modal({ isOpen, onClose, title, subtitle, children, icon, variant = 'default', preventOutsideClose = false }: ModalProps) {
  return (
    <Dialog  open={isOpen} onOpenChange={(open) => !open && !preventOutsideClose && onClose()}>
      <DialogContent className="w-full max-w-[calc(100%-1rem)] sm:max-w-md border-border/40 shadow-2xl rounded-3xl p-4 sm:p-6">
        <div className="px-2 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 flex flex-col gap-4 sm:gap-5 text-center sm:text-left">
          <DialogHeader className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 space-y-0">
            {icon && (
              <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full ring-8 ${variant === 'danger' ? 'bg-red-500/10 text-red-600 ring-red-500/5' : 'bg-primary/10 text-primary ring-primary/5 mx-auto sm:mx-0'}`}>
                {icon}
              </div>
            )}
            <div className={`flex flex-col gap-1.5 ${!icon ? 'w-full' : ''} ${variant === 'danger' ? 'sm:text-left text-center' : 'text-center sm:text-left'}`}>
              <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight">{title}</DialogTitle>
              {subtitle && <DialogDescription className="text-sm text-muted-foreground">{subtitle}</DialogDescription>}
            </div>
          </DialogHeader>
          <div className="w-full">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
