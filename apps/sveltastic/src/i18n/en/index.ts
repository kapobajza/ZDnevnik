import type { BaseTranslation } from "../i18n-types";

const en = {
  validation_field_required: "{field:string} is required",
  validation_field_too_short: "{field:string} is too short",
  validation_field_number_too_small:
    "{field:string} must be at least {min:number}",
  validation_field_number_too_big:
    "{field:string} must be at most {max:number}",
  validation_field_invalid_type: "{field:string} must be a valid type",
  validation_file_too_big:
    "Please select a file that is smaller than {max:number} MB",
  error_title: "Error",
  error_unknown: "An unknown error occurred",
  no_results: "No results",
  save: "Save",
} satisfies BaseTranslation;

export default en;
