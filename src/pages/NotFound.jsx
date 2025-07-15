import React, { useEffect, useRef, useState } from "react";

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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <style>{`
        .error-container { text-align: center; max-width: 600px; padding: 40px 20px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); animation: fadeInUp 0.6s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .error-code { font-size: 120px; font-weight: 800; color: #C52032; margin-bottom: 20px; text-shadow: 0 4px 8px rgba(197,32,50,0.2); animation: pulse 2s infinite; cursor: pointer; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .divider { width: 60px; height: 4px; background: linear-gradient(90deg, #C52032, #FFD012, #223B73); margin: 0 auto 30px; border-radius: 2px; }
        .error-title { font-size: 28px; font-weight: 600; color: #223B73; margin-bottom: 20px; }
        .error-description { font-size: 16px; color: #666; margin-bottom: 40px; line-height: 1.8; }
        .action-buttons { display: flex; gap: 15px; justify-content: center; margin-bottom: 40px; flex-wrap: wrap; }
        .btn { padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; min-width: 140px; justify-content: center; }
        .btn-primary { background: linear-gradient(135deg, #C52032, #a81b2a); color: white; box-shadow: 0 4px 15px rgba(197,32,50,0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(197,32,50,0.4); }
        .btn-secondary { background: linear-gradient(135deg, #223B73, #1a2d5a); color: white; border: 2px solid #223B73; box-shadow: 0 4px 15px rgba(34,59,115,0.3); }
        .btn-secondary:hover { background: linear-gradient(135deg, #1a2d5a, #223B73); border-color: #223B73; color: white; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,59,115,0.4); }
        .search-container { position: relative; max-width: 400px; margin: 0 auto 30px; }
        .search-input { width: 100%; padding: 14px 50px 14px 20px; border: 2px solid #e0e0e0; border-radius: 50px; font-size: 16px; transition: all 0.3s ease; background: #f8f9fa; }
        .search-input:focus { outline: none; border-color: #223B73; background: white; box-shadow: 0 0 0 3px rgba(34,59,115,0.1); }
        .search-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: #999; font-size: 18px; }
        .suggestions { margin-top: 30px; }
        .suggestions-title { font-size: 18px; font-weight: 600; color: #223B73; margin-bottom: 20px; }
        .suggestions-list { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .suggestion-item { background: #f8f9fa; color: #666; padding: 8px 16px; border-radius: 20px; font-size: 14px; transition: all 0.3s ease; cursor: pointer; border: 1px solid #e0e0e0; }
        .suggestion-item:hover { background: #FFD012; color: #333; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(255,208,18,0.3); }
        .error-info { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #999; }
        .floating-shapes { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1; }
        .shape { position: absolute; border-radius: 50%; animation: float 6s ease-in-out infinite; }
        .shape:nth-child(1) { width: 80px; height: 80px; background: rgba(197,32,50,0.1); top: 20%; left: 10%; animation-delay: 0s; }
        .shape:nth-child(2) { width: 60px; height: 60px; background: rgba(255,208,18,0.1); top: 60%; right: 15%; animation-delay: 2s; }
        .shape:nth-child(3) { width: 40px; height: 40px; background: rgba(34,59,115,0.1); bottom: 20%; left: 20%; animation-delay: 4s; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @media (max-width: 768px) { .error-code { font-size: 80px; } .error-title { font-size: 24px; } .error-container { margin: 20px; padding: 30px 20px; } .action-buttons { flex-direction: column; align-items: center; } .btn { width: 100%; max-width: 280px; } }
      `}</style>
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <div className="error-container">
        <div className="error-code" ref={errorCodeRef} onClick={handleErrorCodeClick}>404</div>
        <div className="divider"></div>
        <h1 className="error-title">Trang không tìm thấy</h1>
        <p className="error-description">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc<br />
          đã bị di chuyển. Vui lòng kiểm tra lại đường dẫn<br />
          hoặc quay về trang chủ.
        </p>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleBack}>
            ← Về trang trước
          </button>
          <button className="btn btn-secondary" onClick={() => handleSuggestion("/contact")}>📞 Liên hệ hỗ trợ</button>
        </div>
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Tìm kiếm" onKeyPress={handleSearch} />
          <span className="search-icon">🔍</span>
        </div>
        <div className="suggestions">
          <h3 className="suggestions-title">Có thể bạn đang tìm:</h3>
          <div className="suggestions-list">
            {suggestions.map((s) => (
              <div className="suggestion-item" key={s.to} onClick={() => handleSuggestion(s.to)}>
                {s.label}
              </div>
            ))}
          </div>
        </div>
        <div className="error-info">
          <p>Mã lỗi: 404 | Thời gian: <span>{currentTime}</span></p>
        </div>
      </div>
    </div>
  );
} 