"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { X, Camera, Trash2, Github, Linkedin, Lock } from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { ProfileEditForm, StudentProfile } from '@/types/student/index.types';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  editForm: ProfileEditForm;
  setEditForm: (form: ProfileEditForm) => void;
  uploading: boolean;
  savingProfile: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: () => void;
  handleSaveProfile: () => void;
  imagePreview: string | null;
  imageRemoved: boolean;
}

export function EditProfileModal({
  isOpen,
  onClose,
  student,
  editForm,
  setEditForm,
  uploading,
  savingProfile,
  fileInputRef,
  handleImageUpload,
  handleDeleteImage,
  handleSaveProfile,
  imagePreview,
  imageRemoved,
}: EditProfileModalProps) {

  const handleSaveWithToast = async () => {
    try {
      await handleSaveProfile();
      onClose();
    } catch (error) {
      // Error is handled by API client interceptor
      console.error('Profile update error:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveWithToast();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100%-1rem)] sm:max-w-md overflow-hidden p-0">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight">Edit Profile</DialogTitle>
          <DialogDescription className="hidden">Update your profile information</DialogDescription>

        </DialogHeader>

        <div className="p-4 sm:p-5 space-y-4">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-20 h-20 border-border border sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="object-cover" />
                ) : imageRemoved ? (
                  // <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  //   {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  // </div>
                  <ProfileAvatar username={student.name} size={85} />
                ) : student.profileImageUrl ? (
                  <img src={student.profileImageUrl} alt="Profile" className=" object-cover" />
                ) : (
                  // <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  //   {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  // </div>
                  <ProfileAvatar username={student.name} size={85} />

                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || savingProfile}
                className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || savingProfile}
                className="text-xs sm:text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors disabled:opacity-50"
              >
                {uploading || savingProfile ? 'Processing…' : imagePreview || imageRemoved ? 'Change photo' : student.profileImageUrl ? 'Change photo' : 'Upload photo'}
              </button>
              {(student.profileImageUrl || imagePreview || imageRemoved) && (
                <>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <button
                    onClick={handleDeleteImage}
                    disabled={uploading || savingProfile}
                    className="text-xs sm:text-sm font-medium text-destructive hover:underline underline-offset-4 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* GitHub */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              GitHub URL
            </label>
            <Input
              type="url"
              value={editForm.github}
              onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="https://github.com/username"
              className="w-full rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              LinkedIn URL
            </label>
            <Input
              type="url"
              value={editForm.linkedin}
              onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          {/* Locked fields */}
          <div className="rounded-2xl border border-border px-3 sm:px-4 py-3 grid grid-cols-2 gap-3">
            <div className="col-span-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">Fields locked · contact admin to update</span>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2">
                <LeetCodeIcon className="w-3 h-3 text-leetcode" />
                LeetCode ID
              </label>
              <div className="border border-border px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-muted/20 text-xs sm:text-sm text-muted-foreground">
                {student.leetcode || '—'}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2">
                <GeeksforGeeksIcon className="w-3 h-3 text-gfg" />
                GFG ID
              </label>
              <div className="border border-border px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-muted/20 text-xs sm:text-sm text-muted-foreground">
                {student.gfg || '—'}
              </div>
            </div>
          </div>

        </div>

        <DialogFooter className="p-4 sm:p-5 pt-1">
          <div className="flex gap-2 w-full">
            <Button onClick={handleSaveWithToast} disabled={savingProfile} className="flex-1 h-10 sm:h-12">
              {savingProfile ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button onClick={onClose} variant="outline" size="default" className="flex-1 h-10 sm:h-12">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
