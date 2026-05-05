import prisma from '@/lib/server/config/prisma';
import { ApiError } from '@/lib/server/utils/ApiError';

interface GetClassesByTopicInput {
  batchId: number;
  topicSlug: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const getClassesByTopicService = async ({
  batchId,
  topicSlug,
  page = 1,
  limit = 20,
  search = '',
}: GetClassesByTopicInput) => {

  if (!topicSlug) {
    throw new ApiError(400, "Invalid topic slug");
  }

  // Build where clause
  const whereClause: any = {
    batch_id: batchId,
    topic: {
      slug: topicSlug,
    },
  };

  // Add search filter if provided
  if (search) {
    whereClause.class_name = {
      contains: search,
      mode: 'insensitive'
    };
  }

  // Get total count for pagination
  const total = await prisma.class.count({
    where: whereClause,
  });

  // Calculate pagination
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  const classes = await prisma.class.findMany({
    where: whereClause,
    include: {
      _count: {
        select: {
          questionVisibility: true,
        },
      },
    },
    orderBy: {
      class_date: "asc",
    },
    skip,
    take: limit,
  });

  // Always fetch the topic directly so topic details are available even when 0 classes exist
  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    select: { topic_name: true, photo_url: true },
  });

  if (!topic && !search) {
    throw new ApiError(400, "Topic not found");
  }

  const formatted = classes.map((cls) => ({
    id: cls.id,
    class_name: cls.class_name,
    slug: cls.slug,
    description: cls.description,
    pdf_url: cls.pdf_url,
    duration_minutes: cls.duration_minutes,
    class_date: cls.class_date,
    questionCount: cls._count.questionVisibility,
    created_at: cls.created_at,
  }));

  const topicDetails = topic
    ? { topic_name: topic.topic_name, photo_url: topic.photo_url }
    : null;

  return {
    data: formatted,
    topic: topicDetails,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

interface GetClassDetailsInput {
  batchId: number;
  topicSlug: string;
  classSlug: string;
}

export const getClassDetailsService = async ({
  batchId,
  topicSlug,
  classSlug,
}: GetClassDetailsInput) => {

  if (!classSlug) {
    throw new ApiError(400, "Invalid class slug");
  }

  if (!topicSlug) {
    throw new ApiError(400, "Invalid topic slug");
  }

  // Find topic first
  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
  });

  if (!topic) {
    throw new ApiError(400, "Topic not found");
  }

  const cls = await prisma.class.findFirst({
    where: {
      slug: classSlug,
      batch_id: batchId,
      topic_id: topic.id,  // Add topic validation
    },
    include: {
      topic: {
        select: {
          id: true,
          topic_name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          questionVisibility: true,
        },
      },
    },
  });

  if (!cls) {
    throw new ApiError(400, "Class not found in this topic and batch");
  }

  return {
    id: cls.id,
    class_name: cls.class_name,
    slug: cls.slug,
    description: cls.description,
    pdf_url: cls.pdf_url,
    duration_minutes: cls.duration_minutes,
    class_date: cls.class_date,
    questionCount: cls._count.questionVisibility,
    topic: cls.topic,
    created_at: cls.created_at,
  };
};
