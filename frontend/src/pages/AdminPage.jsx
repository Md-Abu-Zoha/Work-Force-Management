import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api/axios';

export default function AdminPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ staffId: '', name: '' });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthToken(token);
    load();
  }, [navigate]);

  const load = async () => {
    const res = await api.get('/staff');
    setStaff(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/staff', form);
    setForm({ staffId: '', name: '' });
    await load();
  };

  const update = async (id, name) => {
    await api.put(`/staff/${id}`, { name });
    await load();
  };

  const remove = async (id) => {
    await api.delete(`/staff/${id}`);
    await load();
  };

  return (
    <div className="container">
      <div className="page-title">Admin • Manage Staff</div>
      <form onSubmit={submit} className="row">
        <input
          className="input"
          placeholder="Staff ID"
          value={form.staffId}
          onChange={(e) => setForm((f) => ({ ...f, staffId: e.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <button className="btn primary" type="submit">Add New Staff</button>
      </form>

      <div className="grid" style={{ marginTop: 16 }}>
        {staff.map((s) => (
          <div key={s._id} className="card row">
            <input
              className="input"
              defaultValue={s.name}
              onBlur={(e) => update(s._id, e.target.value)}
            />
            <span>({s.staffId})</span>
            <button className="btn danger" onClick={() => remove(s._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}


