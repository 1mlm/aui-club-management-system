CREATE TABLE role_permission (
  role_id       INT NOT NULL,
  permission_id INT NOT NULL,
  CONSTRAINT pk_role_permission
    PRIMARY KEY (role_id, permission_id)
);
CREATE TABLE member_role (
  membership_id INT NOT NULL,
  role_id       INT NOT NULL,
  assigned_at   TIMESTAMP,
  assigned_by INT,
  CONSTRAINT pk_member_role
    PRIMARY KEY (membership_id, role_id)
);

