import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { predictColleges } from '../../api/predictor';
import { handleApiError } from '../../utils/errorHandler';
import { CATEGORIES, STATES, STATE_LABELS } from '../../utils/constants';
import './Predictor.css';

const schema = yup.object({
  rank: yup.number().min(1, 'Rank must be at least 1').required('Rank is required'),
  category: yup.string().oneOf(CATEGORIES).required('Category is required'),
  state: yup.string().oneOf(['AP', 'TS']).required('State is required'),
  district: yup.string().optional(),
});

export default function CollegePredictor() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rank: '',
      category: 'OC',
      state: user?.state || 'AP',
      district: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setResults([]);
    try {
      const res = await predictColleges({
        rank: Number(data.rank),
        category: data.category,
        state: data.state,
        district: data.district || undefined,
      });
      const list = res?.data ?? [];
      setResults(list);
      if (list.length === 0) {
        toast('No colleges found for your rank. Try a higher rank.');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predictor-page">
      <h1>College Predictor</h1>
      <p className="section-desc">Find colleges by your rank and category</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-card predictor-form">
        <div className="form-row">
          <div className="form-group">
            <label>Rank *</label>
            <input type="number" min={1} {...register('rank')} placeholder="e.g. 5000" />
            {formState.errors.rank && (
              <span className="error">{formState.errors.rank.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select {...register('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>State *</label>
            <select {...register('state')}>
              {STATES.map((s) => (
                <option key={s} value={s}>{STATE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>District (optional)</label>
            <input {...register('district')} placeholder="e.g. Visakhapatnam" />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Finding...' : 'Find Colleges'}
        </button>
      </form>

      {loading && (
        <div className="page-loading">
          <div className="spinner" />
          <p>Finding colleges...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="predictor-results">
          <h2>Results ({results.length})</h2>
          <div className="results-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>College</th>
                  <th>District</th>
                  <th>OC</th>
                  <th>BC</th>
                  <th>SC</th>
                  <th>ST</th>
                  <th>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {results.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.district || '–'}</td>
                    <td>{c.cutoffRanks?.OC ?? '–'}</td>
                    <td>{c.cutoffRanks?.BC ?? '–'}</td>
                    <td>{c.cutoffRanks?.SC ?? '–'}</td>
                    <td>{c.cutoffRanks?.ST ?? '–'}</td>
                    <td>{Array.isArray(c.reviews) ? c.reviews.length : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && (
        <p className="empty-hint">Enter rank and click Find Colleges to see results.</p>
      )}
    </div>
  );
}
