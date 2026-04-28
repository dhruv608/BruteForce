"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import CreateTopicModal from '@/components/admin/topics/topic/CreateTopicModal';
import EditTopicModal from '@/components/admin/topics/topic/EditTopicModal';
import DeleteTopicModal from '@/components/admin/topics/topic/DeleteTopicModal';
import TopicHeader from '@/components/admin/topics/topic/TopicHeader';
import TopicFilter from '@/components/admin/topics/topic/TopicFilter';
import TopicGrid from '@/components/admin/topics/topic/TopicGrid';
import {
   BookOpen,
} from 'lucide-react';
import { Pagination } from '@/components/Pagination';
import TopicsPageShimmer from '@/components/admin/topics/topic/TopicShimmer';
import { Topic } from '@/types/admin/topic.types';
import { useTopics } from '@/hooks/admin/useTopics';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export default function AdminTopicsPage() {
   const { selectedBatch, isLoadingContext } = useAdminStore();
   const router = useRouter();
   const searchParams = useSearchParams();


   // URL Params State
   const [search, setSearch] = useState(searchParams.get('search') || '');
   const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
   const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recent');

   // Debounced values
   const debouncedSearch = useDebouncedValue(search, 500);
   const debouncedPage = useDebouncedValue(page, 300);

   // Modals
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

   //Pagination
   const [limit, setLimit] = useState(20);
   const debouncedLimit = useDebouncedValue(limit, 300);

   // Reset page to 1 when search changes
   useEffect(() => {
      if (search !== debouncedSearch) {
         setPage(1);
      }
   }, [debouncedSearch, search]);

   // Sync URL
   useEffect(() => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (page > 1) params.set('page', page.toString());
      if (debouncedLimit !== 20) params.set('limit', debouncedLimit.toString());
      if (sortBy !== 'recent') params.set('sortBy', sortBy);

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
   }, [debouncedSearch, page, debouncedLimit, sortBy, router]);

   const {
      topics,
      loading,
      totalRecords,
      refetch,
   } = useTopics({
      batchSlug: selectedBatch?.slug,
      page: debouncedPage,
      limit: debouncedLimit,
      search: debouncedSearch,
      sortBy,
   });

   const openEdit = (topic: Topic) => {
      setSelectedTopic(topic);
      setIsEditOpen(true);
   };

   const openDelete = (topic: Topic) => {
      setSelectedTopic(topic);
      setIsDeleteOpen(true);
   };



   if (isLoadingContext) {
      return <TopicsPageShimmer />;
   }

   if (!selectedBatch) {
      return (
         <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card">
            <BookOpen className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Batch Context</h3>
            <p className="text-muted-foreground text-sm max-w-sm">Please select a Global Batch from the top right corner to view specific topic classes.</p>
         </div>
      );
   }

   return (
       <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 pb-12">

         <TopicHeader totalRecords={totalRecords} />

         <TopicFilter
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onCreateClick={() => setIsCreateOpen(true)}
         />

         <TopicGrid
            topics={topics}
            loading={loading}
            onEdit={openEdit}
            onDelete={openDelete}
         />

         <Pagination
            currentPage={page}
            totalItems={totalRecords}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
               setLimit(newLimit);
               setPage(1);
            }}
            showLimitSelector={true}
            loading={loading}
         />

         <CreateTopicModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={refetch}
         />

         <EditTopicModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSuccess={refetch}
            topic={selectedTopic}
         />

         <DeleteTopicModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onSuccess={refetch}
            topic={selectedTopic}
         />

      </div>
   );
}

