import { DatePicker } from "@mui/x-date-pickers";

import classes from "./YearPicker.module.css";
import dayjs from "dayjs";

const YearPicker = (props) => {

  return (
    <div className={classes["year-picker"]}>
      <DatePicker openTo="year" views={["year"]} defaultValue={dayjs("2023")} />
    </div>
  );
};

export default YearPicker;
