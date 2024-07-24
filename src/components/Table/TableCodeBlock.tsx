import { useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import createTableHtml from "../../utils/createHtml";
import formatHtml from "../../utils/formatHtml";
import sanitizeHtml from "../../utils/sanitizeHtml";

function TableCodeBlock() {
  const [tabContent, setTabContent] = useState<"code" | "preview">("code");
  const [isMinified, setIsMinified] = useState(false);
  const table = useTableStore((state) => state.table);
  const tableHtml = createTableHtml(table);
  const code = sanitizeHtml(isMinified ? tableHtml : formatHtml(tableHtml));

  const handleMinify = () => {
    setIsMinified((prev) => !prev);
  };

  const handleChangeMode = (content: "code" | "preview") => {
    setTabContent(content);
  };

  return (
    <>
      <div>
        <input id="minify" type="checkbox" checked={isMinified} onChange={handleMinify} />
        <label htmlFor="minify">코드 최소화</label>
      </div>
      <div>
        <button onClick={() => handleChangeMode("code")} disabled={tabContent === "code"}>
          코드
        </button>
        <button onClick={() => handleChangeMode("preview")} disabled={tabContent === "preview"}>
          미리보기
        </button>
      </div>
      <div>
        {tabContent === "preview" ? (
          <div dangerouslySetInnerHTML={{ __html: code }} />
        ) : (
          <pre>
            <code>{code}</code>
          </pre>
        )}
      </div>
    </>
  );
}

export default TableCodeBlock;
