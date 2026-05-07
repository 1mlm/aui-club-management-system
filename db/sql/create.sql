/*
Simplified schema (singular table names, no triggers).
Designed for classroom use: explicit INT primary keys, clear foreign keys,
and minimal CHECK constraints. No activity log or triggers.
*/

DROP DATABASE IF EXISTS aui_clubs;
CREATE DATABASE aui_clubs;

\c aui_clubs;

CREATE TABLE "user" (
    user_id INT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    display_name VARCHAR(100),
    password_hash VARCHAR(120) NOT NULL,
    is_system_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "club" (
    club_id INT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    main_color VARCHAR(30),
    icon_name VARCHAR(40),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    email VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT fk_club_owner FOREIGN KEY (owner_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_club_status CHECK (status IN ('active', 'archived'))
);

CREATE TABLE "membership" (
    membership_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    club_id INT NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    membership_role VARCHAR(20) NOT NULL DEFAULT 'member',
    CONSTRAINT fk_membership_user FOREIGN KEY (user_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_membership_club FOREIGN KEY (club_id) REFERENCES "club" (club_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT uq_membership_user_club UNIQUE (user_id, club_id),
    CONSTRAINT chk_membership_role CHECK (membership_role IN ('board_member', 'member'))
);

CREATE TABLE "post" (
    post_id INT PRIMARY KEY,
    club_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    like_count INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_post_club FOREIGN KEY (club_id) REFERENCES "club" (club_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "post_like" (
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_post_like PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_post_like_post FOREIGN KEY (post_id) REFERENCES "post" (post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_post_like_user FOREIGN KEY (user_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "joinrequest" (
    request_id INT PRIMARY KEY,
    initiator_user_id INT NOT NULL,
    target_club_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    message VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    CONSTRAINT fk_joinrequest_initiator FOREIGN KEY (initiator_user_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_joinrequest_club FOREIGN KEY (target_club_id) REFERENCES "club" (club_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_joinrequest_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE TABLE "club_creation_request" (
    request_id INT PRIMARY KEY,
    initiator_user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    main_color VARCHAR(30),
    icon_name VARCHAR(40),
    email VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    CONSTRAINT fk_ccr_initiator FOREIGN KEY (initiator_user_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_ccr_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE TABLE "invite" (
    invite_id INT PRIMARY KEY,
    inviter_user_id INT NOT NULL,
    invitee_user_id INT NOT NULL,
    club_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    message VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMP,
    CONSTRAINT fk_invite_inviter FOREIGN KEY (inviter_user_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_invite_invitee FOREIGN KEY (invitee_user_id) REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_invite_club FOREIGN KEY (club_id) REFERENCES "club" (club_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_invite_status CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled'))
);
