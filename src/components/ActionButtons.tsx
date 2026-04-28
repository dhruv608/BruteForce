import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex justify-end gap-1">
      {onEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit} 
          className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
      {onDelete && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete} 
          className="h-8 w-8 p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
