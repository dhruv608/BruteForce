"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SuperAdminLoginForm } from '@/components/superadmin/SuperAdminLoginForm';

export default function SuperAdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-loginCard p-4 relative overflow-hidden">
      {/* 🌌 AMBIENT BACKGROUND EFFECTS */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <SuperAdminLoginForm />
      </motion.div>
    </div>
  );
}