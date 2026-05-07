import { BadRequestError, NotFoundError } from '@/models/errors.js';
import { MIN_SCORE_TO_PASS } from '@/models/progress/progress.constants.js';

export class ProgressNotFoundError extends NotFoundError {
	constructor(moduleId: string) {
		super(`Progresso não encontrado para o módulo '${moduleId}'. Inicie o módulo primeiro.`);
	}
}

export class QuizScoreInsufficientError extends BadRequestError {
	score: number;
	constructor(score: number) {
		super(`Nota insuficiente: ${score}%. É necessário pelo menos ${MIN_SCORE_TO_PASS}% para concluir o módulo.`);
		this.score = score;
	}
}

export class ModuleAlreadyCompletedError extends BadRequestError {
	constructor(moduleId: string) {
		super(`O módulo '${moduleId}' já foi concluído.`);
	}
}
