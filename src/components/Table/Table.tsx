function Table({ table }: { table: string[][] }) {
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
