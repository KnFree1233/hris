import classes from "./Table.module.css"

const Table = (props) => {
  return (
    <div className={`${"col"} ${classes.table}`}>
      {props.children}
    </div>
  );
};

export default Table;
