import { useState } from "react";
import classes from "./TableRow.module.css";

const TableRow = (props) => {
  const [expand, setExpand] = useState(true);
  const expandChangeHandler = () => {
    if (props.expandItem) setExpand((prevState) => !prevState);
  };

  return (
    <div className={`${"row m-1 p-1 border-bottom"} ${classes["table-row"]}`}>
      {props.children}
      {expand && (
        <div
          className={`${"col-7 text-wrap mb-3"} ${classes["expand-item"]}`}
          // onClick={() => expandChangeHandler()}
          // type="button"
        >
          {props.expandItem}
        </div>
      )}
    </div>
  );
};

export default TableRow;
