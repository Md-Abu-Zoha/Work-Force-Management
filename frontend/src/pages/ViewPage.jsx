import { useEffect, useState } from 'react';
import { api } from '../api/axios';

export default function ViewPage() {
  const [staff, setStaff] = useState([]);
  const [modal, setModal] = useState({ open: false, staff: null });
  const [navigateToAdmin, setNavigateToAdmin] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await api.get('/staff');
      setStaff(res.data);
    }
    load();
  }, []);

  return (
    <div className="container">
      <div className="page-title">Staff Roster</div>
      <div style={{ marginBottom: 12 }}>
        <a className="btn primary" href="/admin">Manage Staff</a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Staff ID</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s._id} style={{ cursor: 'pointer' }} onClick={() => setModal({ open: true, staff: s })}>
              <td>{s.name}</td>
              <td>{s.staffId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModal({ open: false, staff: null })}>
          <div className="card" style={{ minWidth: 320 }} onClick={(e) => e.stopPropagation()}>
            <div className="page-title" style={{ fontSize: 20, margin: 0 }}>Staff Detail</div>
            <p>
              <strong>Name:</strong> {modal.staff?.name}
            </p>
            <p>
              <strong>Staff ID:</strong> {modal.staff?.staffId}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setModal({ open: false, staff: null })}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


