-- ============================================================
-- Adicionar coluna subject na tabela modules
-- ============================================================
ALTER TABLE modules ADD COLUMN IF NOT EXISTS subject VARCHAR(100) NOT NULL DEFAULT '';

-- ============================================================
-- Tabela de perguntas do quiz
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    module_id VARCHAR(10) NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('multiple_choice', 'true_false')),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabela de opções/alternativas do quiz
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_options (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Índices
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_quiz_questions_module_id ON quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON quiz_options(question_id);
