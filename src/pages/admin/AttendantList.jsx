import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from "../../components/Header.jsx";
import styles from './AttendantList.module.css';
import { useGetAttendantsByEventQuery, useLazyGetUserByEmailQuery, useAddAttendantMutation, useDeleteAttendantMutation, useGetEventManagersByEventQuery, useAssignEventManagerMutation } from '../../api/rootApi';


function getInitials(email) {
  if (!email) return "";
  return email.charAt(0).toUpperCase();
}

function getRandomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getAvatarStyle(email) {
  return {
    backgroundColor: getRandomColor(),
    color: 'white',
    fontWeight: 'bold'
  };
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function AttendantList() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const { data: attendants = [], isLoading, error, refetch } = useGetAttendantsByEventQuery(eventId);
  const { data: eventManagers = [] } = useGetEventManagersByEventQuery(eventId);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const nameInputRef = useRef(null);
  const [triggerGetUserByEmail] = useLazyGetUserByEmailQuery();
  const [errorMsg, setErrorMsg] = useState('');
  const [addAttendant, { isLoading: isAdding }] = useAddAttendantMutation();
  const [deleteAttendant] = useDeleteAttendantMutation();
  const [assignEventManager, { isLoading: isAssigning }] = useAssignEventManagerMutation();
  const [notify, setNotify] = useState({ message: '', type: '' });

  useEffect(() => {
    if (notify.message) {
      const timer = setTimeout(() => setNotify({ message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notify]);

  // Map attendants từ API sang participants cho UI cũ
  const participants = attendants.map(a => {
    // Đảm bảo so sánh userId là string để mapping đúng
    const manager = eventManagers.find(m => String(m.user_id) === String(a.userId));
    return {
      name: a.userName,
      email: a.userEmail,
      date: '',
      userId: a.userId,
      role: manager ? manager.roleType : null, 
    };
  });

  const filtered = participants.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (email) => {
    if (!window.confirm('Bạn có chắc muốn xóa người này khỏi danh sách?')) return;
    setErrorMsg('');
    try {
      // Tìm participant theo email để lấy userId
      const participant = participants.find((p) => p.email === email);
      if (!participant) {
        setErrorMsg('Không tìm thấy người tham dự này!');
        alert('Không tìm thấy người tham dự này!');
        return;
      }
      const result = await deleteAttendant({ userId: participant.userId, eventId }).unwrap();
      if (result?.message && result.message !== "Người dùng đã được xóa khỏi sự kiện!") {
        setNotify({ message: result.message, type: 'error' });
        setErrorMsg(result.message);
        return;
      }
      setNotify({ message: result.message || "Xóa thành công!", type: 'success' });
      refetch();
    } catch (err) {
      const msg = err?.data?.message || err?.error || "Có lỗi xảy ra khi xóa người tham dự!";
      setNotify({ message: msg, type: 'error' });
      setErrorMsg(msg);
    }
  };

  const handleAddStaff = async (email) => {
    setErrorMsg('');
    try {
      // Find participant to get userId
      const participant = participants.find((p) => p.email === email);
      if (!participant) {
        setNotify({ message: 'Không tìm thấy người tham dự này!', type: 'error' });
        setErrorMsg('Không tìm thấy người tham dự này!');
        return;
      }
  
      // Call API to assign STAFF role
      const result = await assignEventManager({
        user_id: participant.userId,
        event_id,
        roleType: 'STAFF',
      }).unwrap();
  
      if (result?.message && result.message !== "Thêm vai trò thành công!") {
        setNotify({ message: result.message, type: 'error' });
        setErrorMsg(result.message);
        return;
      }
  
      setNotify({ message: result.message || "Thêm vai trò STAFF thành công!", type: 'success' });
      refetch(); 
    } catch (err) {
      const msg = err?.data?.message || err?.error || "Có lỗi xảy ra khi thêm vai trò STAFF!";
      setNotify({ message: msg, type: 'error' });
      setErrorMsg(msg);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập email!');
      return;
    }
    try {
      // 1. Lấy userId từ email bằng RTK Query
      const userRes = await triggerGetUserByEmail(email).unwrap();
      if (!userRes.id) {
        setErrorMsg('Không tìm thấy userId!');
        return;
      }
      // 2. Gọi API thêm người tham dự
      const result = await addAttendant({ userId: userRes.id, eventId }).unwrap();
      if (result?.message && result.message !== "Người dùng đã được thêm vào sự kiện!") {
        setNotify({ message: result.message, type: 'error' });
        setErrorMsg(result.message);
        return;
      }
      setNotify({ message: result.message || "Thêm thành công!", type: 'success' });
      setModalOpen(false);
      setEmail('');
      refetch();
    } catch (err) {
      setNotify({
        message: err?.data?.message || err?.error || "Có lỗi xảy ra khi thêm người tham dự!",
        type: 'error',
      });
      setErrorMsg(err?.data?.message || err?.error || "Có lỗi xảy ra khi thêm người tham dự!");
    }
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
      {notify.message && (
        <div
          style={{
            background: notify.type === 'success' ? '#d4edda' : '#f8d7da',
            color: notify.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${notify.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: 8,
            padding: '12px 20px',
            margin: '16px 0',
            textAlign: 'center',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 100,
            position: 'relative'
          }}
        >
          {notify.message}
          <span
            style={{ marginLeft: 16, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => setNotify({ message: '', type: '' })}
          >
            ×
          </span>
        </div>
      )}
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
                  <div className={styles.avatar} style={getAvatarStyle(p.email)}>{getInitials(p.email)}</div>
                  <div className={styles.participantInfo}>
                    <div className={styles.participantName}>{p.name}</div>
                    <div className={styles.participantEmail}>{p.email}</div>
                  </div>
                </div>
                <div className={styles.participantActions}>
                  {p.role === 'MANAGE' && (
                    <span className={styles.staffLabel} style={{ background: '#223B73' }}>MANAGE</span>
                  )}
                  {p.role === 'STAFF' && (
                    <span className={styles.staffLabel}>STAFF</span>
                  )}
                  {(!p.role) && (
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
                  {errorMsg && (
                    <div style={{ color: 'red', margin: '8px 0', textAlign: 'center' }}>
                      {errorMsg}
                    </div>
                  )}
                </div>
                <div className={styles.formButtons}>
                  <button type="button" className={styles.cancelButton} onClick={closeModal}>
                    Hủy
                  </button>
                  <button type="submit" className={styles.saveButton} disabled={isAdding}>
                    {isAdding ? 'Đang lưu...' : 'Lưu'}
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