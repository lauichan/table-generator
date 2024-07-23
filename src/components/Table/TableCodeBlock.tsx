import { useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import createTableHtml from "../../utils/createHtml";
import formatHtml from "../../utils/formatHtml";

function TableCodeBlock() {
  const table = useTableStore((state) => state.table);
  const [isMinified, setIsMinified] = useState(false);
  const tableHtml = createTableHtml(table);

  const handleMinify = () => {
    setIsMinified((prev) => !prev);
  };

  return (
    <>
      <div>
        <input id="minify" type="checkbox" checked={isMinified} onChange={handleMinify} />
        <label htmlFor="minify">코드 최소화</label>
      </div>
      <pre>{isMinified ? tableHtml : formatHtml(tableHtml)}</pre>
    </>
  );
}

export default TableCodeBlock;
