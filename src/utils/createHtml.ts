const createTableHtml = (table: string[][]) => {
  const html = table.map((row) => createRowHtml(row)).join("")
  return `<table>${html}</table>`
};

const createRowHtml = (row: string[]) => {
  const html = row.map((define) => createDefineHtml(define)).join("")
  return `<tr>${html}</tr>`
};

const createDefineHtml = (define: string) => {
  return `<td>${define}</td>`
}

export default createTableHtml