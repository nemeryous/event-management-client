import React, { useState } from 'react';

const COLORS = {
  primary: '#223B73',
  yellow: '#FFD012',
  red: '#C52032',
};

const questions = [
  {
    text: 'Thủ đô của Việt Nam là?',
    options: [
      'A. TP. Hồ Chí Minh',
      'B. Hà Nội',
      'C. Đà Nẵng',
      'D. Hải Phòng',
    ],
  },
  {
    text: 'Biển lớn nhất thế giới là?',
    options: [
      'A. Biển Đông',
      'B. Biển Đỏ',
      'C. Thái Bình Dương',
      'D. Đại Tây Dương',
    ],
  },
  {
    text: 'Tác giả Truyện Kiều là ai?',
    options: [
      'A. Nguyễn Du',
      'B. Nguyễn Trãi',
      'C. Hồ Xuân Hương',
      'D. Nguyễn Đình Chiểu',
    ],
  },
  {
    text: 'Số tỉnh thành của Việt Nam là?',
    options: [
      'A. 63',
      'B. 64',
      'C. 61',
      'D. 60',
    ],
  },
  {
    text: 'Dân số Việt Nam hiện tại khoảng?',
    options: [
      'A. 95 triệu',
      'B. 97 triệu',
      'C. 99 triệu',
      'D. 101 triệu',
    ],
  },
  // Thêm nhiều câu hỏi để test scroll
  ...Array.from({length: 15}, (_, i) => ({
    text: `Câu hỏi phụ số ${i+6}: Nội dung câu hỏi rất dài để test giao diện và scroll bar cho đáp án. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    options: [
      'A. Đáp án 1 rất dài để test giao diện và scroll bar cho đáp án',
      'B. Đáp án 2',
      'C. Đáp án 3',
      'D. Đáp án 4',
      'E. Đáp án 5',
      'F. Đáp án 6',
    ],
  }))
];

export default function AnswerQuestion() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleSelect = (idx) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  };

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : c));
  const next = () => setCurrent((c) => (c < questions.length - 1 ? c + 1 : c));

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      boxSizing: 'border-box',
    }}>
      <style>{`
        .aq-main-flex {
          display: flex;
          gap: 32px;
          align-items: stretch;
          justify-content: center;
        }
        .aq-fixed-box {
          width: 650px;
          min-width: 0;
          height: 1100px;
          max-height: 98vh;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(34,59,115,0.10);
          padding: 32px 32px 24px 32px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          position: relative;
        }
        .aq-nav-col {
          width: 340px;
          min-width: 0;
          height: 1100px;
          max-height: 98vh;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(34,59,115,0.10);
          padding: 32px 18px 24px 18px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          position: relative;
        }
        .aq-nav-top-btns {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }
        .aq-nav-steps-scroll {
          flex: 1 1 auto;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 18px;
        }
        .aq-nav-steps-list {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          justify-items: center;
          width: 100%;
        }
        .aq-step {
          border-radius: 8px !important;
          width: 38px !important;
          height: 38px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 17px;
          border: 1.5px solid #e9eaf0;
          color: #223B73;
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .aq-step.current {
          background: #C52032 !important;
          color: #fff !important;
          border: none !important;
          cursor: default !important;
        }
        .aq-step.answered {
          background: #FFD012 !important;
          color: #223B73 !important;
          border: none !important;
        }
        .aq-nav-bottom {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .aq-options-scroll {
          flex: 1 1 auto;
          min-height: 0;
          max-height: 600px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        .aq-question-content {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .aq-question-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: auto;
        }
        @media (max-width: 900px) {
          .aq-main-flex { gap: 12px; }
          .aq-fixed-box { width: 99vw; max-width: 100vw; height: 480px; max-height: none; padding: 16px 2vw 16px 2vw; }
          .aq-nav-col { width: 90vw; max-width: 99vw; height: 480px; max-height: none; padding: 16px 2vw 16px 2vw; }
        }
        @media (max-width: 768px) {
          .aq-main-flex {
            flex-direction: column;
            gap: 0;
            align-items: stretch;
          }
          .aq-fixed-box, .aq-nav-col {
            width: 100vw;
            min-width: 0;
            max-width: 100vw;
            height: auto;
            min-height: 420px;
            max-height: none;
            padding: 12px 2vw 12px 2vw;
            margin-bottom: 18px;
          }
          .aq-options-scroll { max-height: 220px; }
        }
        @media (max-width: 480px) {
          .aq-fixed-box, .aq-nav-col {
            padding: 7px 1vw 7px 1vw;
            min-height: 320px;
          }
          .aq-options-scroll { max-height: 150px; }
        }
      `}</style>
      <div className="aq-main-flex">
        {/* Cột câu hỏi */}
        <div className="aq-fixed-box aq-question-col aq-container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div className="aq-header-title" style={{ fontWeight: 700, fontSize: 20, color: COLORS.primary }}>Bài kiểm tra</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: COLORS.red, color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: 15 }}>Câu {current + 1}/{questions.length}</span>
            </div>
          </div>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ color: COLORS.primary, fontWeight: 500, fontSize: 15 }}>Tiến độ:</span>
            <div style={{ flex: 1, background: '#e9eaf0', borderRadius: 8, height: 8, position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#e9eaf0' }} />
              <div style={{ width: `${((answers.filter((a) => a !== null).length) / questions.length) * 100}%`, height: '100%', background: COLORS.yellow, position: 'absolute', left: 0, top: 0, zIndex: 1, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: COLORS.primary, fontWeight: 700, fontSize: 15 }}>{Math.round((answers.filter((a) => a !== null).length / questions.length) * 100)}%</span>
          </div>
          {/* Nội dung câu hỏi và đáp án */}
          <div className="aq-question-content">
            <div style={{ marginBottom: 12, color: COLORS.red, fontWeight: 700, fontSize: 16 }}>Câu hỏi {current + 1}</div>
            <div className="aq-question-title" style={{ fontWeight: 700, fontSize: 24, color: COLORS.primary, marginBottom: 18 }}>{questions[current].text}</div>
            <div style={{ fontWeight: 500, color: '#222', marginBottom: 8 }}>Chọn câu trả lời:</div>
            {/* Options scrollable */}
            <div className="aq-options-scroll">
              {questions[current].options.map((opt, idx) => {
                const checked = answers[current] === idx;
                return (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: checked ? '#fff6f6' : '#fff',
                    border: checked ? `2px solid ${COLORS.red}` : '2px solid #e9eaf0',
                    borderRadius: 12,
                    padding: '14px 18px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    color: checked ? COLORS.red : COLORS.primary,
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}>
                    <input
                      type="radio"
                      name={`answer-${current}`}
                      checked={checked}
                      onChange={() => handleSelect(idx)}
                      style={{ accentColor: COLORS.red, width: 20, height: 20, marginRight: 16 }}
                    />
                    <span style={{ flex: 1 }}>{opt}</span>
                    {checked && (
                      <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: COLORS.red, fontWeight: 700, fontSize: 18 }}>⦿</span>
                    )}
                  </label>
                );
              })}
            </div>
            {/* Nút điều hướng ở dưới cùng */}
            <div className="aq-question-actions">
              <button
                className="aq-btn"
                style={{
                  background: '#f5f6fa',
                  color: COLORS.primary,
                  border: '1.5px solid #e9eaf0',
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: current === 0 ? 'not-allowed' : 'pointer',
                  opacity: current === 0 ? 0.5 : 1,
                  minWidth: 80,
                }}
                onClick={prev}
                disabled={current === 0}
              >Câu trước</button>
              <button
                className="aq-btn"
                style={{
                  background: '#f5f6fa',
                  color: COLORS.primary,
                  border: '1.5px solid #e9eaf0',
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: current === questions.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: current === questions.length - 1 ? 0.5 : 1,
                  minWidth: 80,
                }}
                onClick={next}
                disabled={current === questions.length - 1}
              >Câu tiếp</button>
            </div>
          </div>
        </div>
        {/* Cột điều hướng */}
        <div className="aq-nav-col">
          {/* Dãy số câu hỏi ở giữa, scroll nếu nhiều */}
          <div className="aq-nav-steps-scroll">
            <div className="aq-nav-steps-list">
              {questions.map((_, idx) => {
                let className = 'aq-step';
                if (idx === current) className += ' current';
                else if (answers[idx] !== null && answers[idx] !== undefined) className += ' answered';
                return (
                  <span
                    key={idx}
                    className={className}
                    onClick={() => idx !== current && goTo(idx)}
                  >{idx + 1}</span>
                );
              })}
            </div>
          </div>
          {/* Các nút còn lại ở dưới cùng */}
          <div className="aq-nav-bottom">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', width: '100%' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 500 }}>
                <span style={{ width: 16, height: 16, background: COLORS.yellow, borderRadius: '50%', display: 'inline-block', marginRight: 2, border: '1.5px solid #e9eaf0' }}></span> Đã trả lời
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 500 }}>
                <span style={{ width: 16, height: 16, background: COLORS.red, borderRadius: '50%', display: 'inline-block', marginRight: 2, border: '1.5px solid #e9eaf0' }}></span> Hiện tại
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 500 }}>
                <span style={{ width: 16, height: 16, background: 'none', border: '1.5px solid #e9eaf0', borderRadius: '50%', display: 'inline-block', marginRight: 2 }}></span> Chưa trả lời
              </span>
            </div>
            <button style={{
              width: '100%',
              background: COLORS.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: 17,
              marginTop: 4,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(34,59,115,0.10)',
              letterSpacing: 0.5,
              transition: 'all 0.2s',
            }}>Nộp bài</button>
          </div>
        </div>
      </div>
    </div>
  );
} 