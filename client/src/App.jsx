import { NewPoll } from "./NewPoll";
import { RecentPolls } from "./RecentPolls";
import { ViewPoll } from "./ViewPoll";
import { Link, Route } from "wouter";

function App() {
  return (
    <>
      <div className="max-w-2xl mx-auto pt-4 border-l-2 border-b-2 border-r-2 border-purple-400 px-8 pb-5">
        <h1 className="text-2xl font-bold text-center mb-4">
          Welcome to easy<span className="text-purple-500">polls</span>
        </h1>
        <nav className="nav flex justify-center mb-8">
          <Link href="/new">Polls</Link>
          <span className="mx-2">/</span>
          <Link href="/recent">Recent</Link>
        </nav>
        <Route path="/">
          <NewPoll />
        </Route>
        <Route path="/new">
          <NewPoll />
        </Route>
        <Route path="/recent">
          <RecentPolls />
        </Route>
        <Route path="/polls/:id">
          {(params) => <ViewPoll id={params.id} />}
        </Route>
      </div>
    </>
  );
}

export default App;
