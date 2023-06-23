const InputText = (props) => {
  return (
    <div className={`${props.className}`}>
      <input
        className="form-control me-2"
        disabled={props.disabled}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        max={props.max}
        min={props.min}
        onChange={props.onChange}
      />
    </div>
  );
};

export default InputText;
