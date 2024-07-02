type TableProps = {
  table: string[][];
  addRowColumn: (rowCount: number, columnCount: number) => void;
};

function Table({ table, addRowColumn }: TableProps) {
  return (
    <div className="table">
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
      <button className="add-col" onClick={() => addRowColumn(0, 1)}>
        +
      </button>
      <button className="add-row" onClick={() => addRowColumn(1, 0)}>
        +
      </button>
      <button
        className="add-col-and-row"
        onClick={() => {
          addRowColumn(1, 1);
        }}
      >
        +
      </button>
    </div>
  );
}

export default Table;
