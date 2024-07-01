type TableProps = {
  table: string[][];
  addRow: (count: number) => void;
  addColumn: (count: number) => void;
};

function Table({ table, addRow, addColumn }: TableProps) {
  return (
    <table>
      <tbody>
        {table.map((row, rowIdx) => (
          <tr key={`row-${rowIdx}`}>
            {row.map((column, colIdx) => (
              <td key={`${rowIdx}-${colIdx}`}>{column}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
