import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ILessonRepository, LessonRow } from '@/models/lessons/lesson.repository.interface.js';
import { LessonNotFoundError, LessonService } from '@/modules/lessons/lesson.service.js';

describe('LessonService', () => {
	let lessonService: LessonService;
	let lessonRepositoryMock: ILessonRepository;

	const mockLessonRow: LessonRow = {
		id: 1,
		module_id: 'mod-1',
		module_subtitle: 'Sub',
		title: 'Lesson Title',
		page_number: 1,
		total_pages: 5,
		hero_caption: 'Caption',
		intro: 'Intro',
		concepts_title: 'Concepts',
		applications_title: 'Apps',
		footer_cta: 'CTA',
	};

	beforeEach(() => {
		lessonRepositoryMock = {
			findByPage: vi.fn(),
			findConceptItems: vi.fn(),
			findConceptExamples: vi.fn(),
			findApplicationItems: vi.fn(),
			create: vi.fn(),
			createConceptItem: vi.fn(),
			createConceptExample: vi.fn(),
			createApplicationItem: vi.fn(),
			updateLesson: vi.fn(),
			deleteLesson: vi.fn(),
			updateConceptItem: vi.fn(),
			deleteConceptItem: vi.fn(),
			updateConceptExample: vi.fn(),
			deleteConceptExample: vi.fn(),
			updateApplicationItem: vi.fn(),
			deleteApplicationItem: vi.fn(),
		} as unknown as ILessonRepository;

		lessonService = new LessonService(lessonRepositoryMock);
	});

	describe('getLesson', () => {
		it('should return lesson content when exists (happy path)', async () => {
			vi.mocked(lessonRepositoryMock.findByPage).mockResolvedValue(mockLessonRow);
			vi.mocked(lessonRepositoryMock.findConceptItems).mockResolvedValue([{ id: '1', title: 'C1', description: 'D1', latex: null }]);
			vi.mocked(lessonRepositoryMock.findConceptExamples).mockResolvedValue([{ id: '1', label: 'E1', latex: 'L1' }]);
			vi.mocked(lessonRepositoryMock.findApplicationItems).mockResolvedValue([{ id: '1', title: 'A1', description: 'D1', latex: null }]);

			const result = await lessonService.getLesson('mod-1', 1);

			expect(lessonRepositoryMock.findByPage).toHaveBeenCalledWith('mod-1', 1);
			expect(result.header.title).toBe(mockLessonRow.title);
			expect(result.sections.concepts.items).toHaveLength(1);
			expect(result.navigation?.nextPage).toBe('/module/mod-1/lesson/2');
		});

		it('should throw LessonNotFoundError when lesson not found (unhappy path)', async () => {
			vi.mocked(lessonRepositoryMock.findByPage).mockResolvedValue(null);

			await expect(lessonService.getLesson('mod-1', 99)).rejects.toThrow(LessonNotFoundError);
		});
	});

	describe('createLesson', () => {
		it('should create a lesson (happy path)', async () => {
			const data = {
				module_id: 'mod-1',
				title: 'New',
				page_number: 2,
				intro: 'Intro',
				concepts_title: 'Concepts',
				applications_title: 'Apps',
				footer_cta: 'CTA',
			};
			const createdLesson = { ...data, id: 1, hero_caption: null };
			vi.mocked(lessonRepositoryMock.create).mockResolvedValue(createdLesson);

			const result = await lessonService.createLesson(data);

			expect(lessonRepositoryMock.create).toHaveBeenCalledWith(data);
			expect(result.title).toBe('New');
		});
	});
});
