"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Topic } from '@/types/admin/topic.types';
import TopicCard from '@/components/admin/topics/topic/TopicsCard';
import TopicShimmer from './TopicShimmer';
interface TopicGridProps {
   topics: Topic[];
   loading: boolean;
   onEdit: (topic: Topic) => void;
   onDelete: (topic: Topic) => void;
}

export default function TopicGrid({ topics, loading, onEdit, onDelete }: TopicGridProps) {
   return (
      <>
         {loading ? (
            <TopicShimmer/>
         ) : topics.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center flex flex-col items-center">
               <DotLottieReact src="/Empty.json" loop autoplay className="w-40 h-40" />
               <p className="text-muted-foreground text-sm mt-2">No topics matched your search.</p>
            </div>
         ) : (
            <div className="grid  mb-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {topics.map((topic: Topic) => (
                  <TopicCard
                     key={topic.id}
                     topic={topic}
                     onEdit={onEdit}
                     onDelete={onDelete}
                  />
               ))}
            </div>
         )}
      </>
   );
}
