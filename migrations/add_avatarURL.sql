-- Міграція для додавання поля avatarURL до таблиці users
-- Виконувати тільки якщо поле ще не існує

-- Додати колонку avatarURL якщо її немає
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='avatarURL'
  ) THEN
    ALTER TABLE users ADD COLUMN "avatarURL" VARCHAR(255);
  END IF;
END $$;

-- Оновити існуючих користувачів, які не мають avatarURL
-- Згенерувати Gravatar для них на основі email
UPDATE users 
SET "avatarURL" = CONCAT('//www.gravatar.com/avatar/', MD5(LOWER(TRIM(email))), '?s=200&r=pg&d=mp')
WHERE "avatarURL" IS NULL;
