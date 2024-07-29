import { useRef, useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import createTableHtml from "../../utils/createHtml";
import formatHtml from "../../utils/formatHtml";
import sanitizeHtml from "../../utils/sanitizeHtml";
import styles from "./TableCodeBlock.module.css";

function TableCodeBlock() {
  const [isMinified, setIsMinified] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const { table, thead, tfoot, toggleThead, toggleTfoot } = useTableStore((state) => ({
    table: state.table,
    thead: state.thead,
    tfoot: state.tfoot,
    toggleThead: state.toggleThead,
    toggleTfoot: state.toggleTfoot,
  }));

  const tableHtml = createTableHtml(table, thead, tfoot);
  const code = isMinified ? tableHtml : formatHtml(tableHtml);

  const handleMinify = () => {
    setIsMinified((prev) => !prev);
  };

  const handleCopyCode = () => {
    const text = codeRef.current;
    try {
      if (!text) throw "실패";
      navigator.clipboard.writeText(text.textContent || "");
      alert("클립보드에 복사되었습니다.");
    } catch (error) {
      alert("클립보드 복사에 실패하였습니다.");
    }
  };

  return (
    <div className={styles["tab"]}>
      <button onClick={handleCopyCode}>코드복사</button>
      <input id="minify" type="checkbox" checked={isMinified} onChange={handleMinify} />
      <label htmlFor="minify">코드 최소화</label>
      <input id="thead" type="checkbox" checked={thead} onChange={toggleThead} />
      <label htmlFor="thead">머리글 사용</label>
      <input id="tfoot" type="checkbox" checked={tfoot} onChange={toggleTfoot} />
      <label htmlFor="tfoot">바닥글 사용</label>
      <pre className={styles["html"]}>
        <code ref={codeRef}>{code}</code>
      </pre>
      <strong>미리보기</strong>
      <div className={styles["preview"]} dangerouslySetInnerHTML={{ __html: sanitizeHtml(code) }} />
    </div>
  );
}

export default TableCodeBlock;
