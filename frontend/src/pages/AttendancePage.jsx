import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

export default function AttendancePage() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await api.get('/staff');
      setStaff(res.data);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const list = s
      ? staff.filter(
          (x) =>
            x.name.toLowerCase().includes(s) ||
            x.staffId.toLowerCase().includes(s)
        )
      : staff;
    const sorted = [...list].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return sorted;
  }, [search, staff, sortAsc]);

  const toggle = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const proceed = () => {
    const selectedStaff = staff.filter((s) => selectedIds.has(s._id));
    if (selectedStaff.length === 0) {
      // No selection; keep UX responsive by allowing click and showing message
      alert('Please select at least one staff member to proceed.');
      return;
    }
    navigate('/hours', { state: { selectedStaff } });
  };

  return (
    <div className="container">
      <div className="page-title">Attendance</div>
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" onClick={() => setSortAsc((v) => !v)}>
          Sort: {sortAsc ? 'A→Z' : 'Z→A'}
        </button>
      </div>
      <div className="grid">
        {filtered.map((s) => (
          <label key={s._id} className="card row">
            <input
              className="checkbox"
              type="checkbox"
              checked={selectedIds.has(s._id)}
              onChange={() => toggle(s._id)}
            />
            <span>
              <strong>{s.name}</strong> <span className="muted">({s.staffId})</span>
            </span>
          </label>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button
          className="btn primary"
          onClick={proceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}


