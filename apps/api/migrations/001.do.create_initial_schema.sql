CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "first_name" varchar(255),
  "last_name" varchar(255),
  "username" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "password_salt" varchar NOT NULL,
  "avatar" varchar,
  "role" varchar(255) NOT NULL,
  "ordinal_number" integer,
  "average_grade" decimal DEFAULT 0
);
  
CREATE TABLE "classrooms" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "name" varchar(255) NOT NULL
);

CREATE TABLE "subjects" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "name" varchar(500) NOT NULL,
  "classroom_id" varchar NOT NULL
);

CREATE TABLE "users_grades" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "user_id" varchar NOT NULL,
  "subject_id" varchar NOT NULL,
  "grade" smallint NOT NULL
);

CREATE TABLE "users_classrooms" (
  "id" varchar PRIMARY KEY,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "user_id" varchar NOT NULL,
  "classroom_id" varchar NOT NULL
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