-- db/sql/populate.sql
-- seed data for the app ui

INSERT INTO users (user_id, email, fname, lname, display_name, password_hash, is_system_admin, created_at)
VALUES
  (1, 'admin@aui.ma', 'System', 'Admin', 'AUI Admin', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', TRUE, NOW()),
  (2, 'adam.mahres@aui.ma', 'Adam', 'Mahres', 'Adam Mahres', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (3, 'mohammed.elmoubaraki@aui.ma', 'Mohammed', 'El Moubaraki', 'Mohammed El Moubaraki', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (4, 'malik.lahlou@aui.ma', 'Mohammed Malik', 'Lahlou', 'Mohammed Malik Lahlou', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (5, 'mouad.ezzahr@aui.ma', 'Mouad', 'Ezzahr', 'Mouad Ezzahr', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (6, 'rayane.fajri@aui.ma', 'Rayane', 'Fajri', 'Rayane Fajri', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW());

INSERT INTO club (club_id, owner_id, name, description, created_at, main_color, status, email, icon_name)
VALUES
  (1, 2, 'Debate Club', 'argument drills, speaking practice, and weekly mini debates.', NOW(), 'BLUE', 'active', 'debate@aui.ma', 'KNOWLEDGE'),
  (2, 3, 'Robotics Club', 'hands-on electronics, sensors, and control systems.', NOW(), 'CYAN', 'active', 'robotics@aui.ma', 'AI_SPARKLES'),
  (3, 4, 'Coding Club', 'project building, competitions, and quick code reviews.', NOW(), 'GREEN', 'active', 'coding@aui.ma', 'CODE_TERMINAL'),
  (4, 5, 'Music Club', 'rehearsals, songwriting, and campus performances.', NOW(), 'RED', 'active', 'music@aui.ma', 'MUSIC_NOTE'),
  (5, 6, 'Sports Club', 'training sessions, matches, and team practice.', NOW(), 'YELLOW', 'active', 'sports@aui.ma', 'FOOTBALL'),
  (6, 1, 'Theater Club', 'stage work, improv, and production prep.', NOW(), 'AMBER', 'active', 'theater@aui.ma', 'THEATER_MASK');

INSERT INTO membership (membership_id, user_id, club_id, joined_at, membership_status, membership_role, invited_by)
VALUES
  (1, 3, 1, NOW(), 'active', 'board_member', 2),
  (2, 4, 1, NOW(), 'active', 'member', 2),
  (3, 2, 2, NOW(), 'active', 'board_member', 3),
  (4, 5, 2, NOW(), 'active', 'member', 3),
  (5, 6, 3, NOW(), 'active', 'board_member', 4),
  (6, 2, 3, NOW(), 'active', 'member', 4),
  (7, 3, 4, NOW(), 'active', 'member', 5),
  (8, 4, 4, NOW(), 'active', 'board_member', 5),
  (9, 5, 5, NOW(), 'active', 'board_member', 6),
  (10, 6, 6, NOW(), 'active', 'member', 1);

INSERT INTO post (post_id, club_id, user_id, title, content, created_at, updated_at, is_deleted)
VALUES
  (1, 1, 2, 'Welcome to Debate Club', 'We will start with opening statements and short rebuttals.', NOW(), NOW(), FALSE),
  (2, 2, 3, 'Robotics kickoff', 'Bring ideas for the first prototype and parts list.', NOW(), NOW(), FALSE),
  (3, 3, 4, 'Coding challenge', 'This week is a small app layout and data wiring sprint.', NOW(), NOW(), FALSE),
  (4, 4, 5, 'Band rehearsal', 'Practice is moved to the media room after classes.', NOW(), NOW(), FALSE),
  (5, 5, 6, 'Training schedule', 'Warm-ups first, then drills, then scrimmage.', NOW(), NOW(), FALSE),
  (6, 6, 1, 'Audition notes', 'Anyone interested can try out after the lunch break.', NOW(), NOW(), FALSE);

INSERT INTO joinrequest (request_id, initiator_user_id, target_club_id, reviewer_user_id, request_type, status, message, created_at, reviewed_at)
VALUES
  (1, 6, 1, 2, 'join', 'approved', 'Would love to help with discussions.', NOW(), NOW()),
  (2, 5, 2, NULL, 'join', 'pending', 'I want to learn sensor wiring and coding.', NOW(), NULL),
  (3, 2, 4, 5, 'join', 'rejected', 'Ask again after the next rehearsal.', NOW(), NOW());
