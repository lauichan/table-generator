import type { CellType } from '@/store/useTableStore';

const createTableHtml = (table: CellType[][], thead: number, tfoot: number): string => {
  let theadHtml = '';
  let tfootHtml = '';
  let tbodyHtml = '';

  if (thead > 0) {
    const headerRows = table.slice(0, thead);
    theadHtml = `<thead>${headerRows.map((row) => createRowHtml(row)).join('')}</thead>`;
  }

  if (tfoot > 0) {
    const footerRows = table.slice(-tfoot);
    tfootHtml = `<tfoot>${footerRows.map((row) => createRowHtml(row)).join('')}</tfoot>`;
  }

  const bodyRows = table.slice(thead > 0 ? thead : 0, tfoot > 0 ? -tfoot : table.length);

  if (thead || tfoot) {
    tbodyHtml = `<tbody>${bodyRows.map((row) => createRowHtml(row)).join('')}</tbody>`;
  } else {
    tbodyHtml = bodyRows.map((row) => createRowHtml(row)).join('');
  }

  return `<table>${theadHtml}${tbodyHtml}${tfootHtml}</table>`;
};

const createRowHtml = (row: CellType[]): string => {
  const html = row
    .map((cell) => (cell.type === 'head' ? createHeaderCellHtml(cell) : createDataCellHtml(cell)))
    .join('');
  return `<tr>${html}</tr>`;
};

const createDataCellHtml = (cell: CellType): string => {
  const { content, merged } = cell;
  if (merged && !merged.origin) return '';
  const rowSpan = merged ? ` rowSpan="${merged.rowSpan}"` : '';
  const colSpan = merged ? ` colSpan="${merged.colSpan}"` : '';
  return `<td${rowSpan}${colSpan}>${content}</td>`;
};

const createHeaderCellHtml = (cell: CellType): string => {
  const { content, merged } = cell;
  if (merged && !merged.origin) return '';
  const rowSpan = merged ? ` rowSpan="${merged.rowSpan}"` : '';
  const colSpan = merged ? ` colSpan="${merged.colSpan}"` : '';
  return `<th${rowSpan}${colSpan}>${content}</th>`;
};

export default createTableHtml;
