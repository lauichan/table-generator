import type { CellType } from "../store/useTableStore";

const createTableHtml = (table: CellType[][], thead: boolean, tfoot: boolean): string => {
  let theadHtml = "";
  let tfootHtml = "";
  let tbodyHtml = "";

  if (thead) {
    theadHtml = `<thead>${createRowHtml(table[0])}</thead>`;
  }

  if (tfoot) {
    tfootHtml = `<tfoot>${createRowHtml(table[table.length - 1])}</tfoot>`;
  }

  const tbody = table.slice(thead ? 1 : 0, tfoot ? -1 : table.length);

  if (thead || tfoot) {
    tbodyHtml = `<tbody>${tbody.map((row) => createRowHtml(row)).join("")}</tbody>`;
  } else {
    tbodyHtml = tbody.map((row) => createRowHtml(row)).join("");
  }

  return `<table>${theadHtml}${tbodyHtml}${tfootHtml}</table>`;
};

const createRowHtml = (row: CellType[]): string => {
  const html = row
    .map((cell) => (cell.type === "head" ? createHeadHtml(cell) : createDefineHtml(cell)))
    .join("");
  return `<tr>${html}</tr>`;
};

const createDefineHtml = (cell: CellType): string => {
  const { content, merged } = cell;
  if (merged && !merged.origin) return "";
  const rowSpan = merged ? ` rowSpan="${merged.rowSpan}"` : "";
  const colSpan = merged ? ` colSpan="${merged.colSpan}"` : "";
  return `<td${rowSpan}${colSpan}>${content}</td>`;
};

const createHeadHtml = (cell: CellType): string => {
  const { content, merged } = cell;
  if (merged && !merged.origin) return "";
  const rowSpan = merged ? ` rowSpan="${merged.rowSpan}"` : "";
  const colSpan = merged ? ` colSpan="${merged.colSpan}"` : "";
  return `<th${rowSpan}${colSpan}>${content}</th>`;
};

export default createTableHtml;
