import type { FocusEvent } from 'react';
import type { CellInfo } from '@store/useTableStore';

import Cell from '@components/Cell/Cell';
import TableSizer from '@components/TableSizer/TableSizer';
import ContextMenu from '@components/ContextMenu/ContextMenu';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import { useTableStore } from '@store/useTableStore';
import useArrowNavigate from '@hooks/useArrowNavigate';
import useContextMenu from '@hooks/useContextMenu';
import useSelectCells from '@hooks/useSelectCells';
import htmlEscape from '@utils/htmlEscape';
import styles from './Table.module.css';

function Table({ table }: { table: CellInfo[][] }) {
  const { tableRef, handleMouseDown, handleMouseOver, handleMouseUp, isSelectedCell, setSelectRange } =
    useSelectCells(table);
  const { cellRefs, handleKeyDown } = useArrowNavigate(table);
  const { contextMenu, contextMenuRef, handleContextMenu } = useContextMenu();

  const [thead, tfoot] = useOptionStore(useShallow((state) => [state.thead, state.tfoot]));
  const setTableText = useTableStore((state) => state.setTableText);

  const headerRows = useMemo(() => table.slice(0, thead), [table, thead]);
  const footerRows = useMemo(() => table.slice(-tfoot), [table, tfoot]);
  const bodyRows = useMemo(
    () => table.slice(thead > 0 ? thead : 0, tfoot > 0 ? -tfoot : table.length),
    [table, thead, tfoot],
  );

  useEffect(() => {
    setSelectRange(null);
  }, [thead, tfoot, setSelectRange]);

  const handleFocusOut = (e: FocusEvent<HTMLTableCellElement, Element>, rowIdx: number, colIdx: number) => {
    const text = htmlEscape(e.currentTarget.innerText);
    setTableText(rowIdx, colIdx, text);
  };

  const commonProps = {
    cellRefs: cellRefs,
    handleFocusOut: handleFocusOut,
    handleKeyDown: handleKeyDown,
    handleContextMenu: handleContextMenu,
    handleMouseDown: handleMouseDown,
    handleMouseOver: handleMouseOver,
    handleMouseUp: handleMouseUp,
  };

  return (
    <section className={styles['table']}>
      <table ref={tableRef} onMouseLeave={handleMouseUp}>
        {thead ? (
          <thead>
            {headerRows.map((row, rowIdx) => (
              <tr key={`thead-${rowIdx}`}>
                {row.map((cell, colIdx) => (
                  <Cell
                    key={`thead-${rowIdx}-${colIdx}`}
                    cell={cell}
                    selected={isSelectedCell(rowIdx, colIdx)}
                    rowIdx={rowIdx}
                    colIdx={colIdx}
                    {...commonProps}
                  />
                ))}
              </tr>
            ))}
          </thead>
        ) : (
          <></>
        )}
        <tbody>
          {bodyRows.map((row, rowIdx) => (
            <tr key={`tbody-${rowIdx}`}>
              {row.map((cell, colIdx) => (
                <Cell
                  key={`tbody-${rowIdx}-${colIdx}`}
                  cell={cell}
                  selected={isSelectedCell(rowIdx + thead, colIdx)}
                  rowIdx={rowIdx + thead}
                  colIdx={colIdx}
                  {...commonProps}
                />
              ))}
            </tr>
          ))}
        </tbody>
        {tfoot ? (
          <tfoot>
            {footerRows.map((row, rowIdx) => (
              <tr key={`tfoot-${rowIdx}`}>
                {row.map((cell, colIdx) => (
                  <Cell
                    key={`tfoot-${rowIdx}-${colIdx}`}
                    cell={cell}
                    selected={isSelectedCell(table.length - tfoot + rowIdx, colIdx)}
                    rowIdx={table.length - tfoot + rowIdx}
                    colIdx={colIdx}
                    {...commonProps}
                  />
                ))}
              </tr>
            ))}
          </tfoot>
        ) : (
          <></>
        )}
      </table>
      <TableSizer />
      {contextMenu && <ContextMenu contextMenuRef={contextMenuRef} position={contextMenu} />}
    </section>
  );
}

export default Table;
