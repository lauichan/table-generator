import { useRef } from "react";
import { useTableStore } from "../../store/useTableStore";
import { useOptionStore } from "../../store/useOptionStore";
import createTableHtml from "../../utils/createHtml";
import formatHtml from "../../utils/formatHtml";
import sanitizeHtml from "../../utils/sanitizeHtml";
import styles from "./TableCodeBlock.module.css";

function TableCodeBlock() {
  const codeRef = useRef<HTMLElement>(null);
  const table = useTableStore((state) => state.table);
  const { minified, thead, tfoot, toggleMinified, toggleThead, toggleTfoot } = useOptionStore(
    (state) => ({
      minified: state.minified,
      thead: state.thead,
      tfoot: state.tfoot,
      toggleMinified: state.toggleMinified,
      toggleThead: state.toggleThead,
      toggleTfoot: state.toggleTfoot,
    })
  );

  const tableHtml = createTableHtml(table, thead, tfoot);
  const code = minified ? tableHtml : formatHtml(tableHtml);

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
    <>
      <ul className={styles["option"]}>
        <li>
          <input id="minify" type="checkbox" checked={minified} onChange={toggleMinified} />
          <label htmlFor="minify">코드 최소화</label>
        </li>
        <li>
          <input id="thead" type="checkbox" checked={thead} onChange={toggleThead} />
          <label htmlFor="thead">머리글 사용</label>
        </li>
        <li>
          <input id="tfoot" type="checkbox" checked={tfoot} onChange={toggleTfoot} />
          <label htmlFor="tfoot">바닥글 사용</label>
        </li>
      </ul>
      <div className={styles["tab"]}>
        <button onClick={handleCopyCode}>코드복사</button>

        <pre className={styles["html"]}>
          <code ref={codeRef}>{code}</code>
        </pre>
        <strong>미리보기</strong>
        <div
          className={styles["preview"]}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(code) }}
        />
      </div>
    </>
  );
}

export default TableCodeBlock;
