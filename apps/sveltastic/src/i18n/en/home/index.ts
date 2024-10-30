import type { NamespaceHomeTranslation } from "../../i18n-types";

const enHome = {
  no_students_found: "There are no students in the class yet",
  add_student: "Add student",
  title: "Home",
  student_grade_title:
    "{grade:number|{5: Excellent noodle, 4: Very good peanut, 3: Good bean, 2: Average tea, 1: Bad milk, 0: No grades}}" as never,
  student_average: "Average",
  add_student_title: "Add new student",
  add_student_email_placeholder: "Email",
  add_student_classroom_placeholder: "Classroom",
} satisfies NamespaceHomeTranslation;

export default enHome;
