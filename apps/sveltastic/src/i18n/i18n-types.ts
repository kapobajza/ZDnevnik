// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type {
  BaseTranslation as BaseTranslationType,
  LocalizedString,
  RequiredParams,
} from "typesafe-i18n";

export type BaseTranslation = BaseTranslationType & DisallowNamespaces;
export type BaseLocale = "ba";

export type Locales = "ba" | "en";

export type Translation = RootTranslation & DisallowNamespaces;

export type Translations = RootTranslation & {
  home: NamespaceHomeTranslation;
  login: NamespaceLoginTranslation;
};

type RootTranslation = {
  /**
   * {​f​i​e​l​d​}​ ​j​e​ ​{​g​e​n​d​e​r​?​|​{​m​:​ ​o​b​a​v​e​z​a​n​,​ ​f​:​ ​o​b​a​v​e​z​n​a​,​ ​*​:​ ​o​b​a​v​e​z​n​o​}​}
   * @param {string} field
   * @param {'m' | 'f' | string} [gender]
   */
  validation_field_required:
    | RequiredParams<
        "field" | `gender?|{m:${string}, f:${string}, *:${string}}`
      >
    | RequiredParams<"field">;
  /**
   * {​f​i​e​l​d​}​ ​j​e​ ​{​g​e​n​d​e​r​?​|​{​m​:​ ​p​r​e​k​r​a​t​a​k​,​ ​f​:​ ​p​r​e​k​r​a​t​k​a​,​ ​*​:​ ​p​r​e​k​r​a​t​k​o​}​}
   * @param {string} field
   * @param {'m' | 'f' | string} [gender]
   */
  validation_field_too_short:
    | RequiredParams<
        "field" | `gender?|{m:${string}, f:${string}, *:${string}}`
      >
    | RequiredParams<"field">;
  /**
   * {​f​i​e​l​d​}​ ​m​o​r​a​ ​b​i​t​i​ ​{​g​e​n​d​e​r​?​|​{​m​:​ ​v​e​ć​i​,​ ​f​:​ ​v​e​ć​a​,​ ​*​:​ ​v​e​ć​e​}​}​ ​i​l​i​ ​j​e​d​n​a​k​ ​{​m​i​n​}
   * @param {string} field
   * @param {'m' | 'f' | string} [gender]
   * @param {number} min
   */
  validation_field_number_too_small:
    | RequiredParams<
        "field" | `gender?|{m:${string}, f:${string}, *:${string}}` | "min"
      >
    | RequiredParams<"field" | "min">;
  /**
   * {​f​i​e​l​d​}​ ​m​o​r​a​ ​b​i​t​i​ ​{​g​e​n​d​e​r​?​|​{​m​:​ ​m​a​n​j​i​,​ ​f​:​ ​m​a​n​j​a​,​ ​*​:​ ​m​a​n​j​e​}​}​ ​i​l​i​ ​j​e​d​n​a​k​ ​{​m​a​x​}
   * @param {string} field
   * @param {'m' | 'f' | string} [gender]
   * @param {number} max
   */
  validation_field_number_too_big:
    | RequiredParams<
        "field" | `gender?|{m:${string}, f:${string}, *:${string}}` | "max"
      >
    | RequiredParams<"field" | "max">;
  /**
   * {​f​i​e​l​d​}​ ​m​o​r​a​ ​b​i​t​i​ ​v​a​l​i​d​n​o​g​ ​t​i​p​a
   * @param {string} field
   */
  validation_field_invalid_type: RequiredParams<"field">;
  /**
   * M​o​l​i​m​o​ ​o​d​a​b​e​r​i​t​e​ ​f​i​l​e​ ​k​o​j​i​ ​i​m​a​ ​m​a​n​j​e​ ​o​d​ ​{​m​a​x​}​ ​M​B
   * @param {number} max
   */
  validation_file_too_big: RequiredParams<"max">;
  /**
   * G​r​e​š​k​a
   */
  error_title: string;
  /**
   * D​o​g​o​d​i​l​a​ ​s​e​ ​n​e​p​o​z​n​a​t​a​ ​g​r​e​š​k​a
   */
  error_unknown: string;
  /**
   * N​e​m​a​ ​r​e​z​u​l​t​a​t​a
   */
  no_results: string;
  /**
   * S​p​a​s​i
   */
  save: string;
};

export type NamespaceHomeTranslation = {
  /**
   * T​r​e​n​u​t​n​o​ ​n​e​m​a​t​e​ ​n​i​j​e​d​n​o​g​ ​u​č​e​n​i​k​a​ ​u​ ​r​a​z​r​e​d​u
   */
  no_students_found: string;
  /**
   * D​o​d​a​j​ ​u​č​e​n​i​k​a
   */
  add_student: string;
  /**
   * P​o​č​e​t​n​a
   */
  title: string;
  /**
   * {​g​r​a​d​e​|​{​5​:​ ​O​d​l​i​č​a​n​,​ ​4​:​ ​V​r​l​o​ ​d​o​b​a​r​,​ ​3​:​ ​D​o​b​a​r​,​ ​2​:​ ​D​o​v​o​l​j​a​n​,​ ​1​:​ ​N​e​d​o​v​o​l​j​a​n​,​ ​0​:​ ​N​e​m​a​ ​o​c​j​e​n​e​}​}
   * @param {number} grade
   */
  student_grade_title: RequiredParams<`grade|{5:${string}, 4:${string}, 3:${string}, 2:${string}, 1:${string}, 0:${string}}`>;
  /**
   * P​r​o​s​j​e​k
   */
  student_average: string;
  /**
   * D​o​d​a​j​ ​n​o​v​o​g​ ​u​č​e​n​i​k​a
   */
  add_student_title: string;
  /**
   * I​m​e
   */
  add_student_first_name_placeholder: string;
  /**
   * P​r​e​z​i​m​e
   */
  add_student_last_name_placeholder: string;
  /**
   * R​a​z​r​e​d
   */
  add_student_classroom_placeholder: string;
};

export type NamespaceLoginTranslation = {
  /**
   * P​r​i​j​a​v​i​ ​s​e​ ​i​ ​o​d​g​o​v​o​r​i​ ​n​a​ ​p​i​t​a​n​j​e​ ​<​s​p​a​n​ ​c​l​a​s​s​=​"​z​d​-​t​e​x​t​-​p​r​i​m​a​r​y​"​>​"​K​o​j​i​ ​s​i​ ​t​i​ ​b​r​o​j​"​<​/​s​p​a​n​>​?
   */
  title: string;
  /**
   * P​o​g​r​e​š​n​o​ ​k​o​r​i​s​n​i​č​k​o​ ​i​m​e​ ​i​l​i​ ​l​o​z​i​n​k​a
   */
  error_invalid_credentials: string;
  /**
   * P​r​i​j​a​v​a
   */
  submit_button: string;
  /**
   * K​o​r​i​s​n​i​č​k​o​ ​i​m​e
   */
  username_placeholder: string;
  /**
   * L​o​z​i​n​k​a
   */
  password_placeholder: string;
};

export type Namespaces = "home" | "login";

type DisallowNamespaces = {
  /**
   * reserved for 'home'-namespace\
   * you need to use the `./home/index.ts` file instead
   */
  home?: "[typesafe-i18n] reserved for 'home'-namespace. You need to use the `./home/index.ts` file instead.";

  /**
   * reserved for 'login'-namespace\
   * you need to use the `./login/index.ts` file instead
   */
  login?: "[typesafe-i18n] reserved for 'login'-namespace. You need to use the `./login/index.ts` file instead.";
};

export type TranslationFunctions = {
  /**
   * {field} je {gender?|{m: obavezan, f: obavezna, *: obavezno}}
   */
  validation_field_required: (arg: {
    field: string;
    gender?: "m" | "f" | string;
  }) => LocalizedString;
  /**
   * {field} je {gender?|{m: prekratak, f: prekratka, *: prekratko}}
   */
  validation_field_too_short: (arg: {
    field: string;
    gender?: "m" | "f" | string;
  }) => LocalizedString;
  /**
   * {field} mora biti {gender?|{m: veći, f: veća, *: veće}} ili jednak {min}
   */
  validation_field_number_too_small: (arg: {
    field: string;
    gender?: "m" | "f" | string;
    min: number;
  }) => LocalizedString;
  /**
   * {field} mora biti {gender?|{m: manji, f: manja, *: manje}} ili jednak {max}
   */
  validation_field_number_too_big: (arg: {
    field: string;
    gender?: "m" | "f" | string;
    max: number;
  }) => LocalizedString;
  /**
   * {field} mora biti validnog tipa
   */
  validation_field_invalid_type: (arg: { field: string }) => LocalizedString;
  /**
   * Molimo odaberite file koji ima manje od {max} MB
   */
  validation_file_too_big: (arg: { max: number }) => LocalizedString;
  /**
   * Greška
   */
  error_title: () => LocalizedString;
  /**
   * Dogodila se nepoznata greška
   */
  error_unknown: () => LocalizedString;
  /**
   * Nema rezultata
   */
  no_results: () => LocalizedString;
  /**
   * Spasi
   */
  save: () => LocalizedString;
  home: {
    /**
     * Trenutno nemate nijednog učenika u razredu
     */
    no_students_found: () => LocalizedString;
    /**
     * Dodaj učenika
     */
    add_student: () => LocalizedString;
    /**
     * Početna
     */
    title: () => LocalizedString;
    /**
     * {grade|{5: Odličan, 4: Vrlo dobar, 3: Dobar, 2: Dovoljan, 1: Nedovoljan, 0: Nema ocjene}}
     */
    student_grade_title: (arg: { grade: number }) => LocalizedString;
    /**
     * Prosjek
     */
    student_average: () => LocalizedString;
    /**
     * Dodaj novog učenika
     */
    add_student_title: () => LocalizedString;
    /**
     * Ime
     */
    add_student_first_name_placeholder: () => LocalizedString;
    /**
     * Prezime
     */
    add_student_last_name_placeholder: () => LocalizedString;
    /**
     * Razred
     */
    add_student_classroom_placeholder: () => LocalizedString;
  };
  login: {
    /**
     * Prijavi se i odgovori na pitanje <span class="zd-text-primary">"Koji si ti broj"</span>?
     */
    title: () => LocalizedString;
    /**
     * Pogrešno korisničko ime ili lozinka
     */
    error_invalid_credentials: () => LocalizedString;
    /**
     * Prijava
     */
    submit_button: () => LocalizedString;
    /**
     * Korisničko ime
     */
    username_placeholder: () => LocalizedString;
    /**
     * Lozinka
     */
    password_placeholder: () => LocalizedString;
  };
};

export type Formatters = {};
