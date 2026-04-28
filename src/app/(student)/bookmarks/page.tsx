"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pagination } from '@/components/Pagination';
import { bookmarkService } from '@/services/bookmark.service';
import { Bookmark, BookmarksResponse } from '@/types/student/index.types';
import { EditBookmarkModal } from '@/components/student/bookmarks/EditBookmarkModal';
import { DeleteModal } from '@/components/DeleteModal';
import { BookmarkHeader } from '@/components/student/bookmarks/BookmarkHeader';
import { BookmarkFilter } from '@/components/student/bookmarks/BookmarkFilter';
import { BookmarkCard } from '@/components/student/bookmarks/BookmarkCard';
import { BookmarkShimmer } from '@/components/student/bookmarks/BookmarkShimmer';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Bookmark as BookmarkIcon } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pagination, setPagination] = useState<BookmarksResponse['pagination']>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'old'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatingBookmark, setUpdatingBookmark] = useState(false);

  // Debounced values
  const debouncedPage = useDebouncedValue(pagination.page, 300);
  const debouncedLimit = useDebouncedValue(pagination.limit, 300);

  const isFetching = useRef(false);
  const lastFetchParams = useRef({ page: 1, limit: 10, sort: 'recent', filter: 'all' });

  const fetchBookmarks = useCallback(async () => {
    const currentParams = { page: debouncedPage, limit: debouncedLimit, sort: sortBy, filter: filterBy };

    if (isFetching.current) {
      const sameParams =
        lastFetchParams.current.page === debouncedPage &&
        lastFetchParams.current.limit === debouncedLimit &&
        lastFetchParams.current.sort === sortBy &&
        lastFetchParams.current.filter === filterBy;

      if (sameParams) return;
    }

    isFetching.current = true;
    lastFetchParams.current = currentParams;

    try {
      setLoading(true);
      const response = await bookmarkService.getBookmarks({
        page: debouncedPage,
        limit: debouncedLimit,
        sort: sortBy,
        filter: filterBy
      });
      setBookmarks(response.bookmarks ?? []);
      setPagination(response.pagination ?? {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      });
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [debouncedPage, debouncedLimit, sortBy, filterBy]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleDeleteBookmark = (bookmark: Bookmark) => {
    setDeletingBookmark(bookmark);
    setShowDeleteModal(true);
  };

  const confirmDeleteBookmark = async () => {
    if (!deletingBookmark) return;

    try {
      await bookmarkService.deleteBookmark(deletingBookmark.question.id);
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    } finally {
      setShowDeleteModal(false);
      setDeletingBookmark(null);
    }
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setShowEditModal(true);
  };

  const handleUpdateBookmark = async (description: string) => {
    if (!editingBookmark) return;

    try {
      setUpdatingBookmark(true);
      await bookmarkService.updateBookmark(editingBookmark.question.id, description);
      setShowEditModal(false);
      setEditingBookmark(null);
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    } finally {
      setUpdatingBookmark(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-325 xl:max-w-275 2xl:max-w-325">

      <BookmarkHeader />

      <BookmarkFilter
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />

      {loading ? (
        <BookmarkShimmer />
      ) : bookmarks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground glass backdrop-blur-sm rounded-2xl border border-border border-dashed p-10">
          <BookmarkIcon className="w-10 h-10 mb-4 opacity-50 text-muted-foreground" />
          <div className="font-semibold text-foreground mb-1">No bookmarks found</div>
          <div className="text-[13px]">Start bookmarking questions to track your progress.</div>
        </div>
      ) : (
        <div className="space-y-3 p-5 rounded-2xl glass backdrop-blur-md">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={handleEditBookmark}
              onDelete={handleDeleteBookmark}
              updatingBookmark={updatingBookmark}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-8">
        <Pagination
          currentPage={debouncedPage}
          totalItems={pagination.total}
          limit={debouncedLimit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => {
            setPagination(prev => ({ ...prev, limit }));
          }}
          showLimitSelector={true}
        />
      </div>

      {/* MODALS */}
      {editingBookmark && (
        <EditBookmarkModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          bookmark={editingBookmark}
          onSubmit={handleUpdateBookmark}
          loading={updatingBookmark}
        />
      )}

      {deletingBookmark && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteBookmark}
          title="Delete Bookmark"
          itemName={deletingBookmark.question.question_name} submitting={false} />
      )}
    </div>
  );
}