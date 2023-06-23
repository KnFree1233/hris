const InputSelect = (props) => {
  return (
    <select
      className="form-select"
      id="inputGroupSelect01"
      disabled={props.disabled}
      value={props.defaultValue}
      onChange={props.onChange}
    >
      {props.children}
    </select>
  );
};

export default InputSelect;
