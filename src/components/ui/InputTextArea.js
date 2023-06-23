const InputTextArea = (props) => {
  return (
    <div className={`${"form"} ${props.className}`}>
      <textarea
        className="form-control"
        id="floatingTextarea"
        value={props.value}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event)}
      ></textarea>
    </div>
  );
};

export default InputTextArea;
