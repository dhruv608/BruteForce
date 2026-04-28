"use client";

import React, { useState } from 'react';
import { ResetPasswordModal } from '../../../components/auth/ResetPasswordModal';

export default function ResetPasswordPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <ResetPasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
