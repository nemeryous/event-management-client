import React, { useState, useRef } from 'react';
import Header from "../../components/Header.jsx";
import styles from './AttendantList.module.css';

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
      <div className={styles.attendantContainer}>
        
        <div className={styles.attendantHeader}>
          <div className={styles.headerContent}>
            <h1>Danh sách người tham dự</h1>
            <p>
              Tổng cộng <span style={{color: '#C52032', fontWeight: '700'}}>{participants.length}</span> người tham dự
            </p>
          </div>
          <button className={styles.addButton} onClick={openModal}>
            Thêm người tham dự
          </button>
        </div>
        
        <div className={styles.searchSection}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="🔍 Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className={styles.resultsCount}>
            Hiển thị <span style={{color: '#C52032', fontWeight: '700'}}>{filtered.length}</span> / <span style={{fontWeight: '700'}}>{participants.length}</span> người
          </span>
        </div>
        
        <div className={styles.participantList}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Không tìm thấy kết quả</h3>
              <p>Thử tìm kiếm với từ khóa khác hoặc thêm người tham dự mới</p>
            </div>
          ) : (
            filtered.map((p, idx) => (
              <div className={styles.participantItem} key={p.email}>
                <div className={styles.participantInfoRow}>
                  <div className={styles.avatar + ' ' + getAvatarClass(idx)}>{getInitials(p.name)}</div>
                  <div className={styles.participantInfo}>
                    <div className={styles.participantName}>{p.name}</div>
                    <div className={styles.participantEmail}>{p.email}</div>
                    <div className={styles.participantDate}>Tham gia: {p.date}</div>
                  </div>
                </div>
                <div className={styles.participantActions}>
                  {p.isStaff ? (
                    <span className={styles.staffLabel}>STAFF</span>
                  ) : (
                    <button 
                      className={styles.staffButton} 
                      onClick={() => handleAddStaff(p.email)}
                      title="Thêm làm staff"
                    >
                      Thêm Staff
                    </button>
                  )}
                  <button className={styles.deleteButton} onClick={() => handleDelete(p.email)} title="Xóa người tham dự">✖</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className={styles.attendantFooter}>
          <span className={styles.totalCount}>
            Tổng cộng: <span style={{color: '#C52032', fontWeight: '700'}}>{participants.length}</span> người tham dự
          </span>
          <span className={styles.lastUpdated}>Cập nhật lần cuối: hôm nay</span>
        </div>
        
        {/* Modal */}
        {modalOpen && (
          <div className={styles.modal} onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Thêm người tham dự</h2>
                <button className={styles.closeButton} onClick={closeModal}>&times;</button>
              </div>
              <form onSubmit={handleAdd}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Nhập địa chỉ email..."
                  />
                </div>
                <div className={styles.formButtons}>
                  <button type="button" className={styles.cancelButton} onClick={closeModal}>
                    Hủy
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 