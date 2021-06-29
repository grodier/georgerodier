import { parseISO, format } from "date-fns";

type DateFormatterProps = {
  dateString: string;
};

function DateFormatter({ dateString }: DateFormatterProps) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
}

export default DateFormatter;
