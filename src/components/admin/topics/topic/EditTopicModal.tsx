"use client";

import React, { useState, useEffect, useRef } from 'react';
import { updateAdminTopic } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import { Topic } from '@/types/admin/topic.types';
import { ImageCropModal } from '@/components/ui/ImageCropModal';

interface EditTopicModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   topic: Topic | null;
}

export default function EditTopicModal({ isOpen, onClose, onSuccess, topic }: EditTopicModalProps) {
   const [topicName, setTopicName] = useState('');
   const [photoFile, setPhotoFile] = useState<File | null>(null);
   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
   const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
   const [removePhoto, setRemovePhoto] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');
   const fileInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (topic) {
         setTopicName(topic.topic_name);
         setPhotoPreview(topic.photo_url ?? null);
         setPhotoFile(null);
         setPendingCropFile(null);
         setRemovePhoto(false);
         setFormError('');
      }
   }, [topic]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFormError('');
      if (!file) return;
      if (!file.type.startsWith('image/')) { setFormError('File must be an image'); return; }
      if (file.size > 5 * 1024 * 1024) { setFormError('Image size should be less than 5MB'); return; }
      setPendingCropFile(file);
   };

   const handleCropComplete = (blob: Blob) => {
      const croppedFile = new File([blob], pendingCropFile?.name ?? 'topic.jpg', { type: 'image/jpeg' });
      setPhotoFile(croppedFile);
      setPhotoPreview(URL.createObjectURL(blob));
      setRemovePhoto(false);
      setPendingCropFile(null);
   };

   const handleEditExistingPhoto = async () => {
      if (!topic?.slug || !topic?.photo_url) return;
      try {
         setFormError('');
         // Fetch via backend proxy — avoids needing CORS on the S3 bucket
         const res = await fetch(`/api/admin/topics/${topic.slug}/photo`, {
            credentials: 'include',
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
         });
         if (!res.ok) throw new Error('Failed to load existing image');
         const blob = await res.blob();
         const fileName = topic.photo_url.split('/').pop() ?? 'topic.jpg';
         const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
         setPendingCropFile(file);
      } catch (err: any) {
         setFormError(err.message ?? 'Could not load existing image for editing');
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');
      setSubmitting(true);
      try {
         const formData = new FormData();
         formData.append('topic_name', topicName);
         if (photoFile) {
            formData.append('photo', photoFile);
         }
         if (removePhoto) {
            formData.append('removePhoto', 'true');
         }
         if (!topic) return;

         await updateAdminTopic(topic.slug, formData);
         onClose();
         resetForm();
         onSuccess();
      } catch (err: any) {
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to update topic');
      } finally {
         setSubmitting(false);
      }
   };

   const resetForm = () => {
      setTopicName('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setPendingCropFile(null);
      setRemovePhoto(false);
      setFormError('');
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   return (
      <>
         <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="rounded-2xl   shadow-xl max-w-[600px]!">
               <DialogHeader className=" py-5 border-b p-4!  border-border/40">
                  <DialogTitle className="text-3xl font-bold">
                     Edit <span className='text-primary' >Topic</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                     Update topic details and image
                  </DialogDescription>
               </DialogHeader>

               <div className=" space-y-6 p-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                     {formError && (
                        <div className="text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                           {formError}
                        </div>
                     )}

                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                           Topic Name <span className="text-destructive">*</span>
                        </label>
                        <Input
                           value={topicName}
                           onChange={(e) => setTopicName(e.target.value)}
                           disabled={submitting}
                           className="h-11 rounded-2xl w-full bg-background/40 border-border focus-visible:ring-2 focus-visible:ring-logo/40"
                           placeholder='Arrays'
                        />
                     </div>

                     <div className="space-y-3">
                        <label className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                           Cover Image
                           {topic?.photo_url && (
                              <label className="flex items-center gap-2 text-[11px] cursor-pointer">
                                 <input
                                    type="checkbox"
                                    checked={removePhoto}
                                    onChange={(e) => {
                                       setRemovePhoto(e.target.checked);
                                       if (e.target.checked) {
                                          setPhotoPreview(null);
                                          setPhotoFile(null);
                                       } else {
                                          setPhotoPreview(topic?.photo_url ?? null);
                                       }
                                    }}
                                    className="accent-primary"
                                    disabled={submitting}
                                 />
                                 <span className="text-muted-foreground">
                                    Remove existing
                                 </span>
                              </label>
                           )}
                        </label>

                        <label className="flex items-center justify-between border border-border rounded-2xl px-4 py-3 cursor-pointer bg-background/40 hover:border-primary/40 transition">
                           <span className="text-sm text-muted-foreground truncate">
                              {photoFile ? photoFile.name : "Choose file"}
                           </span>
                           <span className="px-3 py-1.5 rounded-2xl bg-primary text-black text-xs font-semibold">
                              Browse
                           </span>
                           <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              disabled={submitting || removePhoto}
                              className="hidden"
                           />
                        </label>

                        {photoPreview && !removePhoto && (
                           <div className="border border-border/40 rounded-2xl p-3 bg-muted/20 space-y-2">
                              <div className="flex items-center justify-between">
                                 <p className="text-[11px] text-muted-foreground font-medium">
                                    Preview
                                 </p>
                                 {/* Show "Crop" only for the existing saved photo (not for a freshly cropped one) */}
                                 {topic?.photo_url && !photoFile && (
                                    <button
                                       type="button"
                                       onClick={handleEditExistingPhoto}
                                       disabled={submitting}
                                       className="text-[11px] font-medium text-primary hover:underline underline-offset-4"
                                    >
                                       Crop / Edit
                                    </button>
                                 )}
                              </div>
                              <div className="aspect-video overflow-hidden rounded-2xl relative">
                                 <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                                 />
                                 <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
                              </div>
                           </div>
                        )}
                     </div>

                     <DialogFooter className="flex gap-2 pt-2">
                        <Button
                           type="button"
                           onClick={handleClose}
                           disabled={submitting}
                           className="h-11 px-4 bg-foreground! text-secondary!"
                        >
                           Cancel
                        </Button>
                        <Button
                           type="submit"
                           disabled={submitting}
                           className="h-11  font-semibold bg-primary text-black hover:opacity-90 transition-all"
                        >
                           {submitting ? "Saving..." : "Save Changes"}
                        </Button>
                     </DialogFooter>
                  </form>
               </div>
            </DialogContent>
         </Dialog>

         <ImageCropModal
            file={pendingCropFile}
            onCrop={handleCropComplete}
            onClose={() => setPendingCropFile(null)}
            aspectRatio={16 / 9}
            cropShape="rect"
            title="Crop Topic Cover"
         />
      </>
   );
}
