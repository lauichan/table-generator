import { useTableStore } from "../../store/useTableStore";
import createTableHtml from "../../utils/createHtml";
import formatHtml from "../../utils/formatHtml";

function TableCodeBlock() {
  const table = useTableStore((state) => state.table);

  return <pre>{formatHtml(createTableHtml(table))}</pre>;
}

export default TableCodeBlock;
