import { z } from 'zod';
import { ApplicationItemResponseSchema } from '@/models/lessons/application-item.schema.js';
import {
	ConceptExampleResponseSchema,
	ConceptItemResponseSchema,
} from '@/models/lessons/concept-example.schema.js';

export const LessonSchema = z.object({
	id: z.number().int(),
	module_id: z.string().max(10),
	page_number: z.number().int(),
	title: z.string().max(200),
	intro: z.string(),
	hero_caption: z.string().max(300).nullable(),
	concepts_title: z.string().max(200),
	applications_title: z.string().max(200),
	footer_cta: z.string().max(200),
});

export const LessonContentSchema = z.object({
	header: z.object({
		module: z.string(),
		title: z.string(),
	}),
	hero: z.object({
		caption: z.string(),
	}),
	intro: z.string(),
	sections: z.object({
		concepts: z.object({
			title: z.string(),
			items: z.array(ConceptItemResponseSchema),
			examples: z.array(ConceptExampleResponseSchema).optional(),
		}),
		applications: z.object({
			title: z.string(),
			items: z.array(ApplicationItemResponseSchema),
		}),
	}),
	footer: z.object({
		cta: z.string(),
	}),
	navigation: z
		.object({
			prevPage: z.string().optional(),
			nextPage: z.string().optional(),
			isLastPage: z.boolean().optional(),
		})
		.optional(),
});

export type Lesson = z.infer<typeof LessonSchema>;
export type LessonContent = z.infer<typeof LessonContentSchema>;
