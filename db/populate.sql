-- db/populate.sql
-- lightweight seed data for the app ui

INSERT INTO users (user_id, email, fname, lname, profile_picture, visibility, is_system_admin, created_at)
VALUES
  (1, 'admin@aui.local', 'system', 'admin', NULL, TRUE, TRUE, NOW()),
  (2, 'clubs@aui.local', 'clubs', 'manager', NULL, TRUE, FALSE, NOW())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO club (club_id, owner_id, name, description, created_at, logo_url, banner_url, main_color, status, deleted_flag, email)
VALUES
  (1, 2, 'Art', 'draw, sketch, and visual experiments.', NOW(), NULL, NULL, 'BLUE', 'active', FALSE, 'art@aui.local'),
  (2, 2, 'Artificial Intelligence', 'ml basics, practical ai, and mini projects.', NOW(), NULL, NULL, 'PURPLE', 'active', FALSE, 'ai@aui.local'),
  (3, 2, 'Music', 'band practice, jam sessions, and event prep.', NOW(), NULL, NULL, 'RED', 'active', FALSE, 'music@aui.local'),
  (4, 2, 'Sports', 'weekly activities and inter-school matches.', NOW(), NULL, NULL, 'YELLOW', 'active', FALSE, 'sports@aui.local'),
  (5, 2, 'Coding', 'build projects and prepare for competitions.', NOW(), NULL, NULL, 'GREEN', 'active', FALSE, 'coding@aui.local'),
  (6, 2, 'Photography', 'photo walks, editing, and storytelling.', NOW(), NULL, NULL, NULL, 'active', FALSE, 'photo@aui.local'),
  (7, 2, 'Chess', 'strategy sessions and internal tournaments.', NOW(), NULL, NULL, 'BLACK', 'active', FALSE, 'chess@aui.local'),
  (8, 2, 'Theater', 'acting practice and stage productions.', NOW(), NULL, NULL, 'AMBER', 'active', FALSE, 'theater@aui.local')
ON CONFLICT (club_id) DO NOTHING;

INSERT INTO club_icon (club_id, icon_key)
VALUES
  (1, 'PAINT_BOARD'),
  (2, 'AI_SPARKLES'),
  (3, 'MUSIC_NOTE'),
  (4, 'FOOTBALL'),
  (5, 'CODE_TERMINAL'),
  (6, 'CAMERA'),
  (7, 'CHESS_KING'),
  (8, 'THEATER_MASK')
ON CONFLICT (club_id) DO UPDATE SET icon_key = EXCLUDED.icon_key;
