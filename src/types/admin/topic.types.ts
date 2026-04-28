export type Topic = {
  id: string;
  topic_name: string;
  slug: string;
  photo_url?: string;
  classCount?: number;
  questionCount?: number;
  firstClassCreated_at?: string | null;
  lastClassCreated_at?: string | null;
};


export type TopicCardProps = {
  topic: Topic;
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
};


export type TopicsResponse = {
  topics: Topic[];
  pagination: {
    total: number;
    totalPages: number;
  };
};

// Component Props
export interface TopicHeaderProps {
  totalRecords: number;
}

export interface TopicFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onCreateClick: () => void;
}

export interface TopicGridProps {
  topics: Topic[];
  loading: boolean;
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
}

export interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface EditTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topic: Topic | null;
}

export interface DeleteTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topic: Topic | null;
}

export interface TopicQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}
