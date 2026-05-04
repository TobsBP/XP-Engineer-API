-- Módulo 0: Matemática Básica
INSERT INTO quiz_questions (module_id, type, text) VALUES
('0', 'multiple_choice', 'Qual é o resultado de 3² + 4²?'),
('0', 'multiple_choice', 'Qual é a derivada de f(x) = 2x³?'),
('0', 'true_false', 'O número π é um número racional.'),
('0', 'multiple_choice', 'Qual é o valor de sen(90°)?'),
('0', 'true_false', 'A raiz quadrada de 144 é 12.');

-- Módulo 1: Fundamentos de Estática
INSERT INTO quiz_questions (module_id, type, text) VALUES
('1', 'multiple_choice', 'Qual é a condição para equilíbrio estático de um corpo?'),
('1', 'multiple_choice', 'O que é um diagrama de corpo livre?'),
('1', 'true_false', 'Um corpo em equilíbrio estático pode ter aceleração diferente de zero.'),
('1', 'multiple_choice', 'Qual é a unidade de força no Sistema Internacional?'),
('1', 'true_false', 'O momento de uma força é um vetor perpendicular ao plano que contém a força e o braço.');

-- Módulo 2: Termodinâmica Aplicada
INSERT INTO quiz_questions (module_id, type, text) VALUES
('2', 'multiple_choice', 'O que afirma a primeira lei da termodinâmica?'),
('2', 'multiple_choice', 'Em um processo isotérmico, o que permanece constante?'),
('2', 'true_false', 'A entropia de um sistema isolado nunca diminui.'),
('2', 'multiple_choice', 'Qual é a eficiência máxima de uma máquina térmica operando entre duas temperaturas?'),
('2', 'true_false', 'É possível construir uma máquina térmica com 100% de eficiência.');

-- Módulo 3: Dinâmica de Fluidos
INSERT INTO quiz_questions (module_id, type, text) VALUES
('3', 'multiple_choice', 'O que o princípio de Bernoulli relaciona?'),
('3', 'multiple_choice', 'O que o número de Reynolds indica?'),
('3', 'true_false', 'Um fluido incompressível tem densidade constante.'),
('3', 'multiple_choice', 'Qual equação expressa a conservação de massa em fluidos?'),
('3', 'true_false', 'Em um escoamento turbulento, as linhas de corrente são paralelas e organizadas.');

-- Módulo 4: Integridade Estrutural
INSERT INTO quiz_questions (module_id, type, text) VALUES
('4', 'multiple_choice', 'O que é tensão de escoamento?'),
('4', 'multiple_choice', 'Qual ensaio é mais utilizado para determinar as propriedades mecânicas de um material?'),
('4', 'true_false', 'A fadiga pode causar falha em um material mesmo sob tensões abaixo do limite de escoamento.'),
('4', 'multiple_choice', 'O que é o fator de concentração de tensão?'),
('4', 'true_false', 'Materiais dúcteis rompem sem deformação plástica significativa.');

-- Módulo 5: Matemática Básica II
INSERT INTO quiz_questions (module_id, type, text) VALUES
('5', 'multiple_choice', 'Qual é a integral de ∫2x dx?'),
('5', 'multiple_choice', 'Qual é o determinante da matriz [[1,2],[3,4]]?'),
('5', 'true_false', 'Toda matriz quadrada possui inversa.'),
('5', 'multiple_choice', 'Qual é a solução da equação diferencial dy/dx = y?'),
('5', 'true_false', 'A série harmônica (1 + 1/2 + 1/3 + ...) converge.');

-- ============================================================
-- OPÇÕES
-- ============================================================

-- Módulo 0: Matemática Básica

-- Pergunta 1: 3² + 4² = 25
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(1, '7', false),
(1, '25', true),
(1, '12', false),
(1, '49', false);

-- Pergunta 2: derivada de 2x³ = 6x²
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(2, '6x²', true),
(2, '6x³', false),
(2, '2x²', false),
(2, '3x²', false);

-- Pergunta 3: π é racional (falso)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(3, 'Verdadeiro', false),
(3, 'Falso', true);

-- Pergunta 4: sen(90°) = 1
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(4, '0', false),
(4, '1', true),
(4, '0,5', false),
(4, '-1', false);

-- Pergunta 5: √144 = 12 (verdadeiro)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(5, 'Verdadeiro', true),
(5, 'Falso', false);

-- Módulo 1: Fundamentos de Estática

-- Pergunta 6: condição de equilíbrio
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(6, 'Soma das forças e momentos igual a zero', true),
(6, 'Velocidade constante', false),
(6, 'Aceleração constante', false),
(6, 'Energia cinética nula', false);

-- Pergunta 7: diagrama de corpo livre
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(7, 'Representação de todas as forças externas atuando sobre um corpo isolado', true),
(7, 'Desenho técnico de uma estrutura', false),
(7, 'Gráfico de deformação vs tensão', false),
(7, 'Esquema de montagem de uma máquina', false);

-- Pergunta 8: equilíbrio com aceleração (falso)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(8, 'Verdadeiro', false),
(8, 'Falso', true);

-- Pergunta 9: unidade de força no SI
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(9, 'Newton (N)', true),
(9, 'Pascal (Pa)', false),
(9, 'Joule (J)', false),
(9, 'Watt (W)', false);

-- Pergunta 10: momento é perpendicular (verdadeiro)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(10, 'Verdadeiro', true),
(10, 'Falso', false);

-- Módulo 2: Termodinâmica Aplicada

-- Pergunta 11: primeira lei
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(11, 'Energia não pode ser criada nem destruída, apenas transformada', true),
(11, 'Entropia sempre aumenta', false),
(11, 'Calor flui do quente para o frio', false),
(11, 'Todo sistema tende ao zero absoluto', false);

-- Pergunta 12: processo isotérmico
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(12, 'Temperatura', true),
(12, 'Pressão', false),
(12, 'Volume', false),
(12, 'Entropia', false);

-- Pergunta 13: entropia nunca diminui (verdadeiro)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(13, 'Verdadeiro', true),
(13, 'Falso', false);

-- Pergunta 14: eficiência máxima
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(14, 'Eficiência de Carnot: 1 - T_frio/T_quente', true),
(14, '100% sempre', false),
(14, 'Depende apenas da pressão', false),
(14, '50% em qualquer caso', false);

-- Pergunta 15: máquina 100% eficiente (falso)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(15, 'Verdadeiro', false),
(15, 'Falso', true);

-- Módulo 3: Dinâmica de Fluidos

-- Pergunta 16: princípio de Bernoulli
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(16, 'Pressão, velocidade e altura em um escoamento', true),
(16, 'Apenas pressão e temperatura', false),
(16, 'Massa e aceleração', false),
(16, 'Viscosidade e densidade', false);

-- Pergunta 17: número de Reynolds
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(17, 'Se o escoamento é laminar ou turbulento', true),
(17, 'A temperatura do fluido', false),
(17, 'A pressão absoluta', false),
(17, 'A compressibilidade do fluido', false);

-- Pergunta 18: fluido incompressível (verdadeiro)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(18, 'Verdadeiro', true),
(18, 'Falso', false);

-- Pergunta 19: conservação de massa
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(19, 'Equação da continuidade', true),
(19, 'Equação de Navier-Stokes', false),
(19, 'Equação de Euler', false),
(19, 'Equação de Laplace', false);

-- Pergunta 20: escoamento turbulento organizado (falso)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(20, 'Verdadeiro', false),
(20, 'Falso', true);

-- Módulo 4: Integridade Estrutural

-- Pergunta 21: tensão de escoamento
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(21, 'Tensão a partir da qual o material sofre deformação permanente', true),
(21, 'Tensão máxima antes da ruptura', false),
(21, 'Tensão que causa vibração', false),
(21, 'Tensão térmica no material', false);

-- Pergunta 22: ensaio mais utilizado
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(22, 'Ensaio de tração', true),
(22, 'Ensaio de impacto', false),
(22, 'Ensaio de dureza', false),
(22, 'Ensaio de fluência', false);

-- Pergunta 23: fadiga abaixo do escoamento (verdadeiro)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(23, 'Verdadeiro', true),
(23, 'Falso', false);

-- Pergunta 24: fator de concentração de tensão
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(24, 'Razão entre a tensão máxima local e a tensão nominal', true),
(24, 'Coeficiente de segurança da estrutura', false),
(24, 'Fator de correção térmica', false),
(24, 'Índice de resistência à corrosão', false);

-- Pergunta 25: dúcteis sem deformação plástica (falso)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(25, 'Verdadeiro', false),
(25, 'Falso', true);

-- Módulo 5: Matemática Básica II

-- Pergunta 26: integral de 2x
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(26, 'x² + C', true),
(26, '2x² + C', false),
(26, 'x + C', false),
(26, '2 + C', false);

-- Pergunta 27: determinante [[1,2],[3,4]]
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(27, '-2', true),
(27, '2', false),
(27, '10', false),
(27, '-10', false);

-- Pergunta 28: toda matriz quadrada tem inversa (falso)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(28, 'Verdadeiro', false),
(28, 'Falso', true);

-- Pergunta 29: dy/dx = y
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(29, 'y = Ce^x', true),
(29, 'y = x²', false),
(29, 'y = ln(x)', false),
(29, 'y = sen(x)', false);

-- Pergunta 30: série harmônica converge (falso)
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(30, 'Verdadeiro', false),
(30, 'Falso', true);
