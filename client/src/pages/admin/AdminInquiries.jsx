import { useEffect, useState } from 'react';
import { adminFetch } from '../../utils/adminApi';

const STATUS_LABELS = { new: 'New', read: 'Read', replied: 'Replied' };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminInquiries() {
  const [items, setItems]       = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setItems(await adminFetch('/api/admin/inquiries'));
    } catch { /* handled by redirect */ }
  }

  async function changeStatus(id, status) {
    try {
      const updated = await adminFetch(`/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await adminFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i._id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      alert(err.message);
    }
  }

  const newCount = items.filter((i) => i.status === 'new').length;

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">
          Inquiries
          {newCount > 0 && (
            <span className="adm-badge adm-badge--new" style={{ marginLeft: '0.75rem', fontSize: '0.75rem' }}>
              {newCount} new
            </span>
          )}
        </h1>
      </div>

      {items.length === 0
        ? <div className="adm-empty">No inquiries yet.</div>
        : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Practice Area</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <>
                    <tr key={item._id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === item._id ? null : item._id)}>
                      <td>
                        <span className={`adm-badge adm-badge--${item.status}`}>
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="adm-table__title" style={{ maxWidth: 160 }}>{item.name}</td>
                      <td className="adm-table__meta">{item.email}</td>
                      <td className="adm-table__meta">{item.practiceArea}</td>
                      <td className="adm-table__meta">{formatDate(item.createdAt)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="adm-table__actions">
                          <select
                            className="adm-select"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                            value={item.status}
                            onChange={(e) => changeStatus(item._id, e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                          <button
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === item._id && (
                      <tr key={`${item._id}-msg`}>
                        <td colSpan={6} style={{ padding: '0 1.25rem 1.25rem', background: '#fafafa' }}>
                          <div className="adm-inquiry-message">{item.message}</div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
