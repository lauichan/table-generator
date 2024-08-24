import { useTableStore } from '@store/useTableStore';
import styles from './TableSizer.module.css';
import { useOptionStore } from '@store/useOptionStore';

function TableSizer() {
  const setRowColumn = useTableStore((state) => state.setRowColumn);
  const thead = useOptionStore((state) => state.thead);

  return (
    <>
      <button className={styles['right']} onClick={() => setRowColumn(0, 1, thead)} title="열 추가">
        +
      </button>
      <button className={styles['bottom']} onClick={() => setRowColumn(1, 0)} title="행 추가">
        +
      </button>
      <button className={styles['bottom-right']} onClick={() => setRowColumn(1, 1)} title="행 열 1 추가">
        +
      </button>
    </>
  );
}

export default TableSizer;
