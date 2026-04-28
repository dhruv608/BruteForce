import { useState, useCallback } from 'react';
import { bookmarkService } from '@/services/bookmark.service';
import { BookmarkRequest, Bookmark } from '@/types/student/index.types';

export const useBookmarks = () => {
  const [loading, setLoading] = useState(false);

  const addBookmark = useCallback(async (questionId: number, description?: string) => {
    try {
      setLoading(true);
      await bookmarkService.addBookmark({ question_id: questionId, description });
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeBookmark = useCallback(async (questionId: number) => {
    try {
      setLoading(true);
      await bookmarkService.deleteBookmark(questionId);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookmark = useCallback(async (questionId: number, description: string) => {
    try {
      setLoading(true);
      await bookmarkService.updateBookmark(questionId, description);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to check if question is bookmarked from bookmarks list
  const isQuestionBookmarked = useCallback((questionId: number, bookmarksList: Bookmark[]) => {
    return bookmarksList.some((bookmark: Bookmark) => bookmark.question.id === questionId);
  }, []);

  return {
    loading,
    addBookmark,
    removeBookmark,
    updateBookmark,
    isQuestionBookmarked
  };
};
