-- db/query.sql
-- extra db constraints and structures used by the app after create.sql is applied

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'club_color_enum') THEN
    CREATE TYPE club_color_enum AS ENUM (
      'BLUE',
      'BLACK',
      'RED',
      'GREEN',
      'AMBER',
      'ORANGE',
      'YELLOW',
      'CYAN',
      'PINK',
      'PURPLE'
    );
  END IF;
END
$$;

ALTER TABLE club
  ALTER COLUMN main_color TYPE club_color_enum
  USING (
    CASE
      WHEN main_color IS NULL OR btrim(main_color) = '' THEN NULL
      ELSE UPPER(main_color)::club_color_enum
    END
  );

CREATE TABLE IF NOT EXISTS club_icon (
  club_id INT PRIMARY KEY,
  icon_key VARCHAR(40),
  CONSTRAINT fk_club_icon_club FOREIGN KEY (club_id) REFERENCES club (club_id) ON DELETE CASCADE,
  CONSTRAINT chk_club_icon_key CHECK (
    icon_key IS NULL OR icon_key IN (
      'ADVENTURE',
      'AI_SPARKLES',
      'CAMERA',
      'CHESS_KING',
      'CODE_TERMINAL',
      'COOKBOOK',
      'FOOTBALL',
      'KNOWLEDGE',
      'LAUREL_WREATH',
      'MUSIC_NOTE',
      'PAINT_BOARD',
      'SUPER_MARIO',
      'TENNIS_RACKET',
      'THEATER_MASK'
    )
  )
);
