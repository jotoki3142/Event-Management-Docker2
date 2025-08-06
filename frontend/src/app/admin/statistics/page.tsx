'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import '@/public/admin_css/dashboard.css';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
Chart as ChartJS,
    ArcElement,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    ChartOptions,
    BarElement, 
    BarController
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale,BarElement, BarController);

export default function AdminStatisticsPage() {
  // Calculate default start and end date
  const now = new Date();
  const defaultEndDate = now.toISOString().split('T')[0];
  const defaultStartDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    maSuKien: '',
    tenSuKien: '',
    moTa: '',
    diaDiem: '',
    phiThamGia: '',
    luongChoNgoi: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    danhMuc: '',
    anhSuKien: '', // string filename from DB
  })

  const [selectedGroup, setSelectedGroup] = useState<'good' | 'bad' | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<any | null>(null);
  const [activityChartData, setActivityChartData] = useState<any | null>(null);
  const [eventStatusChartData, setEventStatusChartData] = useState<any | null>(null);
  const [startDateChanged, setStartDateChanged] = useState(false);
  const [endDateChanged, setEndDateChanged] = useState(false);

const ratingChartData = data?.ratingStats
  ? {
      labels: ['Sự kiện Tốt', 'Sự kiện Tệ'],
      datasets: [
        {
          label: 'Tỷ lệ đánh giá',
          data: [data.ratingStats.suKienTot, data.ratingStats.suKienTe],
          backgroundColor: ['#4caf50', '#f44336'],
          hoverOffset: 10,
        },
      ],
    }
  : null;

  const ratingChartOptions: ChartOptions<'doughnut'> = {
    onClick: (_: any, elements: any[]) => {
      if (!elements.length) return;
      const clickedIndex = elements[0].index;
      setSelectedGroup(clickedIndex === 0 ? 'good' : 'bad');
    },
    plugins: {
      legend: { position: 'bottom' }, // Now TS understands this is valid
    },
  };

  const revenueChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Doanh thu (VNĐ)' },
      },
      x: {
        title: { display: true, text: 'Thời gian' },
      },
    },
  };  

  const activityChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Số lượng khách hàng' },
      },
      x: {
        title: { display: true, text: 'Thời gian' },
      },
    },
  };  

  const eventStatusChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: 'Thời gian' },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: 'Số lượng sự kiện' },
      },
    },
  };  

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0]; // 'HH:MM:SS'

      const params = new URLSearchParams();

      if (startDateChanged) {
        params.append('startDate', `${startDate}T${currentTime}`);
      }
      if (endDateChanged) {
        params.append('endDate', `${endDate}T${currentTime}`);
      }
  
      const res = await fetch(
        `http://localhost:5555/api/admin/statistics?startDate=${params.toString()}`,
        {
          credentials: 'include',
        }
      );
      const result = await res.json();
      setData(result);
      const revenueTimeline = result.revenueTimeline || {};
    const sortedDates = Object.keys(revenueTimeline).sort();
    const revenues = sortedDates.map((d) => revenueTimeline[d]);

    // Append current endDate point
    //sortedDates.push(endDate);
    revenues.push(0); // default value

    setRevenueChartData({
    labels: sortedDates,
    datasets: [
        {
        label: 'Doanh thu theo thời gian',
        data: revenues,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.3,
        },
    ],
    });

    const khachTimeline = result.khachHangTimeline || {};
const activityDates = Object.keys(khachTimeline).sort();
const activeCounts = activityDates.map((d) => khachTimeline[d].active || 0);
const nonActiveCounts = activityDates.map((d) => khachTimeline[d]['non-active'] || 0);

// Add last point (current endDate)
//activityDates.push(endDate);
activeCounts.push(0);
nonActiveCounts.push(0);

setActivityChartData({
  labels: activityDates,
  datasets: [
    {
      label: 'Khách hàng hoạt động',
      data: activeCounts,
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.3,
    },
    {
      label: 'Khách hàng không hoạt động',
      data: nonActiveCounts,
      borderColor: '#f44336',
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
});

const suKienTimeline = result.suKienTrangThaiTimeline || {};
const eventStatusDates = Object.keys(suKienTimeline).sort();

// Prepare separate datasets for each status
const ongoing = eventStatusDates.map(date => suKienTimeline[date]?.ongoing || 0);
const cancelled = eventStatusDates.map(date => suKienTimeline[date]?.cancelled || 0);
const upcoming = eventStatusDates.map(date => suKienTimeline[date]?.upcoming || 0);

setEventStatusChartData({
  labels: eventStatusDates,
  datasets: [
    {
      label: 'Sắp diễn ra',
      data: upcoming,
      backgroundColor: '#2196f3',
      stack: 'Stack 0',
    },
    {
      label: 'Đang diễn ra',
      data: ongoing,
      backgroundColor: '#4caf50',
      stack: 'Stack 0',
    },
    {
      label: 'Đã hủy',
      data: cancelled,
      backgroundColor: '#f44336',
      stack: 'Stack 0',
    },
  ],
});

    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="dashboard-container">
      <div className="dashboard-filters">
      <input
  type="date"
  className="dashboard-date-input"
  value={startDate}
  onChange={(e) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);

    if (selected > today || selected > end) {
      setStartDate(defaultStartDate);
      setStartDateChanged(false);
    } else {
      setStartDate(e.target.value);
      setStartDateChanged(true);
    }
  }}
/>
<input
  type="date"
  className="dashboard-date-input"
  value={endDate}
  onChange={(e) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);

    if (selected > today || selected < start) {
      setEndDate(defaultEndDate);
      setEndDateChanged(false);
    } else {
      setEndDate(e.target.value);
      setEndDateChanged(true);
    }
  }}
/>
      </div>

      {loading ? (
  <p className="dashboard-loading">Đang tải...</p>
) : data ? (
  <>
    <div className="dashboard-stats">
      <div className="dashboard-stat-card">Tổng số sự kiện: <span>{data.totalSuKien}</span></div>
      <div className="dashboard-stat-card">Tổng nhân viên: <span>{data.totalNhanVien}</span></div>
      <div className="dashboard-stat-card">Người đăng ký: <span>{data.totalKhachHang}</span></div>
      <div className="dashboard-stat-card">Ticket chưa phản hồi: <span>{data.totalUnAnsweredTicket}</span></div>
      <div className="dashboard-stat-card">Doanh thu: <span>{data.totalRevenue !== null ? data.totalRevenue.toLocaleString() : 0} VNĐ</span></div>
    </div>

    <div className="top-events-section">
      <h3>Top sự kiện đăng ký nhiều nhất</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sự kiện</th>
            <th>Số lượng đăng ký</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.top3MostRegistered.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.top3MostRegistered.map((sk: any, index: number) => (
              <tr key={sk.maSuKien} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>{index + 1}</td>
                <td>{DOMPurify.sanitize(sk.tenSuKien)}</td>
                <td>{DOMPurify.sanitize(sk.soLuongDangKy)}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditForm({
                        maSuKien: sk.maSuKien.toString(),
                        tenSuKien: sk.tenSuKien,
                        moTa: '',
                        diaDiem: '',
                        phiThamGia: '',
                        luongChoNgoi: '',
                        ngayBatDau: '',
                        ngayKetThuc: '',
                        anhSuKien: '',
                        danhMuc: '',
                      });

                      fetch(`http://localhost:5555/api/sukien/get/${sk.maSuKien}`, { credentials: 'include' })
                        .then((res) => res.json())
                        .then((data) => {
                          const danhMucId = data.maDanhMuc;
                        
                          // Fetch danh mục name if exists
                          if (danhMucId) {
                            fetch(`http://localhost:5555/api/danhmucsukien/get/${danhMucId}`, { credentials: 'include' })
                              .then((res) => res.json())
                              .then((danhMucData) => {
                                setEditForm({
                                  maSuKien: DOMPurify.sanitize(data.maSuKien),
                                  tenSuKien: DOMPurify.sanitize(data.tenSuKien),
                                  moTa: DOMPurify.sanitize(data.moTa) || '',
                                  diaDiem: DOMPurify.sanitize(data.diaDiem) || '',
                                  phiThamGia: data.phiThamGia?.toString() || '',
                                  luongChoNgoi: data.luongChoNgoi?.toString() || '',
                                  ngayBatDau: data.ngayBatDau?.slice(0, 19) || '',
                                  ngayKetThuc: data.ngayKetThuc?.slice(0, 19) || '',
                                  danhMuc: DOMPurify.sanitize(danhMucData.tenDanhMuc) || '',
                                  anhSuKien: data.anhSuKien || '',
                                });
                                setEditModalOpen(true);
                              })
                              .catch(() => {
                                // Fallback if danh muc fetch fails
                                setEditForm({
                                  maSuKien: DOMPurify.sanitize(data.maSuKien),
                                  tenSuKien: DOMPurify.sanitize(data.tenSuKien),
                                  moTa: DOMPurify.sanitize(data.moTa) || '',
                                  diaDiem: DOMPurify.sanitize(data.diaDiem) || '',
                                  phiThamGia: data.phiThamGia?.toString() || '',
                                  luongChoNgoi: data.luongChoNgoi?.toString() || '',
                                  ngayBatDau: data.ngayBatDau?.slice(0, 19) || '',
                                  ngayKetThuc: data.ngayKetThuc?.slice(0, 19) || '',
                                  danhMuc: '',
                                  anhSuKien: data.anhSuKien || '',
                                });
                                setEditModalOpen(true);
                              });
                          } else {
                            // No danh muc
                            setEditForm({
                              maSuKien: DOMPurify.sanitize(data.maSuKien),
                              tenSuKien: DOMPurify.sanitize(data.tenSuKien),
                              moTa: DOMPurify.sanitize(data.moTa) || '',
                              diaDiem: DOMPurify.sanitize(data.diaDiem) || '',
                              phiThamGia: data.phiThamGia?.toString() || '',
                              luongChoNgoi: data.luongChoNgoi?.toString() || '',
                              ngayBatDau: data.ngayBatDau?.slice(0, 19) || '',
                              ngayKetThuc: data.ngayKetThuc?.slice(0, 19) || '',
                              danhMuc: '',
                              anhSuKien: data.anhSuKien || '',
                            });
                            setEditModalOpen(true);
                          }
                        })
                        
                    }}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="chart-section" style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <div style={{ flex: 1, maxWidth: '300px' }}>
            <h3>Tỷ lệ đánh giá sự kiện</h3>
            {ratingChartData && <Doughnut data={ratingChartData} options={ratingChartOptions} />}
        </div>
        <div style={{ flex: 1 }}>
            <h3>Top sự kiện theo đánh giá</h3>
            <ul id="ratingEventsList">
            {(selectedGroup === 'good' ? data.ratingStats.top3SuKienTot : selectedGroup === 'bad' ? data.ratingStats.top3SuKienTe : []).map((event: any, idx: number) => (
                <li key={idx} className="event-card" style={{ marginBottom: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span className="event-name" style={{ fontWeight: 'bold' }}>{DOMPurify.sanitize(event.tenSuKien)}</span>
                <span className="event-rating" style={{ float: 'right', color: '#888' }}>{event.avg} ★</span>
                </li>
            ))}
            {!selectedGroup && <p style={{ color: '#999' }}>Nhấp vào biểu đồ để xem chi tiết.</p>}
            </ul>
        </div>
        
</div>
<div className="chart-section">
{revenueChartData && (
  <div className="revenue-chart-container" style={{ marginTop: '40px' }}>
    <h3 style={{ marginBottom: '16px' }}>Thống kê doanh thu</h3>
    <Line data={revenueChartData} options={revenueChartOptions} />
  </div>
)}

</div>
<div className="chart-section">
{activityChartData && (
  <div className="revenue-chart-container" style={{ marginTop: '40px' }}>
    <h3 style={{ marginBottom: '16px' }}>Thống kê hoạt động tài khoản khách hàng</h3>
    <Line data={activityChartData} options={activityChartOptions} />
  </div>
)}

</div>
<div className="chart-section">
<div className="chart-section">
  {eventStatusChartData && (
    <div className="revenue-chart-container" style={{ marginTop: '40px' }}>
      <h3 style={{ marginBottom: '16px' }}>Thống kê sự kiện</h3>
      <Bar data={eventStatusChartData} options={eventStatusChartOptions} />
    </div>
  )}
</div>

</div>

    </div>
  </>
) : (
  <p className="dashboard-error">Không thể tải dữ liệu thống kê.</p>
)}

        {editModalOpen && (
          <Modal onClose={() => setEditModalOpen(false)} isOpen={editModalOpen} title="Thông tin sự kiện">
            <div
              style={{
                width: '900px',
                overflowX: 'hidden',
              }}
            >
              <div
                className="modal-details"
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  maxHeight: '65vh',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  paddingRight: '8px',
                  width: '900px',
                }}
              >
                {/* Left: image placeholder */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <label
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: '400px',
                      border: '2px dashed #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: '#f9f9f9',
                      textAlign: 'center',
                    }}
                  >
                    {editForm.anhSuKien ? (
                      <img
                        src={`http://localhost:5555/api/sukien/get${editForm.anhSuKien}`}
                        alt="Hiện tại"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    ) : (
                      <span style={{ color: '#999' }}>Event không có ảnh</span>
                    )}
                  </label>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                  />
                </div>
        
                {/* Right: Form fields */}
                <div style={{ flex: '2' }}>
                  {[
                    ['Tên sự kiện', 'tenSuKien'],
                    ['Mô tả', 'moTa'],
                    ['Địa điểm', 'diaDiem'],
                    ['Phí tham gia', 'phiThamGia'],
                    ['Lượng chỗ ngồi', 'luongChoNgoi'],
                    ['Ngày bắt đầu', 'ngayBatDau'],
                    ['Ngày kết thúc', 'ngayKetThuc'],
                  ].map(([label, key]) => (
                    <div className="form-group" key={key}>
                      <label><strong>{label}:</strong></label>
                      {key === 'moTa' ? (
                        <textarea
                          value={editForm[key as keyof typeof editForm] as string}
                          className="modal-input"
                          rows={4}
                          disabled
                        />
                      ) : (
                        <input
                          type={
                            key === 'phiThamGia' || key === 'luongChoNgoi'
                              ? 'number'
                              : key === 'ngayBatDau' || key === 'ngayKetThuc'
                              ? 'datetime-local'
                              : 'text'
                          }
                          value={editForm[key as keyof typeof editForm] as string}
                          className="modal-input"
                          disabled={key !== null}
                        />
                      )}
                    </div>
                  ))}
        
                  {/* Danh mục */}
                  <div className="form-group">
                    <label><strong>Danh mục:</strong></label>
                    <input
                        className="modal-input"
                        value={editForm.danhMuc !== '' ? editForm.danhMuc : 'Sự kiện này không thuộc danh mục nào'}
                        disabled
                    />
                  </div>
                </div>
              </div>
            </div>
        
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setEditModalOpen(false)}>
                Hủy
              </button>
            </div>
          </Modal>
        )}
    </div>
  );
}
