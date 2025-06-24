
-- Добавляем более сложные вопросы для улучшения дифференциации кандидатов

-- Удаляем старые простые вопросы
DELETE FROM questions;

-- Системное мышление (более сложные логические задачи)
INSERT INTO questions (question_id, module, type, title_key, text_key, options, correct_answer, max_score) VALUES
('st1', 'systematicThinking', 'mcq', 'st1.title', 'st1.text', 
 '[{"key": "a", "textKey": "st1.a", "score": 2}, {"key": "b", "textKey": "st1.b", "score": 10}, {"key": "c", "textKey": "st1.c", "score": 0}, {"key": "d", "textKey": "st1.d", "score": 4}]', 
 'b', 10),

('st2', 'systematicThinking', 'mcq', 'st2.title', 'st2.text', 
 '[{"key": "a", "textKey": "st2.a", "score": 3}, {"key": "b", "textKey": "st2.b", "score": 0}, {"key": "c", "textKey": "st2.c", "score": 10}, {"key": "d", "textKey": "st2.d", "score": 1}]', 
 'c', 10),

('st3', 'systematicThinking', 'mcq', 'st3.title', 'st3.text', 
 '[{"key": "a", "textKey": "st3.a", "score": 0}, {"key": "b", "textKey": "st3.b", "score": 5}, {"key": "c", "textKey": "st3.c", "score": 2}, {"key": "d", "textKey": "st3.d", "score": 10}]', 
 'd', 10),

-- Внимание к деталям (усложненные задачи)
('ad1', 'attentionToDetail', 'mcq', 'ad1.title', 'ad1.text', 
 '[{"key": "a", "textKey": "ad1.a", "score": 1}, {"key": "b", "textKey": "ad1.b", "score": 10}, {"key": "c", "textKey": "ad1.c", "score": 0}, {"key": "d", "textKey": "ad1.d", "score": 3}]', 
 'b', 10),

('ad2', 'attentionToDetail', 'image', 'ad2.title', 'ad2.text', 
 '[{"key": "a", "textKey": "ad2.a", "score": 2}, {"key": "b", "textKey": "ad2.b", "score": 0}, {"key": "c", "textKey": "ad2.c", "score": 10}, {"key": "d", "textKey": "ad2.d", "score": 1}]', 
 'c', 10),

-- Работоспособность (математические и аналитические задачи)
('wc1', 'workCapacity', 'mcq', 'wc1.title', 'wc1.text', 
 '[{"key": "a", "textKey": "wc1.a", "score": 0}, {"key": "b", "textKey": "wc1.b", "score": 3}, {"key": "c", "textKey": "wc1.c", "score": 10}, {"key": "d", "textKey": "wc1.d", "score": 1}]', 
 'c', 10),

('wc2', 'workCapacity', 'mcq', 'wc2.title', 'wc2.text', 
 '[{"key": "a", "textKey": "wc2.a", "score": 10}, {"key": "b", "textKey": "wc2.b", "score": 2}, {"key": "c", "textKey": "wc2.c", "score": 0}, {"key": "d", "textKey": "wc2.d", "score": 4}]', 
 'a', 10),

('wc3', 'workCapacity', 'mcq', 'wc3.title', 'wc3.text', 
 '[{"key": "a", "textKey": "wc3.a", "score": 1}, {"key": "b", "textKey": "wc3.b", "score": 0}, {"key": "c", "textKey": "wc3.c", "score": 5}, {"key": "d", "textKey": "wc3.d", "score": 10}]', 
 'd', 10),

-- Честность и этика (сложные моральные дилеммы)
('hn1', 'honesty', 'mcq', 'hn1.title', 'hn1.text', 
 '[{"key": "a", "textKey": "hn1.a", "score": 2}, {"key": "b", "textKey": "hn1.b", "score": 7}, {"key": "c", "textKey": "hn1.c", "score": 10}, {"key": "d", "textKey": "hn1.d", "score": 0}]', 
 'c', 10),

('hn2', 'honesty', 'mcq', 'hn2.title', 'hn2.text', 
 '[{"key": "a", "textKey": "hn2.a", "score": 0}, {"key": "b", "textKey": "hn2.b", "score": 10}, {"key": "c", "textKey": "hn2.c", "score": 3}, {"key": "d", "textKey": "hn2.d", "score": 5}]', 
 'b', 10),

('hn3', 'honesty', 'mcq', 'hn3.title', 'hn3.text', 
 '[{"key": "a", "textKey": "hn3.a", "score": 8}, {"key": "b", "textKey": "hn3.b", "score": 2}, {"key": "c", "textKey": "hn3.c", "score": 10}, {"key": "d", "textKey": "hn3.d", "score": 0}]', 
 'c', 10),

-- Мышление роста (более глубокие вопросы)
('gm1', 'growthMindset', 'likert', 'gm1.title', 'gm1.text', 
 '[{"key": "a", "textKey": "gm1.a", "score": 0}, {"key": "b", "textKey": "gm1.b", "score": 3}, {"key": "c", "textKey": "gm1.c", "score": 7}, {"key": "d", "textKey": "gm1.d", "score": 10}]', 
 'd', 10),

('gm2', 'growthMindset', 'mcq', 'gm2.title', 'gm2.text', 
 '[{"key": "a", "textKey": "gm2.a", "score": 2}, {"key": "b", "textKey": "gm2.b", "score": 10}, {"key": "c", "textKey": "gm2.c", "score": 5}, {"key": "d", "textKey": "gm2.d", "score": 0}]', 
 'b', 10),

-- Командная работа (сложные ситуации)
('tc1', 'teamCommitment', 'mcq', 'tc1.title', 'tc1.text', 
 '[{"key": "a", "textKey": "tc1.a", "score": 1}, {"key": "b", "textKey": "tc1.b", "score": 10}, {"key": "c", "textKey": "tc1.c", "score": 4}, {"key": "d", "textKey": "tc1.d", "score": 0}]', 
 'b', 10),

('tc2', 'teamCommitment', 'mcq', 'tc2.title', 'tc2.text', 
 '[{"key": "a", "textKey": "tc2.a", "score": 0}, {"key": "b", "textKey": "tc2.b", "score": 5}, {"key": "c", "textKey": "tc2.c", "score": 10}, {"key": "d", "textKey": "tc2.d", "score": 2}]', 
 'c', 10),

-- Адаптивность и стрессоустойчивость (сложные сценарии)
('ad1', 'adaptability', 'mcq', 'ad1.title', 'ad1.text', 
 '[{"key": "a", "textKey": "ad1.a", "score": 3}, {"key": "b", "textKey": "ad1.b", "score": 10}, {"key": "c", "textKey": "ad1.c", "score": 0}, {"key": "d", "textKey": "ad1.d", "score": 6}]', 
 'b', 10),

('ad2', 'adaptability', 'mcq', 'ad2.title', 'ad2.text', 
 '[{"key": "a", "textKey": "ad2.a", "score": 0}, {"key": "b", "textKey": "ad2.b", "score": 2}, {"key": "c", "textKey": "c", "score": 10}, {"key": "d", "textKey": "ad2.d", "score": 5}]', 
 'c', 10),

-- Креативность (более сложные творческие задачи)
('cr1', 'creativity', 'mcq', 'cr1.title', 'cr1.text', 
 '[{"key": "a", "textKey": "cr1.a", "score": 3}, {"key": "b", "textKey": "cr1.b", "score": 10}, {"key": "c", "textKey": "cr1.c", "score": 7}, {"key": "d", "textKey": "cr1.d", "score": 1}]', 
 'b', 10),

('cr2', 'creativity', 'mcq', 'cr2.title', 'cr2.text', 
 '[{"key": "a", "textKey": "cr2.a", "score": 5}, {"key": "b", "textKey": "cr2.b", "score": 0}, {"key": "c", "textKey": "cr2.c", "score": 10}, {"key": "d", "textKey": "cr2.d", "score": 2}]', 
 'c', 10),

('cr3', 'creativity', 'mcq', 'cr3.title', 'cr3.text', 
 '[{"key": "a", "textKey": "cr3.a", "score": 2}, {"key": "b", "textKey": "cr3.b", "score": 8}, {"key": "c", "textKey": "cr3.c", "score": 10}, {"key": "d", "textKey": "cr3.d", "score": 4}]', 
 'c', 10);

-- Обновляем изображения для вопросов на внимание к деталям
UPDATE questions 
SET 
  image_a_url = '/images/detail-test-a.jpg',
  image_b_url = '/images/detail-test-b.jpg'
WHERE question_id = 'ad2';
