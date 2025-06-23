
-- Обновляем вопрос q3 для добавления изображений
UPDATE questions 
SET 
  image_a_url = '/images/detail-test-a.jpg',
  image_b_url = '/images/detail-test-b.jpg'
WHERE question_id = 'q3';
