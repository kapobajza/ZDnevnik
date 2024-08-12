import type { BaseTranslation } from "../i18n-types";

const ba = {
  login_title:
    'Prijavi se i odgovori na pitanje <span class="zd-text-primary">"Koji si ti broj"</span>?',
  login_error_invalid_credentials: "Pogrešno korisničko ime ili lozinka",
  login_submit_button: "Prijava",
  login_username_placeholder: "Korisničko ime",
  login_password_placeholder: "Lozinka",
  home_no_students_found: "Trenutno nemate nijednog učenika u razredu",
  home_add_student: "Dodaj učenika",
  home_title: "Početna",
  home_student_grade_title:
    "{grade:number|{5: Odličan, 4: Vrlo dobar, 3: Dobar, 2: Dovoljan, 1: Nedovoljan, 0: Nema ocjene}}",
  home_student_average: "Prosjek",
  validation_field_required:
    "{field:string} je {gender?|{m: obavezan, f: obavezna, *: obavezno}}",
  validation_field_too_short:
    "{field:string} je {gender?|{m: prekratak, f: prekratka, *: prekratko}}",
  error_title: "Greška",
  error_unknown: "Dogodila se nepoznata greška",
  no_results: "Nema rezultata",
} satisfies BaseTranslation;

export default ba;
