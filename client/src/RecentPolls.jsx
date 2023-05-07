import { useEffect, useState } from "react";
import { customFetch } from "./api";

export const RecentPolls = () => {
  const [data, setdata] = useState([]);

  useEffect(() => {
    const fetchRecentPolls = async () => {
      try {
        const data = await customFetch("/polls/latest", {
          method: "get",
        });
        setdata(data.data);
      } catch {}
    };

    fetchRecentPolls();
  }, []);
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">Recent polls</h3>
      {data.map((poll) => (
        <div key={`poll-${poll.id}`}>
          <a href={`/polls/${poll.id}`} className="underline text-purple-500">
            <h3>{poll.body}</h3>
          </a>
        </div>
      ))}
    </div>
  );
};
