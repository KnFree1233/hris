import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      type="button"
      className={`${"btn"} ${props.className} ${classes.button}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
