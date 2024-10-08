import { type ChangeEvent, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import type { CellInfo } from '@store/useTableStore';
import createTableHtml from '@utils/createHtml';
import formatHtml from '@utils/formatHtml';
import sizeLimit from '@utils/sizeLimit';
import sanitizeHtml from '@utils/sanitizeHtml';
import styles from './PreviewCode.module.css';
import { TAB_SIZE } from '@/constants/constants';

function PreviewCode({ table }: { table: CellInfo[][] }) {
  const codeRef = useRef<HTMLElement>(null);
  const [tabSize, setTabSize] = useState(TAB_SIZE.MAX);

  const { minified, thead, tfoot, toggleMinified } = useOptionStore(
    useShallow((state) => ({
      minified: state.minified,
      thead: state.thead,
      tfoot: state.tfoot,
      toggleMinified: state.toggleMinified,
    })),
  );

  const tableHtml = createTableHtml(table, thead, tfoot);
  const code = minified ? tableHtml : formatHtml(tableHtml, tabSize);

  const handleTabSize = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTabSize(sizeLimit(value, TAB_SIZE.MIN, TAB_SIZE.MAX));
  };

  const handleCopyCode = () => {
    try {
      const text = codeRef.current;
      if (!text || !text.textContent) throw new Error('복사할 텍스트가 없습니다.');
      navigator.clipboard.writeText(text.textContent);
      alert('클립보드에 복사되었습니다.');
    } catch (error) {
      alert('클립보드 복사에 실패하였습니다.');
    }
  };

  return (
    <>
      <section className={styles['code']}>
        <div className={styles['options']}>
          <button onClick={handleCopyCode} title="코드 내용을 복사합니다">
            코드복사
          </button>
          <div className={styles['minify']}>
            <input id="minify" type="checkbox" checked={minified} onChange={toggleMinified} />
            <label htmlFor="minify" title="HTML 코드 공백을 제거합니다">
              코드 최소화
            </label>
          </div>
          {!minified && (
            <div className={styles['tabsize']}>
              <label htmlFor="tabsize" title="탭 크기 조절 (2 ~ 4)">
                탭 크기
              </label>
              <input id="tabsize" type="number" value={tabSize} onChange={handleTabSize} />
            </div>
          )}
        </div>
        <pre className={styles['html']}>
          <code ref={codeRef}>{code}</code>
        </pre>
      </section>
      <section className={styles['preview']}>
        <h2 id="preview">미리보기</h2>
        <div className="table-wrapper" dangerouslySetInnerHTML={{ __html: sanitizeHtml(code) }} />
      </section>
    </>
  );
}

export default PreviewCode;
