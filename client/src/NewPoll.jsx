import { useEffect, useState } from "react";
import { customFetch } from "./api";
import { useLocation } from "wouter";

export const NewPoll = () => {
  const [body, setBody] = useState("");
  const [options, setOptions] = useState(["option 1"]);
  const [inputFocused, setInputFocused] = useState(null);
  const [_, setLocation] = useLocation();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await customFetch("polls/new", {
        method: "post",
        body: JSON.stringify({
          body,
          options,
        }),
      });
      console.log("data --", data);
      const pollId = data.id;
      alert("Poll created ✅");
      setLocation(`/polls/${pollId}`);
    } catch (err) {
      console.log("error --", err);
    }
  };

  const handleOptionChange = (index, e) => {
    let newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };
  //   useEffect(() => {
  //     if (inputFocused) {
  //       let input = document.getElementById(`option-${inputFocused}`);
  //       if (input) {
  //         input.focus();
  //       }
  //     }
  //   }, [inputFocused]);

  return (
    <form onSubmit={submit}>
      <div className="mb-2">
        <div>
          <label>Body</label>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="enter poll title here"
        />
      </div>

      <div>
        <label>Options:</label>
      </div>
      <div id="poll-options">
        <div style={{ display: "grid", gap: 5, marginBottom: 10 }}>
          {options.map((opt, index) => (
            <div key={`poll-option-${index}`}>
              <div className="relative inline-block">
                <input
                  id={`option-${index + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e)}
                  autoFocus={inputFocused === index + 1}
                  className="pr-8"
                />
                <div className="absolute top-0 px-2 right-0 bottom-0 inline-grid place-items-center">
                  <button
                    type="button"
                    disabled={options.length === 1}
                    className="bg-red-500 disabled:bg-red-200  text-white leading-normal rounded-full inline-grid place-items-center w-5 h-5 text-xs"
                    onClick={() => {
                      let newOptions = [...options];
                      newOptions.splice(index, 1);
                      setOptions(newOptions);
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="px-5 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => {
            let index = options.length + 1;
            setOptions(options.concat(`option ${index}`));
            setInputFocused(index);
          }}
        >
          add option
        </button>
      </div>
      <div className="mt-10">
        <button
          type="submit"
          className="bg-purple-200 text-purple-800 py-4 px-8 rounded-lg font-bold text-xl"
        >
          submit
        </button>
      </div>
    </form>
  );
};
