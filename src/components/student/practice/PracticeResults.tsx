"use client";



import React, { useState } from 'react';

import { Search } from 'lucide-react';

import { QuestionRow } from '../questions/QuestionRow';

import { PracticeLoading } from './PracticeLoading';

import { BookmarkModal } from '../bookmarks/BookmarkModal';

import { useBookmarks } from '@/hooks/useBookmarks';
import { PracticeQuestion, PracticeResultsProps } from '@/types/student/index.types';



export function PracticeResults({ loading, questions, onRefresh }: PracticeResultsProps) {
  const { addBookmark, loading: bookmarkLoading } = useBookmarks();
  const [bookmarkModal, setBookmarkModal] = useState<{
    isOpen: boolean;
    question: PracticeQuestion | null;
  }>({
    isOpen: false,
    question: null
  });

  const handleBookmarkClick = async (questionId: number, question: PracticeQuestion) => {
    setBookmarkModal({
      isOpen: true,
      question
    });
  };

  const handleBookmarkSubmit = async (description: string) => {
    if (bookmarkModal.question) {
      await addBookmark(parseInt(bookmarkModal.question.id), description);
      setBookmarkModal({ isOpen: false, question: null });
      // Refresh the questions data to update bookmark status
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  if (loading) {

    return <PracticeLoading />;

  }



  if (questions.length === 0) {

    return (

      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed p-10">

        <Search className="w-10 h-10 mb-4 opacity-50 text-muted-foreground" />

        <div className="font-semibold text-foreground mb-1">No questions found</div>

        <div className="text-[13px]">Try adjusting your search or filters.</div>

      </div>

    );

  }



return (
  <>
    <div className="flex flex-col gap-3 min-h-[400px] glass rounded-2xl px-9 py-6 backdrop-blur-sm">

      {questions.length > 0 ? (
        questions.map((q: PracticeQuestion, idx) => (
          <div
            key={q.id}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{
              animationDelay: `${idx * 25}ms`,
              animationFillMode: 'both'
            }}
          >
            <QuestionRow
              questionName={q.question_name || q.questionName || ''}
              platform={q.platform}
              level={q.level}
              type={q.type}
              isSolved={q.isSolved || false}
              link={q.question_link || q.questionLink}
              topicName={q.topic?.topic_name}
              questionId={parseInt(q.id)}
              isBookmarked={q.isBookmarked || false}
              onBookmarkClick={handleBookmarkClick}
            />
          </div>
        ))
      ) : (
        /* 🔥 EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border/50 bg-background/30">

          <div className="text-sm text-muted-foreground mb-1">
            No questions found
          </div>

          <div className="text-xs text-muted-foreground/70">
            Try changing filters or come back later.
          </div>

        </div>
      )}

    </div>

    {/* 🔥 MODAL */}
    {bookmarkModal.question && (
      <BookmarkModal
        isOpen={bookmarkModal.isOpen}
        onClose={() =>
          setBookmarkModal({ isOpen: false, question: null })
        }
        question={bookmarkModal.question}
        onSubmit={handleBookmarkSubmit}
        loading={bookmarkLoading}
      />
    )}
  </>
);

}

