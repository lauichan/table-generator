const createTableHtml = (table: string[][], thead: boolean, tfoot: boolean) => {
  let theadHtml = '';
  let tfootHtml = '';
  let tbodyHtml = '';

  if (thead) {
    theadHtml = `<thead>${createRowHtml(table[0])}</thead>`;
  }

  if (tfoot) {
    tfootHtml = `<tfoot>${createRowHtml(table[table.length - 1])}</tfoot>`;
  }

  const tbody = thead
    ? tfoot
      ? table.slice(1, table.length - 1)
      : table.slice(1)
    : tfoot
    ? table.slice(0, table.length - 1)
    : table;

  if (thead || tfoot) {
    tbodyHtml = `<tbody>${tbody.map((row) => createRowHtml(row)).join('')}</tbody>`;
  } else {
    tbodyHtml = tbody.map((row) => createRowHtml(row)).join('')
  }

  return `<table>${theadHtml}${tbodyHtml}${tfootHtml}</table>`;
};

const createRowHtml = (row: string[]) => {
  const html = row.map((define) => createDefineHtml(define)).join("")
  return `<tr>${html}</tr>`
};

const createDefineHtml = (define: string) => {
  return `<td>${define}</td>`
}

export default createTableHtml