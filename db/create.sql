/*
Midreport SQL databse creation  file.
Team lead: Adam Mahres < 158277 >
Date: 23/03/2026 16;46
Course: SP26-CSC332602 Database Systems
Shortcut: psql -U lfirstname -f create.sql
*/

DROP DATABASE IF EXISTS aui_club_management;

CREATE DATABASE aui_club_management;

\c aui_club_management;

-- user
CREATE TABLE users (
    user_id INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    fname VARCHAR(50),
    lname VARCHAR(50),
    profile_picture VARCHAR(255),
    visibility BOOLEAN,
    is_system_admin BOOLEAN,
    created_at TIMESTAMP,
    CONSTRAINT pk_user PRIMARY KEY (user_id),
    CONSTRAINT uq_user_email UNIQUE (email)
);

-- club
CREATE TABLE club (
    club_id INT NOT NULL,
    owner_id INT,
    name VARCHAR(100),
    description VARCHAR(255),
    created_at TIMESTAMP,
    logo_url VARCHAR(255),
    banner_url VARCHAR(255),
    main_color VARCHAR(30),
    status VARCHAR(20),
    deleted_flag BOOLEAN,
    email VARCHAR(100),
    CONSTRAINT pk_club PRIMARY KEY (club_id),
    CONSTRAINT uq_club_email UNIQUE (email),
    CONSTRAINT fk_club_owner FOREIGN KEY (owner_id) REFERENCES users (user_id) ON UPDATE CASCADE
);

-- membership
CREATE TABLE membership (
    membership_id INT NOT NULL,
    user_id INT NOT NULL,
    club_id INT NOT NULL,
    joined_at TIMESTAMP,
    left_at TIMESTAMP,
    membership_status VARCHAR(20),
    invited_by INT,
    CONSTRAINT pk_membership PRIMARY KEY (membership_id),
    CONSTRAINT fk_membership_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE,
    CONSTRAINT fk_membership_club FOREIGN KEY (club_id) REFERENCES club (club_id) ON UPDATE CASCADE,
    CONSTRAINT fk_membership_invited FOREIGN KEY (invited_by) REFERENCES users (user_id) ON UPDATE CASCADE,
    CONSTRAINT chk_membership_status CHECK (
        membership_status IN (
            'pending',
            'active',
            'rejected',
            'left',
            'banned'
        )
    )
);

-- role
CREATE TABLE role (
    role_id INT NOT NULL,
    club_id INT NOT NULL,
    name VARCHAR(50),
    is_admin BOOLEAN,
    description VARCHAR(255),
    max_members INT,
    CONSTRAINT pk_role PRIMARY KEY (role_id),
    CONSTRAINT fk_role_club FOREIGN KEY (club_id) REFERENCES club (club_id) ON UPDATE CASCADE,
    CONSTRAINT chk_role_max CHECK (
        max_members IS NULL
        OR max_members > 0
    )
);

-- permission
CREATE TABLE permission (
    permission_id INT NOT NULL,
    name VARCHAR(50),
    description VARCHAR(255),
    category VARCHAR(50),
    CONSTRAINT pk_permission PRIMARY KEY (permission_id)
);

-- role_permission
CREATE TABLE role_permission (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT pk_role_permission PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES role (role_id) ON UPDATE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permission (permission_id) ON UPDATE CASCADE
);

-- member_role
CREATE TABLE member_role (
    membership_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP,
    assigned_by INT,
    CONSTRAINT pk_member_role PRIMARY KEY (membership_id, role_id),
    CONSTRAINT fk_mr_membership FOREIGN KEY (membership_id) REFERENCES membership (membership_id) ON UPDATE CASCADE,
    CONSTRAINT fk_mr_role FOREIGN KEY (role_id) REFERENCES role (role_id) ON UPDATE CASCADE,
    CONSTRAINT fk_mr_assigned FOREIGN KEY (assigned_by) REFERENCES users (user_id) ON UPDATE CASCADE
);

-- post
CREATE TABLE post (
    post_id INT NOT NULL,
    club_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200),
    content VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_deleted BOOLEAN,
    CONSTRAINT pk_post PRIMARY KEY (post_id),
    CONSTRAINT fk_post_club FOREIGN KEY (club_id) REFERENCES club (club_id) ON UPDATE CASCADE,
    CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE
);

-- request
CREATE TABLE request (
    request_id INT NOT NULL,
    initiator_user_id INT,
    target_club_id INT,
    target_user_id INT,
    reviewer_user_id INT,
    type VARCHAR(50),
    status VARCHAR(20),
    message VARCHAR(255),
    created_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    CONSTRAINT pk_request PRIMARY KEY (request_id),
    CONSTRAINT fk_req_initiator FOREIGN KEY (initiator_user_id) REFERENCES users (user_id) ON UPDATE CASCADE,
    CONSTRAINT fk_req_target_user FOREIGN KEY (target_user_id) REFERENCES users (user_id) ON UPDATE CASCADE,
    CONSTRAINT fk_req_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users (user_id) ON UPDATE CASCADE,
    CONSTRAINT fk_req_club FOREIGN KEY (target_club_id) REFERENCES club (club_id) ON UPDATE CASCADE,
    CONSTRAINT chk_request_status CHECK (
        status IN (
            'pending',
            'approved',
            'rejected'
        )
    )
);
