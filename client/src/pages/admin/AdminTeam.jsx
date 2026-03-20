import { useEffect, useState } from 'react';
import { adminFetch } from '../../utils/adminApi';

const EMPTY_FORM = {
  name: '', title: '', bio: '', imageUrl: '', imageAlt: '', order: '',
};

export default function AdminTeam() {
  const [items, setItems]     = useState([]);
  const [mode, setMode]       = useState('list');
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setItems(await adminFetch('/api/admin/team'));
    } catch { /* handled by redirect */ }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setSuccess('');
    setMode('form');
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name:     item.name,
      title:    item.title,
      bio:      item.bio,
      imageUrl: item.imageUrl || '',
      imageAlt: item.imageAlt || '',
      order:    item.order ?? '',
    });
    setError('');
    setSuccess('');
    setMode('form');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await adminFetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = { ...form, order: Number(form.order) || 0 };

    try {
      if (editing) {
        const updated = await adminFetch(`/api/admin/team/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setItems((prev) => prev.map((i) => (i._id === editing._id ? updated : i)));
        setEditing(updated);
        setSuccess('Saved successfully.');
      } else {
        const created = await adminFetch('/api/admin/team', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setItems((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setSuccess('Team member created.');
        setEditing(created);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Form view ──────────────────────────────────────────────
  if (mode === 'form') {
    return (
      <div>
        <div className="adm-page-header">
          <h1 className="adm-page-title">{editing ? 'Edit Team Member' : 'New Team Member'}</h1>
          <button className="adm-btn adm-btn--ghost" onClick={() => setMode('list')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to list
          </button>
        </div>

        {error   && <p className="adm-error"   style={{ marginBottom: '1.25rem' }}>{error}</p>}
        {success && <p className="adm-success" style={{ marginBottom: '1.25rem' }}>{success}</p>}

        <form onSubmit={handleSubmit} className="adm-form">
          <div className="adm-card">
            <div className="adm-section-title" style={{ marginBottom: '1.25rem' }}>Person</div>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Full Name</label>
                <input className="adm-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Title / Role</label>
                <input className="adm-input" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-label">Bio</label>
                <textarea className="adm-textarea" name="bio" value={form.bio} onChange={handleChange} required rows={4} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Display Order</label>
                <input className="adm-input" type="number" name="order" value={form.order} onChange={handleChange} min={0} />
              </div>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-section-title" style={{ marginBottom: '1.25rem' }}>Photo</div>
            <div className="adm-form">
              <div className="adm-field">
                <label className="adm-label">Image URL</label>
                <input className="adm-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Image Alt Text</label>
                <input className="adm-input" name="imageAlt" value={form.imageAlt} onChange={handleChange} />
              </div>
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt={form.imageAlt}
                  style={{ width: 80, height: 80, objectFit: 'cover', filter: 'grayscale(1)' }}
                />
              )}
            </div>
          </div>

          <div className="adm-form-actions">
            <button className="adm-btn adm-btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Member'}
            </button>
            <button className="adm-btn adm-btn--ghost" type="button" onClick={() => setMode('list')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────
  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Team</h1>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>
          <span className="material-symbols-outlined">add</span>
          New Member
        </button>
      </div>

      {items.length === 0
        ? <div className="adm-empty">No team members yet.</div>
        : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Title</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="adm-table__meta">{item.order}</td>
                    <td className="adm-table__title">{item.name}</td>
                    <td className="adm-table__meta">{item.title}</td>
                    <td>
                      <div className="adm-table__actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Edit</button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => handleDelete(item._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
