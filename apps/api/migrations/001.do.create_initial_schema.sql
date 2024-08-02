CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp,
  "updated_at" timestamp,
  "first_name" varchar(255),
  "last_name" varchar(255),
  "username" varchar(255) UNIQUE,
  "password_hash" varchar,
  "password_salt" varchar,
  "avatar" varchar,
  "role" varchar(255),
  "ordinal_number" integer,
  "average_grade" decimal
);
  
CREATE TABLE "classrooms" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp,
  "updated_at" timestamp,
  "name" varchar(255)
);

CREATE TABLE "subjects" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp,
  "updated_at" timestamp,
  "name" varchar(500),
  "classroom_id" varchar
);

CREATE TABLE "users_grades" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp,
  "updated_at" timestamp,
  "user_id" varchar,
  "subject_id" varchar,
  "grade" smallint
);

CREATE TABLE "users_classrooms" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp,
  "updated_at" timestamp,
  "user_id" varchar,
  "classroom_id" varchar
);


ALTER TABLE users_classrooms
  ADD FOREIGN KEY (user_id)
    REFERENCES users (id);
  


ALTER TABLE users_classrooms
  ADD FOREIGN KEY (classroom_id)
    REFERENCES classrooms (id);
  

ALTER TABLE subjects
  ADD FOREIGN KEY (classroom_id)
    REFERENCES classrooms (id);
  

ALTER TABLE users_grades
  ADD FOREIGN KEY (user_id)
    REFERENCES users (id);
  


ALTER TABLE users_grades
  ADD FOREIGN KEY (subject_id)
    REFERENCES subjects (id);