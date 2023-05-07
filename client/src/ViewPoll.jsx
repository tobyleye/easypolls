import { useEffect, useState } from "react";
import { customFetch } from "./api";
import dayjs from "dayjs";

export const ViewPoll = ({ id }) => {
  const [poll, setPoll] = useState(null);
  const [disableOptions, setDisableOptions] = useState(false);
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await customFetch(`/polls/${id}`);
        setPoll(data.data);
      } catch (err) {
        console.log("error --", err);
      }
    };

    if (id) {
      fetchPoll();
    }
  }, [id]);

  useEffect(() => {
    let votedPolls = JSON.parse(localStorage.getItem("votedPolls") ?? "[]");
    if (votedPolls[id]) {
      setChoice(votedPolls[id]);
      setDisableOptions(true);
    }
  }, [id]);

  const voteOption = async (option) => {
    console.log("vote options");
    try {
      setDisableOptions(true);
      const data = await customFetch(`/polls/${poll.id}/vote`, {
        method: "post",
        body: {
          choice: option,
        },
      });
      setChoice(option);
      setPoll(data.data);
      let votedPolls = JSON.parse(localStorage.getItem("votedPolls") ?? "{}");
      votedPolls[id] = option;
      localStorage.setItem("votedPolls", JSON.stringify(votedPolls));
      alert("your vote has been recorded.");
    } catch (err) {
      setDisableOptions(false);
    }
  };

  let totalVotes = 0;
  if (poll) {
    poll.options.forEach((opt) => {
      totalVotes += opt.votes;
    });
  }

  const getVotePercentage = (votes) => {
    if (votes === 0) return 0;
    return Number(((votes / totalVotes) * 100).toFixed(2));
  };

  return (
    <div>
      {!poll ? (
        <div>loading...</div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold mb-2">{poll.body}</h3>
            <div className="text-sm text-red-400">
              Expires at {dayjs(poll.expiresAt).format("YYYY-MM-DD HH:MM")}
            </div>
          </div>

          <div className="mb-8 text-sm">
            <div className="text-sm flex items-center text-gray-500 mb-2">
              created at{" "}
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300 mx-2"></span>{" "}
              {dayjs(poll.createdAt).format("YYYY-MM-DD HH:MM")}{" "}
            </div>
          </div>
          <div
            className="grid gap-2 w-[300px] mx-auto"
            style={{
              pointerEvents: disableOptions ? "none" : "visible",
            }}
          >
            {poll.options.map((opt, index) => (
              <div
                key={`poll-option-${index}`}
                className="flex items-center gap-2 relative"
              >
                <button
                  className="border w-full capitalize border-green-500 bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => voteOption(opt.option)}
                >
                  {opt.option}
                  {choice && (
                    <span style={{ marginLeft: 20 }}>
                      {getVotePercentage(opt.votes)}%
                    </span>
                  )}
                </button>
                {choice === opt.option && (
                  <div className="absolute -right-[30px]  top-0 bottom-0 inline-grid place-items-center">
                    <span aria-label="selected">👈</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
