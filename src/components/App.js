import Reviewlist from "./ReviewList";
import items from "../mock.json";

function App() {
  return (
    <div>
      <Reviewlist items={items} />
    </div>
  );
}

export default App;
