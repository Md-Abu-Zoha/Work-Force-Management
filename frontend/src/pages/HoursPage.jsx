import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { api } from '../api/axios';

export default function HoursPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedStaff = useMemo(() => state?.selectedStaff || [], [state]);

  const [entries, setEntries] = useState(() =>
    selectedStaff.map((s) => ({
      staff: s._id,
      name: s.name,
      fullDay: false,
      halfDay: false,
      extraHours: 0,
    }))
  );

  const setField = (idx, field, value) => {
    setEntries((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const saveAll = async () => {
    const payload = entries.map((e) => {
      let base = 0;
      if (e.fullDay) base += 8;
      if (e.halfDay) base += 4;
      const total = base + (Number(e.extraHours) || 0);
      return {
        staff: e.staff,
        staffName: e.name,
        date: new Date().toISOString(),
        hoursWorked: total,
      };
    });
    await api.post('/attendance/log', { entries: payload });
    navigate('/roster');
  };

  if (!selectedStaff.length) {
    return (
      <div className="container">
        <div className="card">No staff selected.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-title">Enter Hours</div>
      <div className="grid">
        {entries.map((e, idx) => (
          <div key={e.staff} className="card">
            <strong>{e.name}</strong>
            <div className="row" style={{ marginTop: 8 }}>
              <label>
                <input
                  type="checkbox"
                  checked={e.fullDay}
                  onChange={(ev) => setField(idx, 'fullDay', ev.target.checked)}
                />{' '}
                Full Day (8h)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={e.halfDay}
                  onChange={(ev) => setField(idx, 'halfDay', ev.target.checked)}
                />{' '}
                Half Day (4h)
              </label>
              <label>
                Extra Hours:{' '}
                <input
                  className="input"
                  type="number"
                  value={e.extraHours}
                  min={0}
                  onChange={(ev) =>
                    setField(idx, 'extraHours', ev.target.value)
                  }
                  style={{ width: 100 }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button className="btn success" onClick={saveAll}>Save All Hours</button>
        <button className="btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}


