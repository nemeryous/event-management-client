import React, { useState, useRef } from 'react';
import Header from "../../components/Header.jsx";

const initialParticipants = [
  {
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    date: '2024-01-15',
    isStaff: false,
  },
  {
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    date: '2024-01-16',
    isStaff: false,
  },
  {
    name: 'Lê Minh Cường',
    email: 'cuong.le@email.com',
    date: '2024-01-17',
    isStaff: false,
  },
  {
    name: 'Phạm Thu Dung',
    email: 'dung.pham@email.com',
    date: '2024-01-18',
    isStaff: false,
  },
];

function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function getAvatarClass(index) {
  const classes = ['red', 'yellow', 'blue'];
  return classes[index % classes.length];
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function AttendantList() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const nameInputRef = useRef(null);

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (email) => {
    if (window.confirm('Bạn có chắc muốn xóa người này khỏi danh sách?')) {
      setParticipants((prev) => prev.filter((p) => p.email !== email));
    }
  };

  const handleAddStaff = (email) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.email === email ? { ...p, isStaff: true } : p
      )
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (participants.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
      alert('Email này đã tồn tại trong danh sách!');
      return;
    }
    setParticipants([
      ...participants,
      { name, email, date: getCurrentDate(), isStaff: false },
    ]);
    setModalOpen(false);
    setName('');
    setEmail('');
  };

  const openModal = () => {
    setModalOpen(true);
    setTimeout(() => nameInputRef.current && nameInputRef.current.focus(), 100);
  };

  const closeModal = () => {
    setModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <>
      <div className="attendant-container">
        <style>{`
          .attendant-container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          
          .attendant-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 30px; 
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .header-content h1 { 
            font-size: clamp(24px, 4vw, 32px); 
            font-weight: 700; 
            color: #1a202c; 
            margin: 0 0 8px 0;
            background: linear-gradient(135deg, #C52032, #223B73);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .header-content p { 
            font-size: clamp(14px, 2.5vw, 16px); 
            color: #4a5568; 
            margin: 0;
            font-weight: 500;
          }
          
          .add-button { 
            background: linear-gradient(135deg, #C52032, #a81b2a); 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 12px; 
            font-size: 14px; 
            font-weight: 600; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            gap: 8px; 
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(197, 32, 50, 0.3);
            white-space: nowrap;
          }
          
          .add-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(197, 32, 50, 0.4);
          }
          
          .add-button::before { 
            content: '+'; 
            font-size: 18px; 
            font-weight: bold; 
          }
          
          .search-section { 
            margin-bottom: 30px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            flex-wrap: wrap;
            gap: 15px;
          }
          
          .search-input { 
            flex: 1; 
            min-width: 250px;
            padding: 16px 20px; 
            border: 2px solid #e2e8f0; 
            border-radius: 12px; 
            font-size: 16px; 
            background-color: white; 
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          
          .search-input:focus {
            outline: none;
            border-color: #C52032;
            box-shadow: 0 0 0 3px rgba(197, 32, 50, 0.1);
          }
          
          .search-input::placeholder { 
            color: #a0aec0; 
          }
          
          .results-count { 
            font-size: 14px; 
            color: #4a5568; 
            font-weight: 500;
            white-space: nowrap;
          }
          
          .participant-list { 
            background-color: white; 
            border-radius: 16px; 
            border: 1px solid #e2e8f0; 
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            margin-bottom: 30px;
          }
          
          .participant-item { 
            display: flex; 
            align-items: center; 
            padding: 20px; 
            border-bottom: 1px solid #f7fafc; 
            transition: all 0.3s ease;
            position: relative;
            flex-wrap: nowrap;
          }
          
          .participant-item:last-child { 
            border-bottom: none; 
          }
          
          .participant-item:hover { 
            background-color: #f8fafc; 
            transform: translateX(4px);
          }
          
          .avatar { 
            width: 50px; 
            height: 50px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px; 
            font-weight: 700; 
            color: white; 
            margin-right: 20px; 
            position: relative;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            flex-shrink: 0;
          }
          
          .avatar.red { 
            background: linear-gradient(135deg, #C52032, #e53e3e); 
          }
          
          .avatar.yellow { 
            background: linear-gradient(135deg, #FFD012, #f6ad55); 
            color: #2d3748; 
          }
          
          .avatar.blue { 
            background: linear-gradient(135deg, #223B73, #3182ce); 
          }
          
          .participant-info { 
            flex: 1; 
            min-width: 0;
            margin-right: 8px;
          }
          
          .participant-name { 
            font-size: 18px; 
            font-weight: 600; 
            color: #1a202c; 
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .participant-email { 
            font-size: 15px; 
            color: #4a5568; 
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .participant-date { 
            font-size: 13px; 
            color: #718096; 
            font-weight: 500;
          }
          
          .delete-button { 
            background: none; 
            border: none; 
            color: #a0aec0; 
            cursor: pointer; 
            padding: 12px; 
            border-radius: 8px; 
            transition: all 0.3s ease;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            align-self: center;
          }
          
          .delete-button:hover { 
            color: #C52032; 
            background-color: #fed7d7;
            transform: scale(1.1);
          }
          
          .delete-button::before { 
            content: '🗑️'; 
            font-size: 18px; 
          }
          
          .staff-button {
            background: linear-gradient(135deg, #223B73, #3182ce);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-right: 12px;
            flex-shrink: 0;
            white-space: nowrap;
          }
          
          .staff-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(34, 59, 115, 0.3);
          }
          
          .staff-label {
            background: linear-gradient(135deg, #C52032, #e53e3e);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
            flex-shrink: 0;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .staff-label::before {
            content: '👑';
            font-size: 14px;
          }
          
          .participant-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          }
          
          .attendant-footer { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            flex-wrap: wrap;
            gap: 15px;
          }
          
          .total-count { 
            font-size: 16px; 
            color: #4a5568; 
            font-weight: 600;
          }
          
          .last-updated { 
            font-size: 14px; 
            color: #718096; 
            font-weight: 500;
          }
          
          .modal { 
            display: ${modalOpen ? 'flex' : 'none'}; 
            position: fixed; 
            top: 0; 
            left: 0; 
            right: 0; 
            bottom: 0; 
            background-color: rgba(0,0,0,0.6); 
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .modal-content { 
            background-color: white; 
            padding: 30px; 
            border-radius: 16px; 
            max-width: 450px; 
            width: 100%; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: modalSlideIn 0.3s ease;
          }
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .modal-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 25px; 
          }
          
          .modal-title { 
            font-size: 20px; 
            font-weight: 700; 
            color: #1a202c;
          }
          
          .close-button { 
            background: none; 
            border: none; 
            font-size: 28px; 
            cursor: pointer; 
            color: #a0aec0;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          
          .close-button:hover {
            color: #C52032;
            background-color: #fed7d7;
          }
          
          .form-group { 
            margin-bottom: 20px; 
          }
          
          .form-label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 600; 
            color: #2d3748; 
            font-size: 15px;
          }
          
          .form-input { 
            width: 100%; 
            padding: 14px 16px; 
            border: 2px solid #e2e8f0; 
            border-radius: 10px; 
            font-size: 16px; 
            transition: all 0.3s ease;
            box-sizing: border-box;
          }
          
          .form-input:focus {
            outline: none;
            border-color: #C52032;
            box-shadow: 0 0 0 3px rgba(197, 32, 50, 0.1);
          }
          
          .form-buttons { 
            display: flex; 
            gap: 12px; 
            justify-content: flex-end; 
            margin-top: 30px;
          }
          
          .cancel-button { 
            background-color: #f7fafc; 
            color: #4a5568; 
            border: 2px solid #e2e8f0; 
            padding: 12px 24px; 
            border-radius: 10px; 
            cursor: pointer; 
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .cancel-button:hover {
            background-color: #edf2f7;
            border-color: #cbd5e0;
          }
          
          .save-button { 
            background: linear-gradient(135deg, #C52032, #a81b2a); 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 10px; 
            cursor: pointer; 
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(197, 32, 50, 0.3);
          }
          
          .save-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(197, 32, 50, 0.4);
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .attendant-container {
              padding: 15px;
            }
            
            .attendant-header {
              flex-direction: column;
              align-items: stretch;
              gap: 15px;
            }
            
            .header-content h1 {
              text-align: center;
            }
            
            .add-button {
              width: 100%;
              justify-content: center;
            }
            
            .search-section {
              flex-direction: column;
              align-items: stretch;
            }
            
            .search-input {
              min-width: auto;
            }
            
            .results-count {
              text-align: center;
            }
            
            .participant-item {
              padding: 15px;
              flex-wrap: nowrap;
              gap: 10px;
            }
            
            .avatar {
              width: 45px;
              height: 45px;
              font-size: 14px;
              margin-right: 15px;
            }
            
            .participant-info {
              flex: 1;
              min-width: 120px;
              margin-right: 8px;
            }
            
            .participant-name {
              font-size: 16px;
            }
            
            .participant-email {
              font-size: 14px;
            }
            
            .attendant-footer {
              flex-direction: column;
              text-align: center;
            }
            
            .modal-content {
              margin: 20px;
              padding: 25px;
            }
            
            .form-buttons {
              flex-direction: column;
            }
            
            .cancel-button,
            .save-button {
              width: 100%;
            }
          }
          
          @media (max-width: 480px) {
            .attendant-container {
              padding: 10px;
            }
            
            .participant-item {
              padding: 12px;
              flex-wrap: wrap;
            }
            
            .avatar {
              width: 40px;
              height: 40px;
              font-size: 12px;
              margin-right: 12px;
            }
            
            .participant-name {
              font-size: 15px;
            }
            
            .participant-email {
              font-size: 13px;
            }
            
            .participant-date {
              font-size: 12px;
            }
            
            .modal-content {
              padding: 20px;
              margin: 10px;
            }
          }
          
          /* Empty state */
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
          }
          
          .empty-state h3 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #4a5568;
          }
          
          .empty-state p {
            font-size: 16px;
            margin-bottom: 0;
          }
        `}</style>
        
        <div className="attendant-header">
          <div className="header-content">
            <h1>Danh sách người tham dự</h1>
            <p>
              Tổng cộng <span style={{color: '#C52032', fontWeight: '700'}}>{participants.length}</span> người tham dự
            </p>
          </div>
          <button className="add-button" onClick={openModal}>
            Thêm người tham dự
          </button>
        </div>
        
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="results-count">
            Hiển thị <span style={{color: '#C52032', fontWeight: '700'}}>{filtered.length}</span> / <span style={{fontWeight: '700'}}>{participants.length}</span> người
          </span>
        </div>
        
        <div className="participant-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>Không tìm thấy kết quả</h3>
              <p>Thử tìm kiếm với từ khóa khác hoặc thêm người tham dự mới</p>
            </div>
          ) : (
            filtered.map((p, idx) => (
              <div className="participant-item" key={p.email}>
                <div className={`avatar ${getAvatarClass(idx)}`}>{getInitials(p.name)}</div>
                <div className="participant-info">
                  <div className="participant-name">{p.name}</div>
                  <div className="participant-email">{p.email}</div>
                  <div className="participant-date">Tham gia: {p.date}</div>
                </div>
                <div className="participant-actions">
                  {p.isStaff ? (
                    <span className="staff-label">STAFF</span>
                  ) : (
                    <button 
                      className="staff-button" 
                      onClick={() => handleAddStaff(p.email)}
                      title="Thêm làm staff"
                    >
                      Thêm Staff
                    </button>
                  )}
                  <button className="delete-button" onClick={() => handleDelete(p.email)} title="Xóa người tham dự"></button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="attendant-footer">
          <span className="total-count">
            Tổng cộng: <span style={{color: '#C52032', fontWeight: '700'}}>{participants.length}</span> người tham dự
          </span>
          <span className="last-updated">Cập nhật lần cuối: hôm nay</span>
        </div>
        
        {/* Modal */}
        <div className="modal" onClick={(e) => e.target.className === 'modal' && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Thêm người tham dự</h2>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  ref={nameInputRef}
                  required
                  placeholder="Nhập họ và tên..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Nhập địa chỉ email..."
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="save-button">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 