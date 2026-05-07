import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

const GeminiResponseSchema = z.object({
	module: z.object({
		id: z.string(),
		title: z.string(),
		subtitle: z.string(),
		subject: z.string(),
		order_index: z.number().int(),
		locked_by_default: z.boolean(),
		min_xp: z.number().int().min(0),
	}),
	lessons: z.array(
		z.object({
			title: z.string(),
			intro: z.string(),
			hero_caption: z.string().optional(),
			concepts_title: z.string(),
			applications_title: z.string(),
			footer_cta: z.string(),
			concept_items: z.array(
				z.object({
					title: z.string(),
					description: z.string(),
					latex: z.string().nullish(),
				}),
			),
			concept_examples: z.array(
				z.object({
					label: z.string(),
					latex: z.string(),
				}),
			),
			application_items: z.array(
				z.object({
					title: z.string(),
					description: z.string(),
					latex: z.string().nullish(),
				}),
			),
		}),
	),
	quiz_questions: z.array(
		z.object({
			type: z.enum(['multiple_choice', 'true_false']),
			text: z.string(),
			options: z
				.array(z.object({ text: z.string(), is_correct: z.boolean() }))
				.refine((opts) => opts.filter((o) => o.is_correct).length === 1, 'Exatamente 1 opção correta'),
		}),
	),
});

export type GeminiImportData = z.infer<typeof GeminiResponseSchema>;

const PROMPT = `Você é um especialista em educação e engenharia de conteúdo. Analise este PDF de material didático e extraia o conteúdo estruturado.

Retorne SOMENTE um JSON válido (sem markdown, sem explicações) com o seguinte formato:
{
  "module": {
    "id": "slug-max-20",
    "title": "Título do Módulo",
    "subtitle": "Subtítulo curto (max 100 chars)",
    "subject": "Nome da Disciplina (max 100 chars)",
    "order_index": 1,
    "locked_by_default": false,
    "min_xp": 0
  },
  "lessons": [
    {
      "title": "Título da Lição",
      "intro": "Parágrafo introdutório da lição.",
      "hero_caption": "Frase de destaque curta (opcional)",
      "concepts_title": "Conceitos Chave",
      "applications_title": "Aplicações",
      "footer_cta": "PRÓXIMA PÁGINA",
      "concept_items": [
        { "title": "Nome do Conceito", "description": "Explicação clara.", "latex": "f(x) = x^2" }
      ],
      "concept_examples": [
        { "label": "Exemplo 1", "latex": "\\int_0^1 x dx = \\frac{1}{2}" }
      ],
      "application_items": [
        { "title": "Aplicação Prática", "description": "Contexto de uso real.", "latex": null }
      ]
    }
  ],
  "quiz_questions": [
    {
      "type": "multiple_choice",
      "text": "Pergunta sobre o conteúdo?",
      "options": [
        { "text": "Opção A", "is_correct": false },
        { "text": "Opção B (correta)", "is_correct": true },
        { "text": "Opção C", "is_correct": false },
        { "text": "Opção D", "is_correct": false }
      ]
    }
  ]
}

Regras obrigatórias:
- O campo "id" do módulo deve ser um slug em kebab-case com máximo 20 caracteres (ex: "calculo-1", "fisica-ondas")
- Crie uma lição por seção/capítulo principal do PDF
- Cada lição deve ter entre 2 e 5 concept_items
- Inclua concept_examples apenas quando houver fórmulas ou equações matemáticas relevantes; use array vazio [] se não houver
- Cada lição deve ter entre 2 e 4 application_items
- A ÚLTIMA lição deve ter footer_cta igual a "CONCLUIR MÓDULO"
- Crie entre 5 e 10 quiz_questions de múltipla escolha para o módulo inteiro
- Cada quiz_question deve ter exatamente 4 opções e exatamente 1 com is_correct=true
- Use LaTeX para expressões matemáticas; omita o campo "latex" (ou use null) se não houver matemática
- Todos os textos devem estar em português`;

export async function analyzePdf(buffer: Buffer): Promise<GeminiImportData> {
	const model = genAI.getGenerativeModel({
		model: 'gemini-2.5-flash',
		generationConfig: { responseMimeType: 'application/json' },
	});

	const result = await model.generateContent([
		{ text: PROMPT },
		{
			inlineData: {
				mimeType: 'application/pdf',
				data: buffer.toString('base64'),
			},
		},
	]);

	const raw = result.response.text();
	const parsed = JSON.parse(raw);
	return GeminiResponseSchema.parse(parsed);
}
