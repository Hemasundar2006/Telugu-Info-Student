import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyCompanyProfile } from '../../api/companies';
import { handleApiError } from '../../utils/errorHandler';
import '../../components/UserStatsCard.css';
import '../Profile.css';

export default function CompanyProfileOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user || user.role !== 'COMPANY') {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await getMyCompanyProfile();
        if (!res?.success || !res.data) {
          setError(res?.error || 'Failed to load company profile');
          setCompany(null);
        } else {
          setCompany(res.data);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user || user.role !== 'COMPANY') {
    return (
      <div className="profile-page">
        <h1>Company Profile</h1>
        <p className="profile-helper-text">Please log in as a company to view this page.</p>
      </div>
    );
  }

  const name = company?.companyName || user.name || 'Company';
  const logo = company?.logo || '';
  const industry = company?.industry || '';
  const website = company?.website || '';
  const headquarters = company?.headquarters || '';
  const recruiter = company?.recruiter || {};

  return (
    <div className="profile-page">
      <h1>Company Profile</h1>

      {loading ? (
        <div className="profile-card">
          <p>Loading company overview...</p>
        </div>
      ) : error ? (
        <div className="profile-card">
          <p className="profile-alert profile-alert-error">{error}</p>
        </div>
      ) : (
        <>
          <div className="user-stats-card" style={{ marginBottom: '1rem' }}>
            <div className="user-stats-header">
              <div className="user-stats-avatar">
                {logo ? (
                  <img src={logo} alt={name} />
                ) : (
                  <div className="user-stats-avatar-fallback" aria-hidden />
                )}
              </div>
              <div className="user-stats-meta">
                <div className="user-stats-name-row">
                  <h2 className="user-stats-name">{name}</h2>
                  {industry && <span className="user-stats-role">{industry}</span>}
                </div>
                {website && (
                  <div className="user-stats-id">
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Company overview</h2>
            <div className="profile-grid">
              {headquarters && (
                <div className="profile-field">
                  <span>Headquarters</span>
                  <div>{headquarters}</div>
                </div>
              )}
              {Array.isArray(company?.officeLocations) && company.officeLocations.length > 0 && (
                <div className="profile-field">
                  <span>Office Locations</span>
                  <div>{company.officeLocations.join(', ')}</div>
                </div>
              )}
              {company?.companySize && (
                <div className="profile-field">
                  <span>Company Size</span>
                  <div>{company.companySize}</div>
                </div>
              )}
              {company?.yearFounded && (
                <div className="profile-field">
                  <span>Year Founded</span>
                  <div>{company.yearFounded}</div>
                </div>
              )}
            </div>

            <h3 className="profile-section-subtitle">Recruiter</h3>
            <div className="profile-grid">
              {recruiter.name && (
                <div className="profile-field">
                  <span>Name</span>
                  <div>{recruiter.name}</div>
                </div>
              )}
              {recruiter.designation && (
                <div className="profile-field">
                  <span>Designation</span>
                  <div>{recruiter.designation}</div>
                </div>
              )}
              {recruiter.email && (
                <div className="profile-field">
                  <span>Email</span>
                  <div>{recruiter.email}</div>
                </div>
              )}
              {recruiter.phone && (
                <div className="profile-field">
                  <span>Phone</span>
                  <div>{recruiter.phone}</div>
                </div>
              )}
            </div>

            <div className="profile-actions" style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="profile-btn primary"
                onClick={() => navigate('/company/profile/edit')}
              >
                Edit profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

