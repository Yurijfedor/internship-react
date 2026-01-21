import UserCard from "./UserCard";
import AiAssistant from "./AIAssistant";
import BeehiveCheck from "./BeehiveCheck";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <h1>Intern Dashboard</h1>

        <UserCard name="Yurii" method={1} />
        <UserCard name="AI Bot" method={0} />
        <AiAssistant />
        <BeehiveCheck />
      </div>
    </>
  );
}

export default App;
