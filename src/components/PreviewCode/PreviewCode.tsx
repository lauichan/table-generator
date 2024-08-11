import type { ChangeEvent } from "react";
import type { CellType } from "@store/useTableStore";

import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useOptionStore } from "@store/useOptionStore";
import createTableHtml from "@utils/createHtml";
import formatHtml from "@utils/formatHtml";
import sizeLimit from "@utils/sizeLimit";
import sanitizeHtml from "@utils/sanitizeHtml";
import styles from "./PreviewCode.module.css";

function PreviewCode({ table }: { table: CellType[][] }) {
  const codeRef = useRef<HTMLElement>(null);
  const [tabSize, setTabSize] = useState(4);

  const [minified, thead, tfoot, toggleMinified] = useOptionStore(
    useShallow((state) => [state.minified, state.thead, state.tfoot, state.toggleMinified])
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

  return (
    <>
      <section className={styles["code"]}>
        <h2>코드</h2>
        <button onClick={handleCopyCode}>코드복사</button>
        <input
          id="tabsize"
          type="number"
          value={tabSize}
          onChange={handleTabSize}
          disabled={minified}
        />
        <label htmlFor="tabsize">탭 크기</label>
        <input id="minify" type="checkbox" checked={minified} onChange={toggleMinified} />
        <label htmlFor="minify">코드 최소화</label>
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

export default PreviewCode;
