import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getUserProfileByEmail,
  updateUserProfile,
} from '../api/userProfiles';
import {
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiLayers,
  FiSettings,
  FiShare2,
} from 'react-icons/fi';
import './Profile.css';

const EMPTY_PROFILE = {
  fullName: '',
  bio: '',
  email: '',
  mobileNumber: '',
  isMobileVerified: false,
  dob: '',
  gender: '',
  currentCity: '',
  skills: [],
  currentEducation: {
    institute: '',
    qualification: '',
    department: '',
    yearOfStudying: '',
    yearOfPassing: undefined,
  },
  jobPreferences: {
    minExpectedSalary: undefined,
    maxExpectedSalary: undefined,
    availability: '',
    lookingFor: '',
    yearsOfExperience: '',
    workPreference: '',
  },
  socialLinks: {
    linkedinProfile: '',
    githubUrl: '',
  },
  // dynamic profile sections
  experiences: [],
  educations: [],
  projects: [],
  certifications: [],
  achievements: [],
  rewards: [],
  hobbies: [],
  languages: [],
  referralLink: '',
};

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [activeTab, setActiveTab] = useState('user');

  const userEmail = user?.email || '';

  useEffect(() => {
    const loadProfile = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await getUserProfileByEmail(userEmail);
        const existing = res?.data;

        if (existing && existing._id) {
          setProfileId(existing._id);
          setForm({
            ...EMPTY_PROFILE,
            ...existing,
            dob: existing.dob ? existing.dob.slice(0, 10) : '',
            skills: Array.isArray(existing.skills) ? existing.skills : [],
            hobbies: Array.isArray(existing.hobbies) ? existing.hobbies : [],
            experiences: Array.isArray(existing.experiences)
              ? existing.experiences
              : [],
            educations: Array.isArray(existing.educations)
              ? existing.educations
              : [],
            projects: Array.isArray(existing.projects) ? existing.projects : [],
          });
        } else {
          setProfileId(null);
          setError('Profile not found. Please contact support.');
        }
      } catch (err) {
        setError(err?.error || err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCommaListChange = (field, value) => {
    const arr = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    handleChange(field, arr);
  };

  const getCommaListValue = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');

  const handleArrayItemChange = (section, index, field, value) => {
    setForm((prev) => {
      const list = Array.isArray(prev[section]) ? prev[section] : [];
      return {
        ...prev,
        [section]: list.map((item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
        ),
      };
    });
  };

  const handleArrayItemRemove = (section, index) => {
    setForm((prev) => {
      const list = Array.isArray(prev[section]) ? prev[section] : [];
      return {
        ...prev,
        [section]: list.filter((_, i) => i !== index),
      };
    });
  };

  const handleExperienceAdd = () => {
    setForm((prev) => ({
      ...prev,
      experiences: [
        ...(Array.isArray(prev.experiences) ? prev.experiences : []),
        {
          companyName: '',
          designation: '',
          location: '',
          joiningDate: '',
          currentlyWorkingHere: false,
          completionDate: '',
          description: '',
        },
      ],
    }));
  };

  const handleEducationAdd = () => {
    setForm((prev) => ({
      ...prev,
      educations: [
        ...(Array.isArray(prev.educations) ? prev.educations : []),
        {
          instituteName: '',
          degree: '',
          fieldOfStudy: '',
          courseDurationYears: '',
          startDate: '',
          currentlyStudying: false,
          endDate: '',
          gradeType: '',
          description: '',
        },
      ],
    }));
  };

  const handleProjectAdd = () => {
    setForm((prev) => ({
      ...prev,
      projects: [
        ...(Array.isArray(prev.projects) ? prev.projects : []),
        {
          title: '',
          technologiesUsed: '',
          description: '',
          projectLink: '',
          role: '',
          media: [],
        },
      ],
    }));
  };

  const handleProjectMediaChange = (index, field, value) => {
    setForm((prev) => {
      const projects = Array.isArray(prev.projects) ? prev.projects : [];
      return {
        ...prev,
        projects: projects.map((project, i) => {
          if (i !== index) return project;
          const media = Array.isArray(project.media) && project.media.length > 0
            ? project.media
            : [{}];
          const first = {
            ...media[0],
            [field]: value,
          };
          return {
            ...project,
            media: [first],
          };
        }),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      ...form,
      dob: form.dob ? new Date(form.dob).toISOString() : undefined,
      currentEducation: {
        ...form.currentEducation,
        yearOfPassing:
          form.currentEducation.yearOfPassing !== undefined &&
          form.currentEducation.yearOfPassing !== ''
            ? Number(form.currentEducation.yearOfPassing)
            : undefined,
      },
      jobPreferences: {
        ...form.jobPreferences,
        minExpectedSalary:
          form.jobPreferences.minExpectedSalary !== undefined &&
          form.jobPreferences.minExpectedSalary !== ''
            ? Number(form.jobPreferences.minExpectedSalary)
            : undefined,
        maxExpectedSalary:
          form.jobPreferences.maxExpectedSalary !== undefined &&
          form.jobPreferences.maxExpectedSalary !== ''
            ? Number(form.jobPreferences.maxExpectedSalary)
            : undefined,
      },
      experiences: Array.isArray(form.experiences) ? form.experiences : [],
      educations: Array.isArray(form.educations) ? form.educations : [],
      projects: Array.isArray(form.projects) ? form.projects : [],
    };

    if (!profileId) {
      setError('Cannot save changes because your profile is not loaded.');
      setSaving(false);
      return;
    }

    try {
      const updated = await updateUserProfile(profileId, payload);
      setSuccess('Profile updated successfully');
      const doc = updated?.data || {};
      setForm({
        ...EMPTY_PROFILE,
        ...doc,
        dob: doc.dob ? doc.dob.slice(0, 10) : '',
        skills: Array.isArray(doc.skills) ? doc.skills : [],
        hobbies: Array.isArray(doc.hobbies) ? doc.hobbies : [],
        experiences: Array.isArray(doc.experiences) ? doc.experiences : [],
        educations: Array.isArray(doc.educations) ? doc.educations : [],
        projects: Array.isArray(doc.projects) ? doc.projects : [],
      });
    } catch (err) {
      setError(
        err?.message ||
          err?.error ||
          err?.errors?.[0]?.msg ||
          'Failed to save profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h1>Student Profile</h1>
        <p className="profile-helper-text">
          Please log in to manage your student profile.
        </p>
      </div>
    );
  }

  if (user.role === 'COMPANY') {
    // Company accounts should manage their details in the company profile page
    return <Navigate to="/company/profile" replace />;
  }

  return (
    <div className="profile-page">
      <h1>Student Profile</h1>

      {loading ? (
        <div className="profile-card">
          <p>Loading your profile...</p>
        </div>
      ) : (
        <form className="profile-card profile-form" onSubmit={handleSubmit}>
          {error && <div className="profile-alert profile-alert-error">{error}</div>}
          {success && (
            <div className="profile-alert profile-alert-success">{success}</div>
          )}

          <div className="profile-tabs">
            <button
              type="button"
              className={`profile-tab ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              <FiUser />
              <span>User Info</span>
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <FiBriefcase />
              <span>Experience</span>
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <FiBookOpen />
              <span>Education</span>
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FiLayers />
              <span>Projects</span>
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'referrals' ? 'active' : ''}`}
              onClick={() => setActiveTab('referrals')}
            >
              <FiShare2 />
              <span>Referrals</span>
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings />
              <span>Settings</span>
            </button>
          </div>

          {activeTab === 'user' && (
            <section className="profile-section">
              <h2>Personal Information</h2>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Full Name *</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>Email *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>Mobile Number *</span>
                  <input
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>Date of Birth</span>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                  />
                </label>

                <label className="profile-field">
                  <span>Gender</span>
                  <select
                    value={form.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </label>

                <label className="profile-field">
                  <span>Current City</span>
                  <input
                    type="text"
                    value={form.currentCity || ''}
                    onChange={(e) => handleChange('currentCity', e.target.value)}
                  />
                </label>
              </div>

              <label className="profile-field">
                <span>Bio</span>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={form.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us about yourself, your goals, etc."
                />
              </label>

              <div className="profile-section-subtitle">Social Links</div>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>LinkedIn URL</span>
                  <input
                    type="url"
                    value={form.socialLinks?.linkedinProfile || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'socialLinks',
                        'linkedinProfile',
                        e.target.value
                      )
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </label>

                <label className="profile-field">
                  <span>GitHub URL</span>
                  <input
                    type="url"
                    value={form.socialLinks?.githubUrl || ''}
                    onChange={(e) =>
                      handleNestedChange('socialLinks', 'githubUrl', e.target.value)
                    }
                    placeholder="https://github.com/username"
                  />
                </label>
              </div>
            </section>
          )}

          {activeTab === 'experience' && (
            <section className="profile-section">
              <h2>Experience & Job Preferences</h2>

              <div className="profile-repeat-header">
                <span>Experiences</span>
                <button
                  type="button"
                  className="profile-chip-btn"
                  onClick={handleExperienceAdd}
                >
                  + Add Experience
                </button>
              </div>

              <div className="profile-repeat-list">
                {Array.isArray(form.experiences) && form.experiences.length > 0 ? (
                  form.experiences.map((exp, index) => (
                    <div key={index} className="profile-repeat-card">
                      <div className="profile-repeat-card-header">
                        <span className="profile-badge">
                          Experience {index + 1}
                        </span>
                        <button
                          type="button"
                          className="profile-chip-btn subtle"
                          onClick={() => handleArrayItemRemove('experiences', index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="profile-grid">
                        <label className="profile-field">
                          <span>Company Name *</span>
                          <input
                            type="text"
                            value={exp.companyName || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'experiences',
                                index,
                                'companyName',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Designation *</span>
                          <input
                            type="text"
                            value={exp.designation || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'experiences',
                                index,
                                'designation',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Location *</span>
                          <input
                            type="text"
                            value={exp.location || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'experiences',
                                index,
                                'location',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Joining Date *</span>
                          <input
                            type="date"
                            value={exp.joiningDate ? exp.joiningDate.slice(0, 10) : ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'experiences',
                                index,
                                'joiningDate',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Completion Date</span>
                          <input
                            type="date"
                            value={
                              exp.completionDate
                                ? exp.completionDate.slice(0, 10)
                                : ''
                            }
                            onChange={(e) =>
                              handleArrayItemChange(
                                'experiences',
                                index,
                                'completionDate',
                                e.target.value
                              )
                            }
                            disabled={exp.currentlyWorkingHere}
                          />
                          <div className="profile-checkbox-row">
                            <input
                              id={`exp-current-${index}`}
                              type="checkbox"
                              checked={Boolean(exp.currentlyWorkingHere)}
                              onChange={(e) =>
                                handleArrayItemChange(
                                  'experiences',
                                  index,
                                  'currentlyWorkingHere',
                                  e.target.checked
                                )
                              }
                            />
                            <label htmlFor={`exp-current-${index}`}>
                              Currently working here
                            </label>
                          </div>
                        </label>

                        <label className="profile-field profile-field-full">
                          <span>Description *</span>
                          <textarea
                            rows={3}
                            value={exp.description || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'experiences',
                                index,
                                'description',
                                e.target.value
                              )
                            }
                            placeholder="Describe your role, responsibilities and impact"
                          />
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="profile-empty-text">
                    No experiences added yet. Click &quot;Add Experience&quot;.
                  </p>
                )}
              </div>

              <div className="profile-section-subtitle">Job Preferences</div>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Looking For</span>
                  <select
                    value={form.jobPreferences?.lookingFor || ''}
                    onChange={(e) =>
                      handleNestedChange('jobPreferences', 'lookingFor', e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Job">Job</option>
                    <option value="Internship">Internship</option>
                  </select>
                </label>

                <label className="profile-field">
                  <span>Availability</span>
                  <select
                    value={form.jobPreferences?.availability || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'jobPreferences',
                        'availability',
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select</option>
                    <option value="Immediate">Immediate</option>
                    <option value="10 days">10 days</option>
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                    <option value="120 days">120 days</option>
                  </select>
                </label>

                <label className="profile-field">
                  <span>Years of Experience</span>
                  <input
                    type="text"
                    value={form.jobPreferences?.yearsOfExperience || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'jobPreferences',
                        'yearsOfExperience',
                        e.target.value
                      )
                    }
                    placeholder="0, 1 year, 2 years..."
                  />
                </label>

                <label className="profile-field">
                  <span>Work Preference</span>
                  <select
                    value={form.jobPreferences?.workPreference || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'jobPreferences',
                        'workPreference',
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select</option>
                    <option value="Work from Home">Work from Home</option>
                    <option value="Work from Office">Work from Office</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </label>

                <label className="profile-field">
                  <span>Min Expected Salary (per year)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.jobPreferences?.minExpectedSalary || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'jobPreferences',
                        'minExpectedSalary',
                        e.target.value
                      )
                    }
                    placeholder="200000"
                  />
                </label>

                <label className="profile-field">
                  <span>Max Expected Salary (per year)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.jobPreferences?.maxExpectedSalary || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'jobPreferences',
                        'maxExpectedSalary',
                        e.target.value
                      )
                    }
                    placeholder="300000"
                  />
                </label>
              </div>
            </section>
          )}

          {activeTab === 'education' && (
            <section className="profile-section">
              <h2>Education & Skills</h2>

              <div className="profile-repeat-header">
                <span>Educations</span>
                <button
                  type="button"
                  className="profile-chip-btn"
                  onClick={handleEducationAdd}
                >
                  + Add Education
                </button>
              </div>

              <div className="profile-repeat-list">
                {Array.isArray(form.educations) && form.educations.length > 0 ? (
                  form.educations.map((edu, index) => (
                    <div key={index} className="profile-repeat-card">
                      <div className="profile-repeat-card-header">
                        <span className="profile-badge">Education {index + 1}</span>
                        <button
                          type="button"
                          className="profile-chip-btn subtle"
                          onClick={() => handleArrayItemRemove('educations', index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="profile-grid">
                        <label className="profile-field">
                          <span>Institute Name *</span>
                          <input
                            type="text"
                            value={edu.instituteName || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'instituteName',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Degree *</span>
                          <input
                            type="text"
                            value={edu.degree || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'degree',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Field of Study *</span>
                          <input
                            type="text"
                            value={edu.fieldOfStudy || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'fieldOfStudy',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Course Duration (years) *</span>
                          <input
                            type="number"
                            min="0"
                            value={edu.courseDurationYears || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'courseDurationYears',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Start Date *</span>
                          <input
                            type="date"
                            value={edu.startDate ? edu.startDate.slice(0, 10) : ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'startDate',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>End Date</span>
                          <input
                            type="date"
                            value={edu.endDate ? edu.endDate.slice(0, 10) : ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'endDate',
                                e.target.value
                              )
                            }
                            disabled={edu.currentlyStudying}
                          />
                          <div className="profile-checkbox-row">
                            <input
                              id={`edu-current-${index}`}
                              type="checkbox"
                              checked={Boolean(edu.currentlyStudying)}
                              onChange={(e) =>
                                handleArrayItemChange(
                                  'educations',
                                  index,
                                  'currentlyStudying',
                                  e.target.checked
                                )
                              }
                            />
                            <label htmlFor={`edu-current-${index}`}>
                              Currently studying
                            </label>
                          </div>
                        </label>

                        <label className="profile-field">
                          <span>Grade Type</span>
                          <input
                            type="text"
                            value={edu.gradeType || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'gradeType',
                                e.target.value
                              )
                            }
                            placeholder="CGPA, Percentage, etc."
                          />
                        </label>

                        <label className="profile-field profile-field-full">
                          <span>Description *</span>
                          <textarea
                            rows={3}
                            value={edu.description || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'educations',
                                index,
                                'description',
                                e.target.value
                              )
                            }
                            placeholder="Describe your course, focus areas and highlights"
                          />
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="profile-empty-text">
                    No education records yet. Click &quot;Add Education&quot;.
                  </p>
                )}
              </div>

              <div className="profile-section-subtitle">Current Education Snapshot</div>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Skills (comma separated)</span>
                  <input
                    type="text"
                    value={getCommaListValue(form.skills)}
                    onChange={(e) =>
                      handleCommaListChange('skills', e.target.value)
                    }
                    placeholder="JavaScript, React, Node.js"
                  />
                </label>

                <label className="profile-field">
                  <span>Institute</span>
                  <input
                    type="text"
                    value={form.currentEducation?.institute || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'currentEducation',
                        'institute',
                        e.target.value
                      )
                    }
                  />
                </label>

                <label className="profile-field">
                  <span>Qualification</span>
                  <input
                    type="text"
                    value={form.currentEducation?.qualification || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'currentEducation',
                        'qualification',
                        e.target.value
                      )
                    }
                    placeholder="B.Tech"
                  />
                </label>

                <label className="profile-field">
                  <span>Department</span>
                  <input
                    type="text"
                    value={form.currentEducation?.department || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'currentEducation',
                        'department',
                        e.target.value
                      )
                    }
                    placeholder="Electronics and Communication"
                  />
                </label>

                <label className="profile-field">
                  <span>Year of Studying</span>
                  <select
                    value={form.currentEducation?.yearOfStudying || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'currentEducation',
                        'yearOfStudying',
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select</option>
                    <option value="1st year">1st year</option>
                    <option value="2nd year">2nd year</option>
                    <option value="3rd year">3rd year</option>
                    <option value="4th year">4th year</option>
                    <option value="5th year">5th year</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>

                <label className="profile-field">
                  <span>Year of Passing</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.currentEducation?.yearOfPassing || ''}
                    onChange={(e) =>
                      handleNestedChange(
                        'currentEducation',
                        'yearOfPassing',
                        e.target.value
                      )
                    }
                    placeholder="2028"
                  />
                </label>
              </div>
            </section>
          )}

          {activeTab === 'projects' && (
            <section className="profile-section">
              <h2>Projects</h2>

              <div className="profile-repeat-header">
                <span>Projects</span>
                <button
                  type="button"
                  className="profile-chip-btn"
                  onClick={handleProjectAdd}
                >
                  + Add Project
                </button>
              </div>

              <div className="profile-repeat-list">
                {Array.isArray(form.projects) && form.projects.length > 0 ? (
                  form.projects.map((project, index) => (
                    <div key={index} className="profile-repeat-card">
                      <div className="profile-repeat-card-header">
                        <span className="profile-badge">Project {index + 1}</span>
                        <button
                          type="button"
                          className="profile-chip-btn subtle"
                          onClick={() => handleArrayItemRemove('projects', index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="profile-grid">
                        <label className="profile-field">
                          <span>Title *</span>
                          <input
                            type="text"
                            value={project.title || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'projects',
                                index,
                                'title',
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <label className="profile-field">
                          <span>Technologies Used *</span>
                          <input
                            type="text"
                            value={project.technologiesUsed || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'projects',
                                index,
                                'technologiesUsed',
                                e.target.value
                              )
                            }
                            placeholder="React, Node.js, MongoDB"
                          />
                        </label>

                        <label className="profile-field">
                          <span>Role *</span>
                          <input
                            type="text"
                            value={project.role || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'projects',
                                index,
                                'role',
                                e.target.value
                              )
                            }
                            placeholder="Full‑stack developer, Frontend intern..."
                          />
                        </label>

                        <label className="profile-field">
                          <span>Project Link</span>
                          <input
                            type="url"
                            value={project.projectLink || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'projects',
                                index,
                                'projectLink',
                                e.target.value
                              )
                            }
                            placeholder="https://github.com/..."
                          />
                        </label>

                        <label className="profile-field profile-field-full">
                          <span>Description *</span>
                          <textarea
                            rows={3}
                            value={project.description || ''}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'projects',
                                index,
                                'description',
                                e.target.value
                              )
                            }
                            placeholder="Explain what the project does and your contributions"
                          />
                        </label>
                      </div>

                      <div className="profile-section-subtitle">Media (optional)</div>
                      <div className="profile-grid">
                        <label className="profile-field">
                          <span>Media URL</span>
                          <input
                            type="url"
                            value={
                              Array.isArray(project.media) && project.media[0]
                                ? project.media[0].url || ''
                                : ''
                            }
                            onChange={(e) =>
                              handleProjectMediaChange(index, 'url', e.target.value)
                            }
                            placeholder="https://..."
                          />
                        </label>

                        <label className="profile-field">
                          <span>Media Type</span>
                          <input
                            type="text"
                            value={
                              Array.isArray(project.media) && project.media[0]
                                ? project.media[0].type || ''
                                : ''
                            }
                            onChange={(e) =>
                              handleProjectMediaChange(index, 'type', e.target.value)
                            }
                            placeholder="image, video, pdf..."
                          />
                        </label>

                        <label className="profile-field">
                          <span>Media Name</span>
                          <input
                            type="text"
                            value={
                              Array.isArray(project.media) && project.media[0]
                                ? project.media[0].name || ''
                                : ''
                            }
                            onChange={(e) =>
                              handleProjectMediaChange(index, 'name', e.target.value)
                            }
                            placeholder="Screenshot 1, Demo video..."
                          />
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="profile-empty-text">
                    No projects added yet. Click &quot;Add Project&quot;.
                  </p>
                )}
              </div>

              <div className="profile-section-subtitle">
                Certifications, Achievements & Rewards
              </div>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Certifications (comma separated)</span>
                  <input
                    type="text"
                    value={getCommaListValue(
                      (form.certifications || []).map((c) =>
                        typeof c === 'string' ? c : c.title || ''
                      )
                    )}
                    onChange={(e) => {
                      handleChange(
                        'certifications',
                        e.target.value
                          .split(',')
                          .map((v) => v.trim())
                          .filter(Boolean)
                      );
                    }}
                    placeholder="AWS Cloud Practitioner, React Basics"
                  />
                </label>

                <label className="profile-field">
                  <span>Achievements (comma separated)</span>
                  <input
                    type="text"
                    value={getCommaListValue(
                      (form.achievements || []).map((c) =>
                        typeof c === 'string' ? c : c.title || ''
                      )
                    )}
                    onChange={(e) => {
                      handleChange(
                        'achievements',
                        e.target.value
                          .split(',')
                          .map((v) => v.trim())
                          .filter(Boolean)
                      );
                    }}
                    placeholder="Hackathon winner, College topper"
                  />
                </label>

                <label className="profile-field">
                  <span>Rewards (comma separated)</span>
                  <input
                    type="text"
                    value={getCommaListValue(
                      (form.rewards || []).map((c) =>
                        typeof c === 'string' ? c : c.title || ''
                      )
                    )}
                    onChange={(e) => {
                      handleChange(
                        'rewards',
                        e.target.value
                          .split(',')
                          .map((v) => v.trim())
                          .filter(Boolean)
                      );
                    }}
                    placeholder="Scholarships, Awards"
                  />
                </label>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="profile-section">
              <h2>Preferences & Extras</h2>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Hobbies (comma separated)</span>
                  <input
                    type="text"
                    value={getCommaListValue(form.hobbies)}
                    onChange={(e) =>
                      handleCommaListChange('hobbies', e.target.value)
                    }
                    placeholder="Reading, Coding, Music"
                  />
                </label>

                <label className="profile-field">
                  <span>Languages (simple list)</span>
                  <input
                    type="text"
                    value={getCommaListValue(
                      (form.languages || []).map((l) => l.name || '')
                    )}
                    onChange={(e) => {
                      const names = e.target.value
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                      setForm((prev) => ({
                        ...prev,
                        languages: names.map((name) => ({
                          name,
                          proficiency: 'Intermediate',
                        })),
                      }));
                    }}
                    placeholder="English, Telugu, Hindi"
                  />
                </label>
              </div>
            </section>
          )}

          {activeTab === 'referrals' && (
            <section className="profile-section">
              <h2>Referrals</h2>
              <p className="profile-helper-text">
                Share your unique referral link with friends to invite them to Telugu
                Info Student.
              </p>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Your Referral Link</span>
                  <input
                    type="url"
                    value={form.referralLink || ''}
                    onChange={(e) => handleChange('referralLink', e.target.value)}
                    placeholder="https://teluguinfo.in/ref/your-code"
                  />
                </label>
              </div>
            </section>
          )}

          <div className="profile-actions">
            <button
              type="submit"
              className="profile-btn primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

