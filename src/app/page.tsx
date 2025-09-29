'use client';

import React, { useState } from 'react';
import styles from './bill.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bill = () => {
  const [htmlInput, setHtmlInput] = useState('');

  const handleExtract = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');

    const searchContainer = doc.querySelector('div.search_container');
    if (!searchContainer) {
      toast.error('❌ search_container를 찾을 수 없습니다.');
      return;
    }

    const table = searchContainer.querySelector('table');
    if (!table) {
      toast.error('❌ table을 찾을 수 없습니다.');
      return;
    }

    const rows = table.querySelectorAll('tbody > tr');
    const extractedData: string[] = [];

    rows.forEach((row, index) => {
      if (index % 2 === 1) {
        const cells = row.querySelectorAll('td');
        if (cells.length < 10) return;

        const td4Raw = cells[3]?.innerHTML || '';
        const td4 = td4Raw.split('<br>').pop()?.trim() || '';

        const td5 = cells[4]?.textContent?.trim() || '';

        const td7Input = cells[6]?.querySelector('input');
        const td7 = td7Input?.getAttribute('value') || '';

        const td8 = cells[7]?.textContent?.trim() || '';
        const td9 = cells[8]?.textContent?.trim() || '';

        const rowData = [td4, td5, index === 1 ? "출고수량" : td7, td8, td9].join('\t');
        extractedData.push(rowData);
      }
    });

    if (extractedData.length === 0) {
      toast.warning('⚠️ 추출된 데이터가 없습니다.');
      return;
    }

    const finalText = extractedData.join('\n');

    navigator.clipboard.writeText(finalText)
      .then(() => toast.success('데이터가 클립보드에 복사되었습니다. 엑셀에 붙여넣으세요.'))
      .catch(() => toast.error('클립보드 복사에 실패했습니다.'));
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textarea}
        placeholder="HTML 코드를 여기에 붙여넣으세요"
        value={htmlInput}
        onChange={(e) => setHtmlInput(e.target.value)}
      />
      <button className={styles.button} onClick={handleExtract}>
        추출
      </button>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Bill;
