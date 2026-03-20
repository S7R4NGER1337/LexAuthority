import { useEffect, useState } from 'react';
import { adminFetch } from '../../utils/adminApi';

const CATEGORIES = [
  'Corporate Law', 'Litigation', 'Regulatory Affairs',
  'Intellectual Property', 'Real Estate', 'Corporate Governance',
];

const EMPTY_FORM = {
  category: CATEGORIES[0],
  title: '', slug: '', author: '', authorTitle: '',
  readTime: '', publishedAt: '', excerpt: '',
  body: '', tags: '', imageUrl: '', imageAlt: '',
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function AdminInsights() {
  const [items, setItems]     = useState([]);
  const [mode, setMode]       = useState('list'); // 'list' | 'form'
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setItems(await adminFetch('/api/admin/insights'));
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
      category:    item.category,
      title:       item.title,
      slug:        item.slug,
      author:      item.author || '',
      authorTitle: item.authorTitle || '',
      readTime:    item.readTime || '',
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : '',
      excerpt:     item.excerpt,
      body:        item.body || '',
      tags:        item.tags?.join(', ') || '',
      imageUrl:    item.imageUrl || '',
      imageAlt:    item.imageAlt || '',
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
    if (!window.confirm('Delete this insight?')) return;
    try {
      await adminFetch(`/api/admin/insights/${id}`, { method: 'DELETE' });
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

    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editing) {
        const updated = await adminFetch(`/api/admin/insights/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setItems((prev) => prev.map((i) => (i._id === editing._id ? updated : i)));
        setEditing(updated);
        setSuccess('Saved successfully.');
      } else {
        const created = await adminFetch('/api/admin/insights', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setItems((prev) => [created, ...prev]);
        setSuccess('Insight created.');
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
          <h1 className="adm-page-title">{editing ? 'Edit Insight' : 'New Insight'}</h1>
          <button className="adm-btn adm-btn--ghost" onClick={() => setMode('list')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to list
          </button>
        </div>

        {error   && <p className="adm-error"   style={{ marginBottom: '1.25rem' }}>{error}</p>}
        {success && <p className="adm-success" style={{ marginBottom: '1.25rem' }}>{success}</p>}

        <form onSubmit={handleSubmit} className="adm-form">
          {/* Basic info */}
          <div className="adm-card">
            <div className="adm-section-title" style={{ marginBottom: '1.25rem' }}>Basic Info</div>
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
                <label className="adm-label">Category</label>
                <select className="adm-select" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Author</label>
                <input className="adm-input" name="author" value={form.author} onChange={handleChange} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Author Title</label>
                <input className="adm-input" name="authorTitle" value={form.authorTitle} onChange={handleChange} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Read Time</label>
                <input className="adm-input" name="readTime" value={form.readTime} onChange={handleChange} placeholder="8 Min Read" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Published Date</label>
                <input className="adm-input" type="date" name="publishedAt" value={form.publishedAt} onChange={handleChange} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Tags <span>(comma-separated)</span></label>
                <input className="adm-input" name="tags" value={form.tags} onChange={handleChange} placeholder="Compliance, International" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="adm-card">
            <div className="adm-section-title" style={{ marginBottom: '1.25rem' }}>Content</div>
            <div className="adm-form" style={{ gap: '1.25rem' }}>
              <div className="adm-field">
                <label className="adm-label">Excerpt / Lead</label>
                <textarea className="adm-textarea" name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Body <span>(HTML supported)</span></label>
                <textarea className="adm-textarea adm-textarea--lg" name="body" value={form.body} onChange={handleChange} />
                <p className="adm-hint">Use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, and &lt;div class="callout"&gt; for styled blocks.</p>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="adm-card">
            <div className="adm-section-title" style={{ marginBottom: '1.25rem' }}>Media</div>
            <div className="adm-form-grid">
              <div className="adm-field adm-field--full">
                <label className="adm-label">Image URL</label>
                <input className="adm-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-label">Image Alt Text</label>
                <input className="adm-input" name="imageAlt" value={form.imageAlt} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="adm-form-actions">
            <button className="adm-btn adm-btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Insight'}
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
        <h1 className="adm-page-title">Insights</h1>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>
          <span className="material-symbols-outlined">add</span>
          New Insight
        </button>
      </div>

      {items.length === 0
        ? <div className="adm-empty">No insights yet.</div>
        : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Published</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="adm-table__title">{item.title}</td>
                    <td className="adm-table__meta">{item.category}</td>
                    <td className="adm-table__meta">{item.author || '—'}</td>
                    <td className="adm-table__meta">{formatDate(item.publishedAt)}</td>
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
