import type { CellType } from "../store/useTableStore";

const createTableHtml = (table: CellType[][], thead: boolean, tfoot: boolean): string => {
  let theadHtml = "";
  let tfootHtml = "";
  let tbodyHtml = "";

  if (thead) {
    theadHtml = `<thead>${createRowHtml(table[0], thead)}</thead>`;
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

const createRowHtml = (row: CellType[], thead: boolean = false) => {
  const html = row
    .map(({ type, content }) =>
      thead || type === "head" ? createHeadHtml(content) : createDefineHtml(content)
    )
    .join("");
  return `<tr>${html}</tr>`;
};

const createDefineHtml = (text: string) => {
  return `<td>${text}</td>`;
};

const createHeadHtml = (head: string) => {
  return `<th>${head}</th>`;
};

export default createTableHtml;
