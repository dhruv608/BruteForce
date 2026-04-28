"use client";

import React, { useState } from 'react';
import { ForgotPasswordModal } from '../../../components/auth/ForgotPasswordModal';

export default function ForgotPasswordPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <ForgotPasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
