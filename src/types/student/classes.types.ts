/**
 * Classes-related types for student
 */

import { PracticeQuestion } from './practice.types';

export interface Class {
  id: number;
  class_slug?: string;
  slug: string;
  class_name: string;
  index?: number;
  duration?: number;
  date?: string;
  class_date?: string;
  classDate?: string;
  total_questions?: number;
  totalQuestions?: number;
  solved_questions?: number;
  solvedQuestions?: number;
  pdf_url?: string;
  topic_slug?: string;
}

export interface ClassCardProps {
  topicSlug: string;
  classSlug: string;
  index: number;
  classNameTitle: string;
  duration?: number;
  date?: string;
  totalQuestions: number;
  solvedQuestions: number;
  pdfUrl?: string;
}

export interface ClassHeaderProps {
  classData: {
    class_name: string;
    duration_minutes?: number;
    pdf_url?: string;
    description?: string;
  };
  progress: number;
  solvedQuestions: number;
  totalQuestions: number;
  formattedDate?: string | null;
}

export interface ClassQuestionsProps {
  classSlug: string;
  topicSlug: string;
  questions: PracticeQuestion[];
  onRefresh?: () => void;
  loading: boolean;
}

export interface ClassDetailsProps {
  topicSlug: string;
  classSlug: string;
}

export interface SubtopicHeaderProps {
  topicName: string;
  topicSlug: string;
  subtopicName: string;
  totalClasses: number;
}

export interface SubtopicClassesProps {
  classes: Class[];
  topicSlug: string;
  loading: boolean;
}

export interface ClassDetailsShimmerProps {
  // No props needed
}
