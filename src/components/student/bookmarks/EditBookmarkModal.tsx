import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface EditBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: {
    id: number;
    question: {
      id: number;
      question_name: string;
      platform: string;
      level: string;
      type: string;
    };
    description: string | null;
  };
  onSubmit: (description: string) => void;
  loading?: boolean;
}

export const EditBookmarkModal: React.FC<EditBookmarkModalProps> = ({
  isOpen,
  onClose,
  bookmark,
  onSubmit,
  loading = false
}) => {
  const [description, setDescription] = useState('');

  // Set initial description when bookmark changes
  useEffect(() => {
    setDescription(bookmark.description || '');
  }, [bookmark]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description);
  };


  const handleClose = () => {
    setDescription(bookmark.description || '');
    onClose();
  };

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY': return 'text-[var(--easy)] bg-[var(--easy)]/10 border-[var(--easy)]/20';
      case 'MEDIUM': return 'text-[var(--medium)] bg-[var(--medium)]/10 border-[var(--medium)]/20';
      case 'HARD': return 'text-[var(--hard)] bg-[var(--hard)]/10 border-[var(--hard)]/20';
      default: return 'text-muted-foreground bg-muted border-border/40';
    }
  };

  const getPlatformShort = (platform: string) => {
    if (!platform) return '';
    if (platform.toLowerCase().includes('leetcode')) return 'LC';
    if (platform.toLowerCase().includes('gfg')) return 'GFG';
    return platform;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-1">

            <DialogTitle className="text-3xl font-semibold text-foreground">Edit <span className='text-primary' >Bookmark</span></DialogTitle>
          </div>
        </DialogHeader>

        {/* CONTENT */}
        <div className="p-6">
          {/* QUESTION INFO */}
          <div className="mb-6 p-4 rounded-2xl bg-accent/20 border border-border/40">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-foreground">{bookmark.question.question_name}</h3>
              <span className={`px-2 py-1 rounded border text-xs font-semibold ${getLevelColor(bookmark.question.level)}`}>
                {bookmark.question.level}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{getPlatformShort(bookmark.question.platform)}</span>
              <span>•</span>
              <span>{bookmark.question.type === 'HOMEWORK' ? 'HW' : 'CW'}</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                disabled={loading}
                placeholder="Add your notes about this question..."
              />
            </div>

            {/* ACTIONS */}
            <DialogFooter className="px-6 py-4">
              <div className="grid grid-cols-3 gap-3 w-full">
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className=" col-span-1 bg-foreground! text-secondary!"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="col-span-2  w-full!"
                >
                  {loading ? 'Updating...' : 'Update Bookmark'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
