
-- Очистим существующие вопросы
DELETE FROM questions;

-- Добавим реальные вопросы для тестирования
INSERT INTO questions (question_id, module, type, title_key, text_key, options, correct_answer, max_score) VALUES
-- Системное мышление
('q1', 'systematicThinking', 'mcq', 'q1.title', 'q1.text', 
 '[{"key": "a", "textKey": "q1.a", "score": 10}, {"key": "b", "textKey": "q1.b", "score": 0}, {"key": "c", "textKey": "q1.c", "score": 0}, {"key": "d", "textKey": "q1.d", "score": 0}]', 
 'a', 10),

('q2', 'systematicThinking', 'mcq', 'q2.title', 'q2.text', 
 '[{"key": "a", "textKey": "q2.a", "score": 0}, {"key": "b", "textKey": "q2.b", "score": 10}, {"key": "c", "textKey": "q2.c", "score": 0}, {"key": "d", "textKey": "q2.d", "score": 0}]', 
 'b', 10),

-- Внимание к деталям
('q3', 'attentionToDetail', 'image', 'q3.title', 'q3.text', 
 '[{"key": "a", "textKey": "q3.a", "score": 0}, {"key": "b", "textKey": "q3.b", "score": 0}, {"key": "c", "textKey": "q3.c", "score": 10}, {"key": "d", "textKey": "q3.d", "score": 0}]', 
 'c', 10),

-- Работоспособность
('q4', 'workCapacity', 'mcq', 'q4.title', 'q4.text', 
 '[{"key": "a", "textKey": "q4.a", "score": 0}, {"key": "b", "textKey": "q4.b", "score": 10}, {"key": "c", "textKey": "q4.c", "score": 0}, {"key": "d", "textKey": "q4.d", "score": 0}]', 
 'b', 10),

('q5', 'workCapacity', 'mcq', 'q5.title', 'q5.text', 
 '[{"key": "a", "textKey": "q5.a", "score": 10}, {"key": "b", "textKey": "q5.b", "score": 0}, {"key": "c", "textKey": "q5.c", "score": 0}, {"key": "d", "textKey": "q5.d", "score": 0}]', 
 'a', 10),

-- Честность и этика
('q6', 'honesty', 'mcq', 'q6.title', 'q6.text', 
 '[{"key": "a", "textKey": "q6.a", "score": 0}, {"key": "b", "textKey": "q6.b", "score": 5}, {"key": "c", "textKey": "q6.c", "score": 10}, {"key": "d", "textKey": "q6.d", "score": 7}]', 
 'c', 10),

('q7', 'honesty', 'mcq', 'q7.title', 'q7.text', 
 '[{"key": "a", "textKey": "q7.a", "score": 3}, {"key": "b", "textKey": "q7.b", "score": 10}, {"key": "c", "textKey": "q7.c", "score": 5}, {"key": "d", "textKey": "q7.d", "score": 0}]', 
 'b', 10),

-- Мышление роста
('q8', 'growthMindset', 'likert', 'q8.title', 'q8.text', 
 '[{"key": "a", "textKey": "q8.a", "score": 0}, {"key": "b", "textKey": "q8.b", "score": 3}, {"key": "c", "textKey": "q8.c", "score": 7}, {"key": "d", "textKey": "q8.d", "score": 10}]', 
 'd', 10),

-- Командная работа
('q9', 'teamCommitment', 'mcq', 'q9.title', 'q9.text', 
 '[{"key": "a", "textKey": "q9.a", "score": 3}, {"key": "b", "textKey": "q9.b", "score": 10}, {"key": "c", "textKey": "q9.c", "score": 5}, {"key": "d", "textKey": "q9.d", "score": 0}]', 
 'b', 10),

-- Адаптивность и стрессоустойчивость
('q10', 'adaptability', 'mcq', 'q10.title', 'q10.text', 
 '[{"key": "a", "textKey": "q10.a", "score": 0}, {"key": "b", "textKey": "q10.b", "score": 10}, {"key": "c", "textKey": "q10.c", "score": 7}, {"key": "d", "textKey": "q10.d", "score": 0}]', 
 'b', 10),

-- Креативность (только для творческого трека)
('q11', 'creativity', 'mcq', 'q11.title', 'q11.text', 
 '[{"key": "a", "textKey": "q11.a", "score": 7}, {"key": "b", "textKey": "q11.b", "score": 5}, {"key": "c", "textKey": "q11.c", "score": 8}, {"key": "d", "textKey": "q11.d", "score": 10}]', 
 'd', 10);
