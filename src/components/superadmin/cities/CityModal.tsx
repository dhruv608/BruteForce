"use client";

import { useState, useEffect } from 'react';
import { City } from '@/services/city.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CitySubmitPayload } from '@/types/superadmin/index.types';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  city?: City | null;
  onSubmit: (data: CitySubmitPayload) => Promise<void>;
  submitting: boolean;
}

export function CityModal({ 
  isOpen, 
  onClose, 
  mode, 
  city, 
  onSubmit, 
  submitting 
}: CityModalProps) {
  const [cityName, setCityName] = useState('');

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'create') {
      setCityName('');
    } else if (city) {
      setCityName(city.city_name);
    }
  }, [mode, city]);

  const handleSubmit = async () => {
    const payload = { city_name: cityName };
    await onSubmit(payload);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting && isFormValid) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isFormValid = cityName.trim();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-border/40 shadow-2xl rounded-3xl">
        <div className="px-6 pt-8 pb-6 flex flex-col gap-5 text-center sm:text-left">
          <DialogHeader className="flex flex-col gap-1.5 space-y-0 border-0!">
            <DialogTitle className="text-3xl p-0 m-0 font-bold tracking-tight">
              <span className="text-foreground">
                {mode === 'create' ? 'Create' : 'Edit'}
              </span>{' '}
              <span className="text-primary">City</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {mode === 'create'
                ? 'City will be available for batch assignment immediately.'
                : 'Update city name. This will reflect across all associated batches.'}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
  <div className="space-y-6" onKeyDown={handleKeyDown}>

    {/* 🔹 FORM */}
    <div className="space-y-4">

      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <label className="text-sm text-muted-foreground">
          City Name *
        </label>

        <Input
          placeholder="e.g. Hyderabad"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          disabled={submitting}
          className="
            w-full
            bg-accent/40 backdrop-blur
            border border-border/30
            focus:ring-2 focus:ring-primary/30
            transition
          "
        />
      </div>

    </div>

    {/* 🔹 ACTIONS */}
    <div className="
      flex items-center justify-end gap-3
      pt-4 
    ">
      <Button
        onClick={onClose}
        disabled={submitting}
        className="text-secondary! bg-foreground!"
      >
        Cancel
      </Button>

      <Button
        onClick={handleSubmit}
        disabled={submitting || !isFormValid}
        className="
          bg-primary text-primary-foreground
          hover:bg-primary/90
          shadow-md
        "
      >
        {submitting
          ? "Processing..."
          : mode === "create"
            ? "Create City"
            : "Update City"}
      </Button>
    </div>
  </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
