import type { CellInfo } from '@/store/useTableStore';

const createTableHtml = (table: CellInfo[][], thead: number, tfoot: number): string => {
  const headerRows = table.slice(0, thead);
  const footerRows = table.slice(-tfoot);
  const bodyRows = table.slice(thead > 0 ? thead : 0, tfoot > 0 ? -tfoot : table.length);

  const theadHtml =
    thead > 0 ? `<thead>${headerRows.map((row, rowIdx) => createRowHtml(row, rowIdx)).join('')}</thead>` : '';
  const tfootHtml =
    tfoot > 0
      ? `<tfoot>${footerRows.map((row, rowIdx) => createRowHtml(row, table.length - tfoot + rowIdx)).join('')}</tfoot>`
      : '';
  const tbodyHtml = bodyRows.map((row, rowIdx) => createRowHtml(row, rowIdx + thead)).join('');

  return `<table>${theadHtml}${thead || tfoot ? '<tbody>' : ''}${tbodyHtml}${thead || tfoot ? '</tbody>' : ''}${tfootHtml}</table>`;
};

const createRowHtml = (row: CellInfo[], rowIdx: number): string => {
  const html = row.map((cell, colIdx) => createCellHtml(cell, rowIdx, colIdx)).join('');
  if (html === '') return '';
  return `<tr>${html}</tr>`;
};

const createCellHtml = (cell: CellInfo, rowIdx: number, colIdx: number): string => {
  const { type, content, merged } = cell;
  if (merged && (merged.rowIdx !== rowIdx || merged.colIdx !== colIdx)) return '';
  const rowSpan = merged ? ` rowSpan="${merged.rowSpan}"` : '';
  const colSpan = merged ? ` colSpan="${merged.colSpan}"` : '';
  const tagName = type === 'head' ? 'th' : 'td';
  return `<${tagName}${rowSpan}${colSpan}>${content}</${tagName}>`;
};

export default createTableHtml;
