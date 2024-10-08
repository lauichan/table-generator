import Cell from '@components/Cell/Cell';
import TableSizer from '@components/TableSizer/TableSizer';
import ContextMenu from '@components/ContextMenu/ContextMenu';
import { type FocusEvent, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import { type CellInfo, useTableStore } from '@store/useTableStore';
import useArrowNavigate from '@hooks/useArrowNavigate';
import useContextMenu from '@hooks/useContextMenu';
import useSelectCells from '@hooks/useSelectCells';
import htmlEscape from '@utils/htmlEscape';
import styles from './Table.module.css';

function Table({ table }: { table: CellInfo[][] }) {
  const {
    tableRef,
    isSelecting,
    handleCellSelectStart,
    handleCellSelecting,
    handleCellSelectEnd,
    handleFocusCell,
    isSelectedCell,
    setSelectRange,
  } = useSelectCells();
  const { cellRefs, handleCellNavigate } = useArrowNavigate(table);
  const { contextMenu, contextMenuRef, handleContextMenu } = useContextMenu();

  const { thead, tfoot } = useOptionStore(useShallow((state) => ({ thead: state.thead, tfoot: state.tfoot })));
  const setCellText = useTableStore((state) => state.setCellText);

  const headerRows = useMemo(() => table.slice(0, thead), [table, thead]);
  const footerRows = useMemo(() => table.slice(-tfoot), [table, tfoot]);
  const bodyRows = useMemo(
    () => table.slice(thead > 0 ? thead : 0, tfoot > 0 ? -tfoot : table.length),
    [table, thead, tfoot],
  );

  useEffect(() => {
    setSelectRange(null);
  }, [thead, tfoot, setSelectRange]);

  const handleOnBlur = (e: FocusEvent<HTMLTableCellElement, Element>, rowIdx: number, colIdx: number) => {
    const text = htmlEscape(e.currentTarget.innerText);
    setCellText(rowIdx, colIdx, text);
  };

  const commonProps = {
    cellRefs: cellRefs,
    handleKeyDown: handleCellNavigate,
    handleContextMenu: handleContextMenu,
    handleMouseDown: handleCellSelectStart,
    handleMouseOver: handleCellSelecting,
    handleMouseUp: handleCellSelectEnd,
    handleOnFocus: handleFocusCell,
    handleOnBlur: handleOnBlur,
  };

  return (
    <section className={styles['table']}>
      <div className="table-wrapper">
        <table ref={tableRef} onMouseLeave={handleCellSelectEnd} onContextMenu={(e) => e.preventDefault()}>
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
      </div>
      <TableSizer />
      {contextMenu && !isSelecting && <ContextMenu contextMenuRef={contextMenuRef} position={contextMenu} />}
    </section>
  );
}

export default Table;
