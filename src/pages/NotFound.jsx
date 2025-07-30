import React, { useEffect, useRef, useState } from "react";
import styles from './NotFound.module.css';

const suggestions = [
  { label: "Trang chủ", to: "/" },
  { label: "Sản phẩm", to: "/products" },
  { label: "Dịch vụ", to: "/services" },
  { label: "Liên hệ", to: "/contact" },
  { label: "Hỗ trợ", to: "/support" },
];

export default function NotFound() {
  const [currentTime, setCurrentTime] = useState("");
  const errorCodeRef = useRef(null);

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const timeString = now.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setCurrentTime(timeString);
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const handleSuggestion = (to) => {
    window.location.href = to;
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.trim();
      if (searchTerm) {
        alert(`Tìm kiếm: "${searchTerm}"`);
      }
    }
  };

  const handleErrorCodeClick = () => {
    if (errorCodeRef.current) {
      errorCodeRef.current.style.transform = "rotate(360deg)";
      errorCodeRef.current.style.transition = "transform 0.5s ease";
      setTimeout(() => {
        if (errorCodeRef.current) errorCodeRef.current.style.transform = "rotate(0deg)";
      }, 500);
    }
  };

  return (
    <div className={styles.notFoundRoot}>
      <div className={styles.floatingShapes}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>
      <div className={styles.errorContainer}>
        <div className={styles.errorCode} ref={errorCodeRef} onClick={handleErrorCodeClick}>404</div>
        <div className={styles.divider}></div>
        <h1 className={styles.errorTitle}>Trang không tìm thấy</h1>
        <p className={styles.errorDescription}>
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc<br />
          đã bị di chuyển. Vui lòng kiểm tra lại đường dẫn<br />
          hoặc quay về trang chủ.
        </p>
        <div className={styles.actionButtons}>
          <button className={styles.btn} onClick={handleBack}>
            ← Về trang trước
          </button>
          <button className={styles.btn} onClick={() => handleSuggestion("/contact")}>📞 Liên hệ hỗ trợ</button>
        </div>
        <div className={styles.searchContainer}>
          <input type="text" className={styles.searchInput} placeholder="Tìm kiếm" onKeyPress={handleSearch} />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Có thể bạn đang tìm:</h3>
          <div className={styles.suggestionsList}>
            {suggestions.map((s) => (
              <div className={styles.suggestionItem} key={s.to} onClick={() => handleSuggestion(s.to)}>
                {s.label}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.errorInfo}>
          <p>Mã lỗi: 404 | Thời gian: <span>{currentTime}</span></p>
        </div>
      </div>
    </div>
  );
} 