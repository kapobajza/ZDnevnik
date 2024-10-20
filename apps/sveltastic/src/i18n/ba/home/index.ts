import type { BaseTranslation } from "../../i18n-types";

const baHome = {
  no_students_found: "Trenutno nemate nijednog učenika u razredu",
  add_student: "Dodaj učenika",
  title: "Početna",
  student_grade_title:
    "{grade:number|{5: Odličan, 4: Vrlo dobar, 3: Dobar, 2: Dovoljan, 1: Nedovoljan, 0: Nema ocjene}}",
  student_average: "Prosjek",
  add_student_title: "Dodaj novog učenika",
  add_student_email_placeholder: "Email",
  add_student_classroom_placeholder: "Razred",
} satisfies BaseTranslation;

export default baHome;
