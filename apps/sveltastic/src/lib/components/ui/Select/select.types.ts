import type { Selected } from "bits-ui";
import { type SelectProps as SelectPrimitiveProps } from "bits-ui";
import type { Snippet } from "svelte";

export type SelectListItem = {
  id: string;
  label: string;
  disabled?: boolean;
  value: string | number;
};

export type SelectListPropsBase = {
  class?: string | null;
  placeholder?: string;
  label?: string;
  selected?: Selected<string | number>;
  onSelectedChange?: (selected: Selected<string | number>) => void;
} & Omit<
  SelectPrimitiveProps<"root">,
  "items" | "selected" | "onSelectedChange"
>;

export type SelectListProps<TItem extends SelectListItem> =
  | (SelectListPropsBase & {
      items: TItem[];
      renderItem: Snippet<[TItem]>;
      content?: undefined;
    })
  | (SelectListPropsBase & {
      content: Snippet;
    });
