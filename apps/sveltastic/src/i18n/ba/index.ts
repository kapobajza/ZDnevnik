import type { BaseTranslation } from "../i18n-types";

const ba = {
  validation_field_required:
    "{field:string} je {gender?|{m: obavezan, f: obavezna, *: obavezno}}",
  validation_field_too_short:
    "{field:string} je {gender?|{m: prekratak, f: prekratka, *: prekratko}}",
  validation_field_number_too_small:
    "{field:string} mora biti {gender?|{m: veći, f: veća, *: veće}} ili jednak {min:number}",
  validation_field_number_too_big:
    "{field:string} mora biti {gender?|{m: manji, f: manja, *: manje}} ili jednak {max:number}",
  validation_field_invalid_type: "{field:string} mora biti validnog tipa",
  validation_file_too_big:
    "Molimo odaberite file koji ima manje od {max:number} MB",
  error_title: "Greška",
  error_unknown: "Dogodila se nepoznata greška",
  no_results: "Nema rezultata",
  save: "Spasi",
} satisfies BaseTranslation;

export default ba;
