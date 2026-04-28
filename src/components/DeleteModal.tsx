import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  title: string;
  itemName?: string;
  warningText?: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, submitting, title, itemName, warningText }: DeleteModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100%-1rem)] sm:max-w-[420px] p-0 overflow-hidden border-border/40 shadow-2xl rounded-2xl gap-0" onKeyDown={handleKeyDown}>
        <div className="p-4 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-5 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-100 dark:border-red-500/20 shadow-sm">
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-500" />
          </div>
          
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2">
            {title}
          </DialogTitle>
          
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed px-2">
            Are you sure you want to delete {itemName ? <span className="font-semibold text-foreground bg-accent/40 px-1.5 py-0.5 rounded border border-border/50">{itemName}</span> : 'this item'}? This action cannot be undone.
          </DialogDescription>

          {warningText && (
            <div className="mt-4 sm:mt-6 w-full text-left">
              <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 rounded-2xl p-3 sm:p-4 flex gap-3 text-sm text-red-800 dark:text-red-400 shadow-sm">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                <p className="leading-snug font-medium p-0 m-0 text-xs sm:text-sm">
                  {warningText}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border/60 flex flex-col-reverse sm:flex-row justify-center sm:justify-end items-center gap-3">
          <Button 
             
            onClick={onClose} 
            className="w-full bg-foreground! sm:w-auto font-medium transition-colors rounded text-secondary! hover:bg-muted/80 shadow-sm"
          >
            Cancel
          </Button>
          <Button 
            
            onClick={onConfirm} 
            disabled={submitting} 
            className="w-full sm:w-auto bg-red-900! hover:bg-red-700 text-white! shadow-sm font-medium transition-colors"
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
