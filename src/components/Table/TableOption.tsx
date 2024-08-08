import type { ChangeEvent } from "react";

import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTableStore } from "../../store/useTableStore";
import { useOptionStore } from "../../store/useOptionStore";
import createTableHtml from "../../utils/createHtml";
import formatHtml from "../../utils/formatHtml";
import sanitizeHtml from "../../utils/sanitizeHtml";
import sizeLimit from "../../utils/sizeLimit";
import styles from "./TableOption.module.css";

function TableOption() {
  const codeRef = useRef<HTMLElement>(null);
  const [tabSize, setTabSize] = useState(4);
  const [table, toggleHeadType] = useTableStore(
    useShallow((state) => [state.table, state.toggleHeadType])
  );

  const [minified, thead, tfoot, toggleMinified, toggleThead, toggleTfoot] = useOptionStore(
    useShallow((state) => [
      state.minified,
      state.thead,
      state.tfoot,
      state.toggleMinified,
      state.toggleThead,
      state.toggleTfoot,
    ])
  );

  const tableHtml = createTableHtml(table, thead, tfoot);
  const code = minified ? tableHtml : formatHtml(tableHtml, tabSize);

  const handleTabSize = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTabSize(sizeLimit(value, 2, 4));
  };

  const handleCopyCode = () => {
    try {
      const text = codeRef.current;
      if (!text || !text.textContent) throw new Error("복사할 텍스트가 없습니다.");
      navigator.clipboard.writeText(text.textContent);
      alert("클립보드에 복사되었습니다.");
    } catch (error) {
      alert("클립보드 복사에 실패하였습니다.");
    }
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
        <li>
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
      <section className={styles["tab"]}>
        <h2>코드</h2>
        <button onClick={handleCopyCode}>코드복사</button>
        <pre className={styles["html"]}>
          <code ref={codeRef}>{code}</code>
        </pre>
      </section>
      <section>
        <h2>미리보기</h2>
        <div
          className={styles["preview"]}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(code) }}
        />
      </section>
    </>
  );
}

export default TableOption;
