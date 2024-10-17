import * as DateFns from "date-fns";

export const timestampGeneralFormat = (date: Date) => {
  return DateFns.format(date, "yyyy-MM-dd HH:mm:ss");
};
