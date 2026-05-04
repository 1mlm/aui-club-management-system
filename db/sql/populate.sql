-- db/sql/populate.sql
-- seed data for the app ui

INSERT INTO users (user_id, email, fname, lname, display_name, password_hash, is_system_admin, created_at)
VALUES
  (1, 'admin@aui.ma', 'System', 'Admin', 'AUI Admin', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', TRUE, NOW()),
  (2, 'adam.mahres@aui.ma', 'Adam', 'Mahres', 'Adam Mahres', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (3, 'mohammed.elmoubaraki@aui.ma', 'Mohammed', 'El Moubaraki', 'Mohammed El Moubaraki', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (4, 'malik.lahlou@aui.ma', 'Mohammed Malik', 'Lahlou', 'Mohammed Malik Lahlou', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (5, 'mouad.ezzahr@aui.ma', 'Mouad', 'Ezzahr', 'Mouad Ezzahr', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (6, 'rayane.fajri@aui.ma', 'Rayane', 'Fajri', 'Rayane Fajri', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (7, 'nasser.assem@aui.ma', 'Nasser', 'Assem', 'Nasser Assem', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', TRUE, NOW()),
  (8, 'ahmed.bennani@aui.ma', 'Ahmed', 'Bennani', 'Ahmed Bennani', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (9, 'leila.rachidi@aui.ma', 'Leila', 'Rachidi', 'Leila Rachidi', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (10, 'karim.alaoui@aui.ma', 'Karim', 'Alaoui', 'Karim Alaoui', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (11, 'amal.harkat@aui.ma', 'Amal', 'Harkat', 'Amal Harkat', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (12, 'hassan.boudri@aui.ma', 'Hassan', 'Boudri', 'Hassan Boudri', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (13, 'souad.mezouari@aui.ma', 'Souad', 'Mezouari', 'Souad Mezouari', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (14, 'yasmin.tazi@aui.ma', 'Yasmin', 'Tazi', 'Yasmin Tazi', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (15, 'samir.chakir@aui.ma', 'Samir', 'Chakir', 'Samir Chakir', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (16, 'zainab.boutaleb@aui.ma', 'Zainab', 'Boutaleb', 'Zainab Boutaleb', '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW());

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
  (10, 6, 6, NOW(), 'active', 'member', 1),
  (11, 7, 1, NOW(), 'active', 'member', 2),
  (12, 8, 2, NOW(), 'active', 'member', 3),
  (13, 9, 3, NOW(), 'active', 'board_member', 4),
  (14, 10, 4, NOW(), 'active', 'member', 5),
  (15, 11, 5, NOW(), 'active', 'member', 6),
  (16, 12, 1, NOW(), 'active', 'board_member', 2),
  (17, 13, 2, NOW(), 'active', 'member', 3),
  (18, 14, 3, NOW(), 'active', 'member', 4),
  (19, 15, 4, NOW(), 'active', 'board_member', 5),
  (20, 16, 5, NOW(), 'active', 'member', 6),
  (21, 7, 3, NOW(), 'active', 'member', 4),
  (22, 8, 5, NOW(), 'active', 'board_member', 6),
  (23, 9, 6, NOW(), 'active', 'member', 1),
  (24, 10, 1, NOW(), 'active', 'member', 2),
  (25, 11, 2, NOW(), 'active', 'member', 3);

INSERT INTO post (post_id, club_id, user_id, title, content, created_at, updated_at, is_deleted)
VALUES
  (1, 1, 2, 'Welcome to Debate Club', 'We will start with opening statements and short rebuttals.', NOW(), NOW(), FALSE),
  (2, 2, 3, 'Robotics kickoff', 'Bring ideas for the first prototype and parts list.', NOW(), NOW(), FALSE),
  (3, 3, 4, 'Coding challenge', 'This week is a small app layout and data wiring sprint.', NOW(), NOW(), FALSE),
  (4, 4, 5, 'Band rehearsal', 'Practice is moved to the media room after classes.', NOW(), NOW(), FALSE),
  (5, 5, 6, 'Training schedule', 'Warm-ups first, then drills, then scrimmage.', NOW(), NOW(), FALSE),
  (6, 6, 1, 'Audition notes', 'Anyone interested can try out after the lunch break.', NOW(), NOW(), FALSE),
  (7, 1, 3, 'Debate topic announcement', 'Next week topic: AI ethics and regulation.', NOW(), NOW(), FALSE),
  (8, 2, 8, 'Parts arrived', 'The servo motors and sensors are in. Check the inventory.', NOW(), NOW(), FALSE),
  (9, 3, 9, 'Project deadline extended', 'New deadline: next Friday due to supply delay.', NOW(), NOW(), FALSE),
  (10, 4, 10, 'New song arrangement', 'Check the shared folder for the new chord sheets.', NOW(), NOW(), FALSE),
  (11, 5, 11, 'Match schedule published', 'First match is next Saturday at 2 PM on the field.', NOW(), NOW(), FALSE),
  (12, 6, 9, 'Costume fittings', 'All cast members should come by Friday for fittings.', NOW(), NOW(), FALSE),
  (13, 1, 12, 'Regional competition', 'We qualified! Finals are in two weeks.', NOW(), NOW(), FALSE),
  (14, 2, 13, 'Workshop: Arduino basics', 'Learn programming microcontrollers, all welcome.', NOW(), NOW(), FALSE),
  (15, 3, 7, 'Code review session', 'Bring your code snippets for peer review and feedback.', NOW(), NOW(), FALSE),
  (16, 4, 14, 'Open mic night', 'Come perform, showcase your talent or support your friends.', NOW(), NOW(), FALSE),
  (17, 5, 15, 'Fitness tips', 'Share your training routines and nutrition advice.', NOW(), NOW(), FALSE),
  (18, 6, 16, 'Script selection vote', 'Vote for the next play production, results tomorrow.', NOW(), NOW(), FALSE),
  (19, 1, 4, 'Debate prep session', 'Extra study time this Saturday for interested members.', NOW(), NOW(), FALSE),
  (20, 2, 5, 'Motor testing day', 'Bring all prototypes for speed and load tests.', NOW(), NOW(), FALSE),
  (21, 1, 7, 'Debate Club Meeting Reminder', 'Don''t forget our weekly meeting tomorrow at 4 PM in room 201. We''ll be practicing rebuttal techniques.', NOW(), NOW(), FALSE),
  (22, 2, 2, 'New Robotics Project', 'We''re starting a new autonomous robot project. Anyone interested in computer vision should join us!', NOW(), NOW(), FALSE),
  (23, 3, 13, 'Hackathon Registration Open', 'The inter-university hackathon registration is now open. Teams of 3-4 students. Sign up by Friday!', NOW(), NOW(), FALSE),
  (24, 4, 8, 'Concert Planning', 'We''re organizing our first concert of the semester. Volunteers needed for sound and lighting crew.', NOW(), NOW(), FALSE),
  (25, 5, 9, 'Tournament Registration', 'The annual sports tournament registration is open. Multiple sports categories available.', NOW(), NOW(), FALSE),
  (26, 6, 10, 'New Play Casting', 'Auditions for our new production "Hamlet" will be held next week. All roles available.', NOW(), NOW(), FALSE),
  (27, 1, 11, 'Guest Speaker Event', 'We have a guest speaker from the local debate association coming next month. Save the date!', NOW(), NOW(), FALSE),
  (28, 2, 12, '3D Printing Workshop', 'Free workshop on 3D printing basics. Bring your laptop and ideas!', NOW(), NOW(), FALSE),
  (29, 3, 14, 'Web Development Bootcamp', 'Two-week intensive web development course starting next Monday. Limited spots available.', NOW(), NOW(), FALSE),
  (30, 4, 15, 'Music Theory Session', 'Weekly music theory session every Wednesday. All skill levels welcome.', NOW(), NOW(), FALSE),
  (31, 5, 16, 'Nutrition Workshop', 'Learn about sports nutrition and meal planning for athletes. Free for all members.', NOW(), NOW(), FALSE),
  (32, 6, 7, 'Stage Management Training', 'Training session for anyone interested in stage management and production.', NOW(), NOW(), FALSE);

INSERT INTO joinrequest (request_id, initiator_user_id, target_club_id, reviewer_user_id, request_type, status, message, created_at, reviewed_at)
VALUES
  (1, 6, 1, 2, 'join', 'approved', 'Would love to help with discussions.', NOW(), NOW()),
  (2, 5, 2, NULL, 'join', 'pending', 'I want to learn sensor wiring and coding.', NOW(), NULL),
  (3, 2, 4, 5, 'join', 'rejected', 'Ask again after the next rehearsal.', NOW(), NOW()),
  (4, 7, 4, 5, 'join', 'approved', 'Very interested in music and performance.', NOW(), NOW()),
  (5, 9, 1, 2, 'join', 'pending', 'Love debate and critical thinking.', NOW(), NULL),
  (6, 10, 5, 6, 'join', 'approved', 'Athlete looking to join the team.', NOW(), NOW()),
  (7, 11, 6, 1, 'join', 'pending', 'Drama and theater are my passion.', NOW(), NULL),
  (8, 12, 3, 4, 'join', 'approved', 'Software developer interested in coding projects.', NOW(), NOW()),
  (9, 13, 2, 3, 'join', 'rejected', 'We need more hands-on experience, try next term.', NOW(), NOW()),
  (10, 14, 1, 2, 'join', 'pending', 'Want to improve my public speaking.', NOW(), NULL),
  (11, 15, 4, 5, 'join', 'approved', 'Guitarist looking for a band.', NOW(), NOW()),
  (12, 16, 5, 6, 'join', 'approved', 'Competitive athlete, very committed.', NOW(), NOW()),
  (13, 8, 6, 1, 'join', 'pending', 'Interest in stage production and design.', NOW(), NULL),
  (14, 9, 4, 5, 'join', 'rejected', 'Vocalist, but schedule conflicts with rehearsals.', NOW(), NOW()),
  (15, 12, 2, 3, 'join', 'pending', 'Electronics hobbyist, eager to learn.', NOW(), NULL);


