"use client";

import React from 'react';
import { TopicCard } from './TopicCard';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { TopicsLoading } from './TopicLoading';

interface Topic {
  slug: string;
  topic_name: string;
  photo_url?: string;
  batchSpecificData?: {
    totalQuestions?: number;
    solvedQuestions?: number;
    totalClasses?: number;
  };
  progressPercentage?: number;
}

interface TopicsGridProps {
  topics: Topic[];
  searchQuery: string;
  pagination?: React.ReactNode;
  loading?: boolean;
}

export function TopicsGrid({ topics, searchQuery, pagination, loading }: TopicsGridProps) {
  if (loading) {
    return (
      <>
        <TopicsLoading />
        {pagination && (
          <div className="mt-8">
            {pagination}
          </div>
        )}
      </>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-10 text-muted-foreground glass backdrop-blur-sm rounded-2xl ">
        <DotLottieReact src="/Empty.json" loop autoplay className="w-40 h-40" />
        <p className="text-sm mt-2">
          {searchQuery ? "No topics matched your search." : "No topics assigned to your batch yet."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
        {topics.map((t: Topic, idx: number) => (
          <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }} key={t.slug}>
            <TopicCard
              topicSlug={t.slug}
              topicName={t.topic_name}
              photoUrl={t.photo_url}
              totalQuestions={t.batchSpecificData?.totalQuestions || 0}
              solvedQuestions={t.batchSpecificData?.solvedQuestions || 0}
              totalClasses={t.batchSpecificData?.totalClasses || 0}
              progressPercentage={t.progressPercentage || 0}
            />
          </div>
        ))}
      </div>

      {pagination && (
        <div className="mt-8">
          {pagination}
        </div>
      )}
    </>
  );
}
