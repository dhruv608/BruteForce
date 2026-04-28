"use client";

import { VerifyOtpModal } from '@/components/auth';
import React, { useState } from 'react';

export default function VerifyOtpPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <VerifyOtpModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
