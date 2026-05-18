import { z } from 'zod';

// ── Schemas ─────────────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z.string().min(2, { message: 'Category name must be at least 2 characters' }).trim(),
  slug: z
    .string()
    .min(2, { message: 'Slug must be at least 2 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must be lowercase with hyphens only' })
    .trim(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid category ID' }),
});

// ── Types ───────────────────────────────────────────────────
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
