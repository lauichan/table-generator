import { useTableStore } from '@store/useTableStore';
import styles from './TableSizer.module.css';
import { useOptionStore } from '@store/useOptionStore';

function TableSizer() {
  const [setRow, setColumn] = useTableStore((state) => [state.setRow, state.setColumn]);
  const thead = useOptionStore((state) => state.thead);

  const setRowColumn = (row: number, column: number, thead: number) => {
    setRow(row);
    setColumn(column, thead);
  };

  return (
    <>
      <button className={styles['right']} onClick={() => setColumn(1, thead)} title="열 추가">
        +
      </button>
      <button className={styles['bottom']} onClick={() => setRow(1)} title="행 추가">
        +
      </button>
      <button className={styles['bottom-right']} onClick={() => setRowColumn(1, 1, thead)} title="행 열 1 추가">
        +
      </button>
    </>
  );
}

export default TableSizer;
