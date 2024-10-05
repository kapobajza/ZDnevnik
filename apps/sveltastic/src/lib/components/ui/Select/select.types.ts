import type {
  Selected,
  SelectContentProps as SelectContentPrimitiveProps,
} from "bits-ui";
import { type SelectProps as SelectPrimitiveProps } from "bits-ui";
import type { Snippet } from "svelte";

export type SelectListItem = {
  id: string;
  label: string;
  disabled?: boolean;
  value: string | number;
};

export type SelectContentProps = Omit<
  SelectContentPrimitiveProps,
  "children"
> & {
  children: Snippet;
};

export type SelectListPropsBase = {
  class?: string | null;
  placeholder?: string;
  label?: string;
  selected?: Selected<string | number>;
  onSelectedChange?: (selected: Selected<string | number>) => void;
  trigger?: Snippet;
  contentProps?: Omit<SelectContentProps, "children">;
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
