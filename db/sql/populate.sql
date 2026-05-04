-- db/sql/populate.sql
-- seed data for the app ui

INSERT INTO users (user_id, email, fname, lname, display_name, password_hash, is_system_admin, created_at)
VALUES
  (1,  'admin@aui.ma',               'System',         'Admin',       'AUI Admin',              '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', TRUE,  NOW()),
  (2,  'adam.mahres@aui.ma',          'Adam',           'Mahres',      'Adam Mahres',             '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (3,  'mohammed.elmoubaraki@aui.ma', 'Mohammed',       'El Moubaraki','Mohammed El Moubaraki',   '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (4,  'malik.lahlou@aui.ma',         'Mohammed Malik', 'Lahlou',      'Mohammed Malik Lahlou',   '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (5,  'mouad.ezzahr@aui.ma',         'Mouad',          'Ezzahr',      'Mouad Ezzahr',            '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (6,  'rayane.fajri@aui.ma',         'Rayane',         'Fajri',       'Rayane Fajri',            '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (7,  'nasser.assem@aui.ma',         'Nasser',         'Assem',       'Nasser Assem',            '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', TRUE,  NOW()),
  (8,  'ahmed.bennani@aui.ma',        'Ahmed',          'Bennani',     'Ahmed Bennani',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (9,  'leila.rachidi@aui.ma',        'Leila',          'Rachidi',     'Leila Rachidi',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (10, 'karim.alaoui@aui.ma',         'Karim',          'Alaoui',      'Karim Alaoui',            '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (11, 'amal.harkat@aui.ma',          'Amal',           'Harkat',      'Amal Harkat',             '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (12, 'hassan.boudri@aui.ma',        'Hassan',         'Boudri',      'Hassan Boudri',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (13, 'souad.mezouari@aui.ma',       'Souad',          'Mezouari',    'Souad Mezouari',          '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (14, 'yasmin.tazi@aui.ma',          'Yasmin',         'Tazi',        'Yasmin Tazi',             '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (15, 'samir.chakir@aui.ma',         'Samir',          'Chakir',      'Samir Chakir',            '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (16, 'zainab.boutaleb@aui.ma',      'Zainab',         'Boutaleb',    'Zainab Boutaleb',         '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (17, 'omar.benali@aui.ma',          'Omar',           'Benali',      'Omar Benali',             '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (18, 'fatima.zahra@aui.ma',         'Fatima',         'Zahra',       'Fatima Zahra',            '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (19, 'youssef.hamid@aui.ma',        'Youssef',        'Hamid',       'Youssef Hamid',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (20, 'hind.mansouri@aui.ma',        'Hind',           'Mansouri',    'Hind Mansouri',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (21, 'amine.berrada@aui.ma',        'Amine',          'Berrada',     'Amine Berrada',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (22, 'salma.idrissi@aui.ma',        'Salma',          'Idrissi',     'Salma Idrissi',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (23, 'hamza.filali@aui.ma',         'Hamza',          'Filali',      'Hamza Filali',            '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (24, 'nadia.benhida@aui.ma',        'Nadia',          'Benhida',     'Nadia Benhida',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (25, 'tariq.ouazzani@aui.ma',       'Tariq',          'Ouazzani',    'Tariq Ouazzani',          '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW()),
  (26, 'rim.cherkaoui@aui.ma',        'Rim',            'Cherkaoui',   'Rim Cherkaoui',           '$2b$12$7Wkg.5n/T9ey2eTv38Q83u1ItHR2gm3jnjGGttvWm216/7vgfQuPC', FALSE, NOW());

INSERT INTO club (club_id, owner_id, name, description, created_at, main_color, status, email, icon_name)
VALUES
  (1, 2, 'Debate Club',    'argument drills, speaking practice, and weekly mini debates.',  NOW(), 'BLUE',   'active', 'debate@aui.ma',    'KNOWLEDGE'),
  (2, 3, 'Robotics Club',  'hands-on electronics, sensors, and control systems.',           NOW(), 'CYAN',   'active', 'robotics@aui.ma',  'AI_SPARKLES'),
  (3, 4, 'Coding Club',    'project building, competitions, and quick code reviews.',       NOW(), 'GREEN',  'active', 'coding@aui.ma',    'CODE_TERMINAL'),
  (4, 5, 'Music Club',     'rehearsals, songwriting, and campus performances.',             NOW(), 'RED',    'active', 'music@aui.ma',     'MUSIC_NOTE'),
  (5, 6, 'Sports Club',    'training sessions, matches, and team practice.',               NOW(), 'YELLOW', 'active', 'sports@aui.ma',    'FOOTBALL'),
  (6, 1, 'Theater Club',   'stage work, improv, and production prep.',                     NOW(), 'AMBER',  'active', 'theater@aui.ma',   'THEATER_MASK');

INSERT INTO membership (membership_id, user_id, club_id, joined_at, membership_status, membership_role, invited_by)
VALUES
  -- Debate Club (1) — owner: Adam Mahres (2) — board: Mohammed El Moubaraki (3)
  (1,  3,  1, NOW(), 'active', 'board_member', 2),
  (2,  4,  1, NOW(), 'active', 'member',       2),
  (11, 7,  1, NOW(), 'active', 'member',       2),
  (16, 12, 1, NOW(), 'active', 'member',       2),
  (24, 10, 1, NOW(), 'active', 'member',       2),
  (26, 17, 1, NOW(), 'active', 'member',       2),
  (27, 18, 1, NOW(), 'active', 'member',       2),

  -- Robotics Club (2) — owner: Mohammed El Moubaraki (3) — board: Adam Mahres (2)
  (3,  2,  2, NOW(), 'active', 'board_member', 3),
  (4,  5,  2, NOW(), 'active', 'member',       3),
  (12, 8,  2, NOW(), 'active', 'member',       3),
  (17, 13, 2, NOW(), 'active', 'member',       3),
  (25, 11, 2, NOW(), 'active', 'member',       3),
  (28, 19, 2, NOW(), 'active', 'member',       3),
  (29, 20, 2, NOW(), 'active', 'member',       3),

  -- Coding Club (3) — owner: Mohammed Malik Lahlou (4) — board: Rayane Fajri (6)
  (5,  6,  3, NOW(), 'active', 'board_member', 4),
  (6,  2,  3, NOW(), 'active', 'member',       4),
  (13, 9,  3, NOW(), 'active', 'member',       4),
  (18, 14, 3, NOW(), 'active', 'member',       4),
  (21, 7,  3, NOW(), 'active', 'member',       4),
  (30, 21, 3, NOW(), 'active', 'member',       4),
  (31, 22, 3, NOW(), 'active', 'member',       4),

  -- Music Club (4) — owner: Mouad Ezzahr (5) — board: Mohammed Malik Lahlou (4)
  (7,  3,  4, NOW(), 'active', 'member',       5),
  (8,  4,  4, NOW(), 'active', 'board_member', 5),
  (14, 10, 4, NOW(), 'active', 'member',       5),
  (19, 15, 4, NOW(), 'active', 'member',       5),
  (32, 23, 4, NOW(), 'active', 'member',       5),
  (33, 24, 4, NOW(), 'active', 'member',       5),
  (34, 17, 4, NOW(), 'active', 'member',       5),

  -- Sports Club (5) — owner: Rayane Fajri (6) — board: Mouad Ezzahr (5)
  (9,  5,  5, NOW(), 'active', 'board_member', 6),
  (15, 11, 5, NOW(), 'active', 'member',       6),
  (20, 16, 5, NOW(), 'active', 'member',       6),
  (22, 8,  5, NOW(), 'active', 'member',       6),
  (35, 25, 5, NOW(), 'active', 'member',       6),
  (36, 26, 5, NOW(), 'active', 'member',       6),
  (37, 18, 5, NOW(), 'active', 'member',       6),

  -- Theater Club (6) — owner: AUI Admin (1) — board: Rayane Fajri (6)
  (10, 6,  6, NOW(), 'active', 'board_member', 1),
  (23, 9,  6, NOW(), 'active', 'member',       1),
  (38, 20, 6, NOW(), 'active', 'member',       1),
  (39, 22, 6, NOW(), 'active', 'member',       1),
  (40, 24, 6, NOW(), 'active', 'member',       1),
  (41, 26, 6, NOW(), 'active', 'member',       1);

INSERT INTO post (post_id, club_id, user_id, title, content, created_at, updated_at, is_deleted)
VALUES
  -- Debate Club
  (1,  1, 2,  'Welcome to Debate Club',        'We will start with opening statements and short rebuttals.',            NOW(), NOW(), FALSE),
  (7,  1, 3,  'Debate topic announcement',      'Next week topic: AI ethics and regulation.',                           NOW(), NOW(), FALSE),
  (13, 1, 12, 'Regional competition',           'We qualified! Finals are in two weeks.',                               NOW(), NOW(), FALSE),
  (19, 1, 4,  'Debate prep session',            'Extra study time this Saturday for interested members.',               NOW(), NOW(), FALSE),
  (21, 1, 2,  'New debate format',              'We are switching to British Parliamentary style next semester.',       NOW(), NOW(), FALSE),
  (22, 1, 17, 'Feedback from last round',       'Great improvement on rebuttals. Work on evidence citations.',          NOW(), NOW(), FALSE),
  (23, 1, 3,  'Speaker ranking update',         'Rankings posted in the group chat. Practice continues Friday.',        NOW(), NOW(), FALSE),

  -- Robotics Club
  (2,  2, 3,  'Robotics kickoff',               'Bring ideas for the first prototype and parts list.',                  NOW(), NOW(), FALSE),
  (8,  2, 8,  'Parts arrived',                  'The servo motors and sensors are in. Check the inventory.',           NOW(), NOW(), FALSE),
  (14, 2, 13, 'Workshop: Arduino basics',       'Learn programming microcontrollers, all welcome.',                    NOW(), NOW(), FALSE),
  (20, 2, 5,  'Motor testing day',              'Bring all prototypes for speed and load tests.',                       NOW(), NOW(), FALSE),
  (24, 2, 19, 'Sensor calibration session',     'We''ll go over IR and ultrasonic sensors this Thursday.',             NOW(), NOW(), FALSE),
  (25, 2, 3,  'Competition team selected',      'Five members will represent AUI at the regional robotics challenge.',  NOW(), NOW(), FALSE),
  (26, 2, 8,  'Battery management notes',       'Use only approved Li-Po packs. Charging station is in room B12.',     NOW(), NOW(), FALSE),
  (27, 2, 20, 'Soldering workshop recap',       'Thanks everyone who attended. Notes are on the shared drive.',        NOW(), NOW(), FALSE),

  -- Coding Club
  (3,  3, 4,  'Coding challenge',               'This week is a small app layout and data wiring sprint.',              NOW(), NOW(), FALSE),
  (9,  3, 9,  'Project deadline extended',      'New deadline: next Friday due to supply delay.',                       NOW(), NOW(), FALSE),
  (15, 3, 7,  'Code review session',            'Bring your code snippets for peer review and feedback.',              NOW(), NOW(), FALSE),
  (28, 3, 6,  'Hackathon prep',                 'We have 3 weeks before the inter-university hackathon. Form teams.',  NOW(), NOW(), FALSE),
  (29, 3, 21, 'TypeScript workshop',            'Join us Sunday at 2pm for a hands-on TypeScript intro session.',      NOW(), NOW(), FALSE),
  (30, 3, 4,  'LeetCode Fridays',               'Every Friday at 5pm we tackle two medium problems together.',          NOW(), NOW(), FALSE),
  (31, 3, 22, 'Git branching guide',            'Uploaded a branching strategy doc. Please follow it for all PRs.',    NOW(), NOW(), FALSE),

  -- Music Club
  (4,  4, 5,  'Band rehearsal',                 'Practice is moved to the media room after classes.',                   NOW(), NOW(), FALSE),
  (10, 4, 10, 'New song arrangement',           'Check the shared folder for the new chord sheets.',                   NOW(), NOW(), FALSE),
  (16, 4, 14, 'Open mic night',                 'Come perform, showcase your talent or support your friends.',          NOW(), NOW(), FALSE),
  (32, 4, 5,  'Semester concert planning',      'We''re targeting week 12 for the end-of-semester show. Vote on theme.',NOW(), NOW(), FALSE),
  (33, 4, 23, 'New members welcome',            'Three new members joined this week. Give them a warm welcome!',       NOW(), NOW(), FALSE),
  (34, 4, 4,  'Equipment inventory',            'Updated the gear list. Missing one mic stand and two cables.',        NOW(), NOW(), FALSE),
  (35, 4, 24, 'Practice schedule for finals',   'Reduced to once a week during finals. Room B3 at 6pm Thursdays.',     NOW(), NOW(), FALSE),

  -- Sports Club
  (5,  5, 6,  'Training schedule',              'Warm-ups first, then drills, then scrimmage.',                         NOW(), NOW(), FALSE),
  (11, 5, 11, 'Match schedule published',       'First match is next Saturday at 2 PM on the field.',                  NOW(), NOW(), FALSE),
  (17, 5, 15, 'Fitness tips',                   'Share your training routines and nutrition advice.',                   NOW(), NOW(), FALSE),
  (36, 5, 6,  'New coach joining us',           'Coach Rachid will be supervising Tuesday and Thursday sessions.',     NOW(), NOW(), FALSE),
  (37, 5, 25, 'Injury prevention workshop',     'Physiotherapist visit is scheduled for next Monday at 4pm.',          NOW(), NOW(), FALSE),
  (38, 5, 5,  'Tournament bracket posted',      'Check the notice board. We''re in Group B against CS and Engineering.',NOW(), NOW(), FALSE),
  (39, 5, 26, 'Equipment handout',              'Jerseys and training gear distributed. Report missing items to Rayane.',NOW(), NOW(), FALSE),

  -- Theater Club
  (6,  6, 1,  'Audition notes',                 'Anyone interested can try out after the lunch break.',                 NOW(), NOW(), FALSE),
  (12, 6, 9,  'Costume fittings',               'All cast members should come by Friday for fittings.',                NOW(), NOW(), FALSE),
  (18, 6, 16, 'Script selection vote',          'Vote for the next play production, results tomorrow.',                 NOW(), NOW(), FALSE),
  (40, 6, 1,  'Rehearsal schedule',             'Full cast rehearsals on Mondays and Wednesdays at 5pm in Hall C.',    NOW(), NOW(), FALSE),
  (41, 6, 6,  'Stage design meeting',           'Set and lighting team meet Saturday morning to plan the backdrop.',   NOW(), NOW(), FALSE),
  (42, 6, 22, 'Lines deadline',                 'All actors must have lines memorized by end of week 8.',              NOW(), NOW(), FALSE),
  (43, 6, 9,  'Promotion post template',        'Use the shared Canva template for all social media announcements.',   NOW(), NOW(), FALSE);

INSERT INTO joinrequest (request_id, initiator_user_id, target_club_id, reviewer_user_id, request_type, status, message, created_at, reviewed_at)
VALUES
  (1,  6,  1, 2,    'join', 'approved', 'Would love to help with discussions.',               NOW(), NOW()),
  (2,  5,  2, NULL, 'join', 'pending',  'I want to learn sensor wiring and coding.',           NOW(), NULL),
  (3,  2,  4, 5,    'join', 'rejected', 'Ask again after the next rehearsal.',                 NOW(), NOW()),
  (4,  7,  4, 5,    'join', 'approved', 'Very interested in music and performance.',           NOW(), NOW()),
  (5,  9,  1, 2,    'join', 'pending',  'Love debate and critical thinking.',                  NOW(), NULL),
  (6,  10, 5, 6,    'join', 'approved', 'Athlete looking to join the team.',                   NOW(), NOW()),
  (7,  11, 6, 1,    'join', 'pending',  'Drama and theater are my passion.',                   NOW(), NULL),
  (8,  12, 3, 4,    'join', 'approved', 'Software developer interested in coding projects.',   NOW(), NOW()),
  (9,  13, 2, 3,    'join', 'rejected', 'We need more hands-on experience, try next term.',   NOW(), NOW()),
  (10, 14, 1, 2,    'join', 'pending',  'Want to improve my public speaking.',                 NOW(), NULL),
  (11, 15, 4, 5,    'join', 'approved', 'Guitarist looking for a band.',                       NOW(), NOW()),
  (12, 16, 5, 6,    'join', 'approved', 'Competitive athlete, very committed.',                NOW(), NOW()),
  (13, 8,  6, 1,    'join', 'pending',  'Interest in stage production and design.',            NOW(), NULL),
  (14, 9,  4, 5,    'join', 'rejected', 'Vocalist, but schedule conflicts with rehearsals.',   NOW(), NOW()),
  (15, 12, 2, 3,    'join', 'pending',  'Electronics hobbyist, eager to learn.',               NOW(), NULL),
  (16, 23, 1, NULL, 'join', 'pending',  'Interested in debate and public speaking.',            NOW(), NULL),
  (17, 24, 3, NULL, 'join', 'pending',  'Front-end developer looking to collaborate.',         NOW(), NULL),
  (18, 25, 2, NULL, 'join', 'pending',  'Passionate about robotics and automation.',           NOW(), NULL),
  (19, 26, 6, NULL, 'join', 'pending',  'Performed in high school theater, want to continue.', NOW(), NULL),
  (20, 21, 5, 6,    'join', 'rejected', 'Currently at capacity, check back next semester.',    NOW(), NOW()),
  (21, 22, 4, NULL, 'join', 'pending',  'I play violin and would love to join.',               NOW(), NULL);

INSERT INTO club_creation_request (request_id, initiator_user_id, name, description, main_color, icon_name, email, status, reviewer_message, created_at, reviewed_at)
VALUES
  (1, 8,  'Chess Club',        'Weekly chess matches, puzzles, and tournament preparation.',        'PURPLE', 'CHESS_KING',    'chess@aui.ma',       'pending',  NULL,                             NOW(), NULL),
  (2, 10, 'Photography Club',  'Campus photography walks, editing workshops, and exhibitions.',     'PINK',   'CAMERA',        'photo@aui.ma',       'pending',  NULL,                             NOW(), NULL),
  (3, 17, 'Gaming Club',       'Competitive gaming, e-sports tournaments, and LAN parties.',       'ORANGE', 'SUPER_MARIO',   'gaming@aui.ma',      'pending',  NULL,                             NOW(), NULL),
  (4, 14, 'Art Club',          'Painting, sketching, sculpture, and mixed media sessions.',        'AMBER',  'PAINT_BOARD',   'art@aui.ma',         'rejected', 'Similar to an existing club — please differentiate the focus.', NOW(), NOW()),
  (5, 19, 'Cooking Club',      'Traditional Moroccan and international cuisine workshops.',        'GREEN',  'COOKBOOK',      'cooking@aui.ma',     'pending',  NULL,                             NOW(), NULL),
  (6, 22, 'Tennis Club',       'Weekly tennis drills, friendly matches, and court bookings.',     'CYAN',   'TENNIS_RACKET', 'tennis@aui.ma',      'pending',  NULL,                             NOW(), NULL),
  (7, 25, 'Adventure Club',    'Hiking, camping, and outdoor survival skills training.',           'YELLOW', 'ADVENTURE',     'adventure@aui.ma',   'pending',  NULL,                             NOW(), NULL);

-- Reset all identity sequences so new inserts don't conflict with seeded IDs
SELECT setval(pg_get_serial_sequence('users',                  'user_id'),     MAX(user_id))     FROM users;
SELECT setval(pg_get_serial_sequence('club',                   'club_id'),     MAX(club_id))     FROM club;
SELECT setval(pg_get_serial_sequence('membership',             'membership_id'),MAX(membership_id))FROM membership;
SELECT setval(pg_get_serial_sequence('post',                   'post_id'),     MAX(post_id))     FROM post;
SELECT setval(pg_get_serial_sequence('joinrequest',            'request_id'),  MAX(request_id))  FROM joinrequest;
SELECT setval(pg_get_serial_sequence('club_creation_request',  'request_id'),  MAX(request_id))  FROM club_creation_request;
