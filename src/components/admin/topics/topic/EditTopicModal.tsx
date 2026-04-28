"use client";

import React, { useState, useEffect } from 'react';
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
   const [removePhoto, setRemovePhoto] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');

   useEffect(() => {
      if (topic) {
         setTopicName(topic.topic_name);
         setPhotoPreview(topic.photo_url ?? null);
         setPhotoFile(null);
         setRemovePhoto(false);
         setFormError('');
      }
   }, [topic]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFormError('');
      if (!file) {
         setPhotoFile(null);
         setPhotoPreview(null);
         return;
      }

      if (!file.type.startsWith('image/')) {
         setFormError('File must be an image');
         return;
      }
      if (file.size > 5 * 1024 * 1024) {
         setFormError('Image size should be less than 5MB');
         return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
         setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      setRemovePhoto(false);
      setFormError('');
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="rounded-2xl  overflow-hidden shadow-xl max-w-[600px]!">
            <DialogHeader className=" py-5 border-b border-border/40">
               <DialogTitle className="text-3xl font-semibold">
                  Edit <span className='text-primary' >Topic</span>
               </DialogTitle>
               <DialogDescription className="text-xs text-muted-foreground">
                  Update topic details and image
               </DialogDescription>
            </DialogHeader>

            <div className=" space-y-6 ">
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
                        className="h-11 rounded-2xl w-full bg-background/40 border-border focus-visible:ring-2 focus-visible:ring-primary/40"
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
                           type="file"
                           accept="image/*"
                           onChange={handleFileChange}
                           disabled={submitting || removePhoto}
                           className="hidden"
                        />
                     </label>

                     {photoPreview && !removePhoto && (
                        <div className="border border-border/40 rounded-2xl p-3 bg-muted/20 space-y-2">
                           <p className="text-[11px] text-muted-foreground font-medium">
                              Preview
                           </p>
                           <div className="overflow-hidden rounded-2xl relative">
                              <img
                                 src={photoPreview}
                                 alt="Preview"
                                 className="w-full h-36 object-cover transition-transform duration-300 hover:scale-[1.03]"
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
   );
}
