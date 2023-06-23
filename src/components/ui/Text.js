import classes from "./Text.module.css";

const Text = (props) => {
  return (
    <div className={classes.text}>
      <label className="fs-6">{props.label}</label>
      <p>{props.text}</p>
    </div>
  );
};

export default Text;
