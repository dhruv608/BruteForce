import { z } from "zod";

/**
 * Question Type enum for assignments
 */
export const QuestionTypeEnum = z.enum(["HOMEWORK", "CLASSWORK"]);

/**
 * Create Topic Schema
 * For CreateTopicModal component
 */
export const createTopicSchema = z.object({
  topic_name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
});

/**
 * Update Topic Schema
 * For EditTopicModal component
 */
export const updateTopicSchema = z.object({
  topic_name: z.string().min(1, "Topic name is required").optional(),
  description: z.string().optional(),
});

/**
 * Create Class Schema
 * For CreateClassModal component
 */
export const createClassSchema = z.object({
  class_name: z.string().min(1, "Class name is required"),
  duration: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Update Class Schema
 * For EditClassModal component
 */
export const updateClassSchema = z.object({
  class_name: z.string().min(1, "Class name is required").optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Assign Questions to Class Schema
 * For AssignQuestionsModal component
 */
export const assignQuestionsSchema = z.object({
  question_ids: z.array(z.number().int().positive()).min(1, "At least one question is required"),
  class_id: z.number().int().positive("Class ID is required"),
  type: QuestionTypeEnum,
});

// Type exports
export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type AssignQuestionsInput = z.infer<typeof assignQuestionsSchema>;
