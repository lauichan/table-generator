import type { CellType } from '@/store/useTableStore';

const createTableHtml = (table: CellType[][], thead: number, tfoot: number): string => {
  const headerRows = table.slice(0, thead);
  const footerRows = table.slice(-tfoot);
  const bodyRows = table.slice(thead > 0 ? thead : 0, tfoot > 0 ? -tfoot : table.length);

  const theadHtml = thead > 0 ? `<thead>${headerRows.map((row) => createRowHtml(row)).join('')}</thead>` : '';
  const tfootHtml = tfoot > 0 ? `<tfoot>${footerRows.map((row) => createRowHtml(row)).join('')}</tfoot>` : '';
  const tbodyHtml =
    thead || tfoot
      ? `<tbody>${bodyRows.map((row) => createRowHtml(row)).join('')}</tbody>`
      : bodyRows.map((row) => createRowHtml(row)).join('');

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
