"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, GraduationCap, Hash, Code, UserPlus } from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { PasswordInputWithValidation } from './PasswordStrengthIndicator';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { registerStudentSchema, RegisterStudentInput } from '@/schemas/auth.schema';

interface StudentRegistrationFormProps {
  onSubmit: (data: RegisterStudentInput) => void;
  loading?: boolean;
}

export function StudentRegistrationForm({ onSubmit, loading = false }: StudentRegistrationFormProps) {
  const form = useForm<RegisterStudentInput>({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      enrollment_id: '',
      batch_id: 0,
      leetcode_id: '',
      gfg_id: ''
    }
  });

  const password = form.watch('password') || '';
  const { validationResult } = usePasswordValidation(password);

  const handleFormSubmit = (values: RegisterStudentInput) => {
    // Custom email domain validation
    if (!values.email.endsWith('@pwioi.com')) {
      form.setError('email', { message: 'Must use @pwioi.com email' });
      return;
    }
    
    if (!validationResult.isValid) {
      form.setError('password', { message: validationResult.message });
      return;
    }

    onSubmit(values);
  };

  const isSubmitDisabled = loading || !validationResult.isValid || !form.formState.isValid;

  const formErrors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* NAME FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Full Name
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="John Doe"
            {...form.register('name')}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              formErrors.name ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {formErrors.name && <p className="text-red-400 text-xs ml-1">{formErrors.name.message}</p>}
      </div>

      {/* EMAIL FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="email"
            placeholder="student@pwioi.com"
            {...form.register('email')}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              formErrors.email ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {formErrors.email && <p className="text-red-400 text-xs ml-1">{formErrors.email.message}</p>}
      </div>

      {/* USERNAME FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Username
        </label>
        <div className="relative group">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="johndoe123"
            {...form.register('username')}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              formErrors.username ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {formErrors.username && <p className="text-red-400 text-xs ml-1">{formErrors.username.message}</p>}
      </div>

      {/* PASSWORD FIELD WITH VALIDATION */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Password
        </label>
        <PasswordInputWithValidation
          password={password}
          onPasswordChange={(val) => form.setValue('password', val)}
          disabled={loading}
          showStrengthIndicator={true}
          showChecklist={true}
          className="space-y-3"
          error={formErrors.password?.message}
        />
      </div>

      {/* ENROLLMENT ID FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Enrollment ID
        </label>
        <div className="relative group">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="PW2024001"
            {...form.register('enrollment_id')}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${
              formErrors.enrollment_id ? 'border-red-500' : 'border-white/5'
            }`}
          />
        </div>
        {formErrors.enrollment_id && <p className="text-red-400 text-xs ml-1">{formErrors.enrollment_id.message}</p>}
      </div>

      {/* BATCH ID FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          Batch
        </label>
        <div className="relative group">
          <select
            {...form.register('batch_id', { valueAsNumber: true })}
            disabled={loading}
            className={`w-full h-14 pl-12 pr-4 bg-input border rounded-2xl text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer ${
              formErrors.batch_id ? 'border-red-500' : 'border-white/5'
            }`}
          >
            <option value={0} className="bg-slate-800">Select Batch</option>
            <option value={1} className="bg-slate-800">Batch 1 - 2024</option>
            <option value={2} className="bg-slate-800">Batch 2 - 2024</option>
            <option value={3} className="bg-slate-800">Batch 3 - 2024</option>
          </select>
        </div>
        {formErrors.batch_id && <p className="text-red-400 text-xs ml-1">{formErrors.batch_id.message}</p>}
      </div>

      {/* OPTIONAL PLATFORM IDs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
            <LeetCodeIcon className="w-3 h-3 text-leetcode" />
            LeetCode ID (Optional)
          </label>
          <div className="relative group">
            <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="leetcode123"
              {...form.register('leetcode_id')}
              disabled={loading}
              className="w-full h-14 pl-12 pr-4 bg-input border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
            <GeeksforGeeksIcon className="w-3 h-3 text-gfg" />
            GFG ID (Optional)
          </label>
          <div className="relative group">
            <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="gfg123"
              {...form.register('gfg_id')}
              disabled={loading}
              className="w-full h-14 pl-12 pr-4 bg-input border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <motion.button
        type="submit"
        disabled={isSubmitDisabled}
        whileHover={{ scale: isSubmitDisabled ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitDisabled ? 1 : 0.99 }}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_20px_rgba(204,255,0,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <BruteForceLoader size="sm" />
        ) : (
          <>
            <UserPlus size={16} />
            Create Account
          </>
        )}
      </motion.button>
    </form>
  );
}
