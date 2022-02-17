import { useRef, useState } from "react";

function FileInput({ name, value, onChange }) {
  // const [value, setValue] = useState("");
  const inputRef = useRef();

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    // setValue(nextValue);
    onChange(name, nextValue);
  };

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.value = "";
    onChange(name, null);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} ref={inputRef} />
      {value && <button onClick={handleClearClick}>X</button>}
    </div>
  );
}

export default FileInput;
