import { useEffect } from "react";
import TableEditor from "./components/Table/TableEditor";
import TableOption from "./components/Table/TableOption";

function App() {
  useEffect(() => {
    document.oncontextmenu = function () {
      return false;
    };
  }, []);

  return (
    <main>
      <TableEditor />
      <TableOption />
    </main>
  );
}

export default App;
