"use client";

import React from 'react';
import CreateQuestion from '@/components/admin/questions/CreateQuestion';
import UpdateQuestion from '@/components/admin/questions/UpdateQuestion';
import DeleteQuestion from '@/components/admin/questions/DeleteQuestion';
import BulkUploadModal from '@/components/admin/questions/BulkUploadModal';

interface QuestionsModalsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  isBulkUploadOpen: boolean;
  setIsBulkUploadOpen: (open: boolean) => void;
  selectedQ: any;
  loadQuestions: () => void;
  topicsForBulkUpload: { label: string; value: string }[];
}

export default function QuestionsModals({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  isBulkUploadOpen,
  setIsBulkUploadOpen,
  selectedQ,
  loadQuestions,
  topicsForBulkUpload,
}: QuestionsModalsProps) {
  return (
    <>
      <CreateQuestion open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadQuestions} />
      <BulkUploadModal open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen} onSuccess={loadQuestions} topics={topicsForBulkUpload} />
      <UpdateQuestion open={isEditOpen} onOpenChange={setIsEditOpen} question={selectedQ} onSuccess={loadQuestions} />
      <DeleteQuestion open={isDeleteOpen} onOpenChange={setIsDeleteOpen} question={selectedQ} onSuccess={loadQuestions} />
    </>
  );
}
