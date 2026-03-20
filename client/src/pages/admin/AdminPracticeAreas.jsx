import { useEffect, useState } from 'react';
import { adminFetch } from '../../utils/adminApi';

const EMPTY_FORM = {
  title: '', slug: '', description: '', icon: '', order: '',
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPracticeAreas() {
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
      setItems(await adminFetch('/api/admin/practice-areas'));
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
      title:       item.title,
      slug:        item.slug,
      description: item.description,
      icon:        item.icon,
      order:       item.order ?? '',
    });
    setError('');
    setSuccess('');
    setMode('form');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'title' && !editing) next.slug = slugify(value);
      return next;
    });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this practice area?')) return;
    try {
      await adminFetch(`/api/admin/practice-areas/${id}`, { method: 'DELETE' });
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
        const updated = await adminFetch(`/api/admin/practice-areas/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setItems((prev) => prev.map((i) => (i._id === editing._id ? updated : i)));
        setEditing(updated);
        setSuccess('Saved successfully.');
      } else {
        const created = await adminFetch('/api/admin/practice-areas', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setItems((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setSuccess('Practice area created.');
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
          <h1 className="adm-page-title">{editing ? 'Edit Practice Area' : 'New Practice Area'}</h1>
          <button className="adm-btn adm-btn--ghost" onClick={() => setMode('list')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to list
          </button>
        </div>

        {error   && <p className="adm-error"   style={{ marginBottom: '1.25rem' }}>{error}</p>}
        {success && <p className="adm-success" style={{ marginBottom: '1.25rem' }}>{success}</p>}

        <form onSubmit={handleSubmit} className="adm-form">
          <div className="adm-card">
            <div className="adm-form-grid">
              <div className="adm-field adm-field--full">
                <label className="adm-label">Title</label>
                <input className="adm-input" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Slug</label>
                <input className="adm-input" name="slug" value={form.slug} onChange={handleChange} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">
                  Icon <span>(<a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">Material Symbol</a> name)</span>
                </label>
                <input className="adm-input" name="icon" value={form.icon} onChange={handleChange} required placeholder="business_center" />
                {form.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: '#002444', marginTop: '0.375rem' }}>
                    {form.icon}
                  </span>
                )}
              </div>
              <div className="adm-field">
                <label className="adm-label">Display Order</label>
                <input className="adm-input" type="number" name="order" value={form.order} onChange={handleChange} min={0} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-label">Description</label>
                <textarea className="adm-textarea" name="description" value={form.description} onChange={handleChange} required rows={4} />
              </div>
            </div>
          </div>

          <div className="adm-form-actions">
            <button className="adm-btn adm-btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Area'}
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
        <h1 className="adm-page-title">Practice Areas</h1>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>
          <span className="material-symbols-outlined">add</span>
          New Area
        </button>
      </div>

      {items.length === 0
        ? <div className="adm-empty">No practice areas yet.</div>
        : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="adm-table__meta">{item.order}</td>
                    <td>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#002444' }}>
                        {item.icon}
                      </span>
                    </td>
                    <td className="adm-table__title">{item.title}</td>
                    <td className="adm-table__meta">{item.slug}</td>
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
