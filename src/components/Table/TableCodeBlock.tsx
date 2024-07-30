import { ChangeEvent, useRef, useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import { useOptionStore } from "../../store/useOptionStore";
import createTableHtml from "../../utils/createHtml";
import formatHtml from "../../utils/formatHtml";
import sanitizeHtml from "../../utils/sanitizeHtml";
import sizeLimit from "../../utils/sizeLimit";
import styles from "./TableCodeBlock.module.css";

function TableCodeBlock() {
  const [tabSize, setTabSize] = useState(4);
  const codeRef = useRef<HTMLElement>(null);
  const table = useTableStore((state) => state.table);
  const toggleHeadType = useTableStore((state) => state.toggleHeadType);
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
  const code = minified ? tableHtml : formatHtml(tableHtml, tabSize);

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

  const handleTabSize = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTabSize(sizeLimit(value, 2, 4));
  };

  const handleToggleThead = () => {
    toggleThead();
    toggleHeadType(thead ? "define" : "head");
  };

  return (
    <>
      <ul className={styles["option"]}>
        <li>
          <input id="minify" type="checkbox" checked={minified} onChange={toggleMinified} />
          <label htmlFor="minify">코드 최소화</label>
        </li>
        <li>
          <input id="thead" type="checkbox" checked={thead} onChange={handleToggleThead} />
          <label htmlFor="thead">머리글 사용</label>
        </li>
        <li>
          <input id="tfoot" type="checkbox" checked={tfoot} onChange={toggleTfoot} />
          <label htmlFor="tfoot">바닥글 사용</label>
        </li>
        <li className={minified ? styles["disabled"] : ""}>
          <input
            id="tabsize"
            type="number"
            value={tabSize}
            onChange={handleTabSize}
            disabled={minified}
          />
          <label htmlFor="tabsize">탭 크기</label>
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
