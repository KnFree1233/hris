import classes from "./TableHeader.module.css";

const TableHeader = (props) => {
  return (
    <div
      className={`${"row p-2 m-1 fw-bold border-bottom"} ${
        classes["table-header"]
      }`}
    >
      {props.children}
    </div>
  );
};

export default TableHeader;
