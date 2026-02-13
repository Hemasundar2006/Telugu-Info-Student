import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createJob,
  getJobById,
  updateJob,
  checkMatchingStudents,
} from '../../api/adminJobs';
import { handleApiError } from '../../utils/errorHandler';
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  TARGET_QUALIFICATIONS,
  CATEGORY_ELIGIBILITY,
  NOTIFYING_AUTHORITIES,
  GOVT_GRADES,
  WORK_MODES,
  PAY_STRUCTURES,
  COMPANY_SIZES,
  JOB_STATUSES,
  JOB_TITLE_MIN,
  JOB_TITLE_MAX,
  JOB_DESCRIPTION_MIN,
  DEFAULT_JOB_TYPE,
  DEFAULT_CATEGORY_ELIGIBILITY,
  CURRENCY,
} from '../../utils/jobPostingConstants';
import toast from 'react-hot-toast';
import './Jobs.css';

const emptyGovtFields = () => ({
  notifyingAuthority: '',
  postCode: '',
  grade: '',
  payScale: { min: '', max: '', currency: CURRENCY },
  additionalBenefits: { dearness: '', houseRent: '', medicalBenefit: '', pensionScheme: '' },
  examPattern: '',
  examSyllabi: '',
  examDate: '',
  admitCardDate: '',
  resultDate: '',
  selectionProcess: '',
  applicationFee: 0,
  officialLink: '',
  notificationPDF: '',
});

const emptyPrivateFields = () => ({
  workMode: '',
  jobLocation: [''],
  salaryRange: { min: '', max: '', currency: CURRENCY, payStructure: 'CTC' },
  companyWebsite: '',
  companyDescription: '',
  companySize: '',
  industry: '',
  hrContactPerson: '',
  hrContactEmail: '',
  hrContactPhone: '',
  applicationLink: '',
});

const emptyForm = () => ({
  jobTitle: '',
  organization: '',
  jobCategory: 'Private',
  jobType: DEFAULT_JOB_TYPE,
  targetQualifications: [],
  qualifications: [],
  experience: { min: '', max: '' },
  skillsRequired: [],
  preferredSkills: [],
  ageLimit: { min: '', max: '' },
  categoryEligibility: [...DEFAULT_CATEGORY_ELIGIBILITY],
  totalPositions: 1,
  jobDescription: '',
  lastApplicationDate: '',
  status: 'Active',
  featured: false,
  tags: [],
  govtJobFields: emptyGovtFields(),
  privateJobFields: emptyPrivateFields(),
});

function parseJobToForm(job) {
  const form = emptyForm();
  if (!job) return form;
  form.jobTitle = job.jobTitle ?? '';
  form.organization = job.organization ?? '';
  form.jobCategory = job.jobCategory ?? 'Private';
  form.jobType = job.jobType ?? DEFAULT_JOB_TYPE;
  form.targetQualifications = Array.isArray(job.targetQualifications) ? [...job.targetQualifications] : [];
  form.qualifications = Array.isArray(job.qualifications) ? [...job.qualifications] : [];
  form.experience = { min: job.experience?.min ?? '', max: job.experience?.max ?? '' };
  form.skillsRequired = Array.isArray(job.skillsRequired) ? [...job.skillsRequired] : [];
  form.preferredSkills = Array.isArray(job.preferredSkills) ? [...job.preferredSkills] : [];
  form.ageLimit = { min: job.ageLimit?.min ?? '', max: job.ageLimit?.max ?? '' };
  form.categoryEligibility = Array.isArray(job.categoryEligibility)?.length ? [...job.categoryEligibility] : [...DEFAULT_CATEGORY_ELIGIBILITY];
  form.totalPositions = job.totalPositions ?? 1;
  form.jobDescription = job.jobDescription ?? '';
  form.lastApplicationDate = job.lastApplicationDate ? new Date(job.lastApplicationDate).toISOString().slice(0, 10) : '';
  form.status = job.status ?? 'Active';
  form.featured = !!job.featured;
  form.tags = Array.isArray(job.tags) ? [...job.tags] : [];
  if (job.jobCategory === 'Government' && job.govtJobFields) {
    form.govtJobFields = {
      ...emptyGovtFields(),
      ...job.govtJobFields,
      payScale: { ...emptyGovtFields().payScale, ...job.govtJobFields.payScale },
      additionalBenefits: { ...emptyGovtFields().additionalBenefits, ...job.govtJobFields.additionalBenefits },
    };
  }
  if (job.jobCategory === 'Private' && job.privateJobFields) {
    const locs = job.privateJobFields.jobLocation;
    form.privateJobFields = {
      ...emptyPrivateFields(),
      ...job.privateJobFields,
      jobLocation: Array.isArray(locs) && locs.length ? [...locs] : [''],
      salaryRange: { ...emptyPrivateFields().salaryRange, ...job.privateJobFields.salaryRange },
    };
  }
  return form;
}

function formToPayload(form) {
  const payload = {
    jobTitle: form.jobTitle.trim(),
    organization: form.organization.trim(),
    jobCategory: form.jobCategory,
    jobType: form.jobType,
    targetQualifications: form.targetQualifications.filter(Boolean),
    qualifications: form.qualifications.filter(Boolean),
    totalPositions: Number(form.totalPositions) || 1,
    jobDescription: form.jobDescription.trim(),
    lastApplicationDate: form.lastApplicationDate ? new Date(form.lastApplicationDate).toISOString() : undefined,
    status: form.status,
    featured: form.featured,
    tags: form.tags.filter(Boolean),
  };
  if (form.experience.min !== '' || form.experience.max !== '') {
    payload.experience = {
      min: form.experience.min === '' ? undefined : Number(form.experience.min),
      max: form.experience.max === '' ? undefined : Number(form.experience.max),
    };
  }
  if (form.ageLimit.min !== '' || form.ageLimit.max !== '') {
    payload.ageLimit = {
      min: form.ageLimit.min === '' ? undefined : Number(form.ageLimit.min),
      max: form.ageLimit.max === '' ? undefined : Number(form.ageLimit.max),
    };
  }
  if (form.categoryEligibility.length) payload.categoryEligibility = form.categoryEligibility;
  if (form.skillsRequired.length) payload.skillsRequired = form.skillsRequired.filter(Boolean);
  if (form.preferredSkills.length) payload.preferredSkills = form.preferredSkills.filter(Boolean);

  if (form.jobCategory === 'Government') {
    const g = form.govtJobFields;
    payload.govtJobFields = {
      notifyingAuthority: g.notifyingAuthority,
      postCode: g.postCode,
      grade: g.grade,
      payScale: {
        min: Number(g.payScale.min) || 0,
        max: Number(g.payScale.max) || 0,
        currency: CURRENCY,
      },
      additionalBenefits: g.additionalBenefits,
      examPattern: g.examPattern || undefined,
      examSyllabi: g.examSyllabi || undefined,
      examDate: g.examDate ? new Date(g.examDate).toISOString() : undefined,
      admitCardDate: g.admitCardDate ? new Date(g.admitCardDate).toISOString() : undefined,
      resultDate: g.resultDate ? new Date(g.resultDate).toISOString() : undefined,
      selectionProcess: g.selectionProcess || undefined,
      applicationFee: Number(g.applicationFee) || 0,
      officialLink: g.officialLink,
      notificationPDF: g.notificationPDF || undefined,
    };
  } else {
    const p = form.privateJobFields;
    payload.privateJobFields = {
      workMode: p.workMode,
      jobLocation: p.jobLocation.filter(Boolean),
      salaryRange: {
        min: Number(p.salaryRange.min) || 0,
        max: Number(p.salaryRange.max) || 0,
        currency: CURRENCY,
        payStructure: p.salaryRange.payStructure || 'CTC',
      },
      companyWebsite: p.companyWebsite || undefined,
      companyDescription: p.companyDescription || undefined,
      companySize: p.companySize || undefined,
      industry: p.industry || undefined,
      hrContactPerson: p.hrContactPerson || undefined,
      hrContactEmail: p.hrContactEmail,
      hrContactPhone: String(p.hrContactPhone).replace(/\D/g, '').slice(0, 10),
      applicationLink: p.applicationLink || undefined,
    };
  }
  return payload;
}

export default function CreateEditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(jobId);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [matchingCount, setMatchingCount] = useState(null);
  const [checkingMatch, setCheckingMatch] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getJobById(jobId);
        if (cancelled) return;
        if (res?.success && res.job) setForm(parseJobToForm(res.job));
        else toast.error(res?.error || 'Job not found');
      } catch (err) {
        if (!cancelled) toast.error(handleApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [jobId, isEdit]);

  const update = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const handleCheckMatching = async () => {
    const qs = form.targetQualifications.filter(Boolean);
    if (!qs.length) {
      toast.error('Select at least one target qualification');
      return;
    }
    setCheckingMatch(true);
    setMatchingCount(null);
    try {
      const res = await checkMatchingStudents({ targetQualifications: qs });
      if (res?.success && res.matchingCount !== undefined) {
        setMatchingCount(res.matchingCount);
        toast.success(res.message || `Will notify ${res.matchingCount} students`);
      } else {
        toast.error(res?.error || 'Could not get count');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setCheckingMatch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.jobTitle.length < JOB_TITLE_MIN || form.jobTitle.length > JOB_TITLE_MAX) {
      toast.error(`Job title must be ${JOB_TITLE_MIN}–${JOB_TITLE_MAX} characters`);
      return;
    }
    if (!form.targetQualifications.length) {
      toast.error('Select at least one target qualification');
      return;
    }
    if (form.jobDescription.length < JOB_DESCRIPTION_MIN) {
      toast.error(`Description must be at least ${JOB_DESCRIPTION_MIN} characters`);
      return;
    }
    const lastDate = form.lastApplicationDate ? new Date(form.lastApplicationDate) : null;
    if (!lastDate || lastDate <= new Date()) {
      toast.error('Last application date must be a future date');
      return;
    }
    if (form.jobCategory === 'Government') {
      const g = form.govtJobFields;
      if (!g.notifyingAuthority || !g.postCode || !g.grade || !g.officialLink) {
        toast.error('Fill required Government fields: authority, post code, grade, official link');
        return;
      }
      if (!g.examDate) {
        toast.error('Exam date is required for Government jobs');
        return;
      }
    } else {
      const p = form.privateJobFields;
      if (!p.workMode || !p.jobLocation.filter(Boolean).length || !p.hrContactEmail || !p.hrContactPhone) {
        toast.error('Fill required Private fields: work mode, at least one location, HR email & phone');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = formToPayload(form);
      if (isEdit) {
        const res = await updateJob(jobId, payload);
        if (res?.success) {
          toast.success(res.message || 'Job updated');
          navigate(`/admin/jobs/${jobId}`);
        } else {
          toast.error(res?.error || 'Update failed');
        }
      } else {
        const res = await createJob(payload);
        if (res?.success) {
          toast.success(res.message || `Job posted! Notified ${res.totalNotified ?? 0} students`);
          navigate('/admin/jobs');
        } else {
          toast.error(res?.error || 'Failed to post job');
        }
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page job-form-page">
        <div className="jobs-loading"><div className="spinner" /><p>Loading job...</p></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page job-form-page">
      <h1>{isEdit ? 'Edit job' : 'Post new job'}</h1>
      <p className="dashboard-subtitle">
        {isEdit ? 'Update job details. Notifications are not resent.' : 'Matching students will receive a dashboard notification.'}
      </p>

      <form onSubmit={handleSubmit} className="job-form-sections">
        <section className="job-form-section">
          <h2>Basic details</h2>
          <div className="job-form-row">
            <div className="job-form-group">
              <label>Job title *</label>
              <input
                value={form.jobTitle}
                onChange={(e) => update({ jobTitle: e.target.value })}
                placeholder="e.g. Software Engineer"
                minLength={JOB_TITLE_MIN}
                maxLength={JOB_TITLE_MAX}
                required
              />
            </div>
            <div className="job-form-group">
              <label>Organization *</label>
              <input
                value={form.organization}
                onChange={(e) => update({ organization: e.target.value })}
                placeholder="Company or department name"
                required
              />
            </div>
          </div>
          <div className="job-form-row">
            <div className="job-form-group">
              <label>Job category *</label>
              <select
                value={form.jobCategory}
                onChange={(e) => update({ jobCategory: e.target.value })}
                required
              >
                {JOB_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="job-form-group">
              <label>Job type</label>
              <select
                value={form.jobType}
                onChange={(e) => update({ jobType: e.target.value })}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="job-form-row single">
            <div className="job-form-group">
              <label>Target qualifications (who gets notified) *</label>
              <div className="job-form-chips">
                {TARGET_QUALIFICATIONS.map((q) => (
                  <label key={q} className="job-form-chip">
                    <input
                      type="checkbox"
                      checked={form.targetQualifications.includes(q)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...form.targetQualifications, q]
                          : form.targetQualifications.filter((x) => x !== q);
                        update({ targetQualifications: next });
                      }}
                    />
                    <span>{q}</span>
                  </label>
                ))}
              </div>
              {!isEdit && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ marginTop: '0.5rem' }}
                  onClick={handleCheckMatching}
                  disabled={checkingMatch || !form.targetQualifications.length}
                >
                  {checkingMatch ? 'Checking...' : 'Preview: how many students will be notified?'}
                </button>
              )}
              {matchingCount !== null && <p className="job-form-hint">This job will notify {matchingCount} students.</p>}
            </div>
          </div>
          <div className="job-form-row">
            <div className="job-form-group">
              <label>Total positions *</label>
              <input
                type="number"
                min={1}
                value={form.totalPositions}
                onChange={(e) => update({ totalPositions: e.target.value })}
              />
            </div>
            <div className="job-form-group">
              <label>Last application date *</label>
              <input
                type="date"
                value={form.lastApplicationDate}
                onChange={(e) => update({ lastApplicationDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="job-form-row">
            <div className="job-form-group">
              <label>Experience (years) min</label>
              <input
                type="number"
                min={0}
                value={form.experience.min}
                onChange={(e) => update({ experience: { ...form.experience, min: e.target.value } })}
              />
            </div>
            <div className="job-form-group">
              <label>Experience (years) max</label>
              <input
                type="number"
                min={0}
                value={form.experience.max}
                onChange={(e) => update({ experience: { ...form.experience, max: e.target.value } })}
              />
            </div>
          </div>
          <div className="job-form-row">
            <div className="job-form-group">
              <label>Age limit min</label>
              <input
                type="number"
                min={18}
                value={form.ageLimit.min}
                onChange={(e) => update({ ageLimit: { ...form.ageLimit, min: e.target.value } })}
              />
            </div>
            <div className="job-form-group">
              <label>Age limit max</label>
              <input
                type="number"
                value={form.ageLimit.max}
                onChange={(e) => update({ ageLimit: { ...form.ageLimit, max: e.target.value } })}
              />
            </div>
          </div>
          <div className="job-form-row single">
            <div className="job-form-group">
              <label>Category eligibility</label>
              <div className="job-form-chips">
                {CATEGORY_ELIGIBILITY.map((c) => (
                  <label key={c} className="job-form-chip">
                    <input
                      type="checkbox"
                      checked={form.categoryEligibility.includes(c)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...form.categoryEligibility, c]
                          : form.categoryEligibility.filter((x) => x !== c);
                        update({ categoryEligibility: next.length ? next : ['General'] });
                      }}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="job-form-row single">
            <div className="job-form-group">
              <label>Job description * (min {JOB_DESCRIPTION_MIN} chars)</label>
              <textarea
                value={form.jobDescription}
                onChange={(e) => update({ jobDescription: e.target.value })}
                placeholder="Describe role, responsibilities, and requirements..."
                minLength={JOB_DESCRIPTION_MIN}
                required
              />
            </div>
          </div>
          {isEdit && (
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => update({ status: e.target.value })}
                >
                  {JOB_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="job-form-group" style={{ justifyContent: 'center' }}>
                <label className="job-form-chip">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => update({ featured: e.target.checked })}
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>
          )}
        </section>

        {form.jobCategory === 'Government' && (
          <section className="job-form-section">
            <h2>Government job details</h2>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Notifying authority *</label>
                <select
                  value={form.govtJobFields.notifyingAuthority}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, notifyingAuthority: e.target.value },
                  })}
                  required
                >
                  <option value="">Select</option>
                  {NOTIFYING_AUTHORITIES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="job-form-group">
                <label>Post code *</label>
                <input
                  value={form.govtJobFields.postCode}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, postCode: e.target.value },
                  })}
                  placeholder="e.g. ENG-001"
                  required
                />
              </div>
            </div>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Grade *</label>
                <select
                  value={form.govtJobFields.grade}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, grade: e.target.value },
                  })}
                  required
                >
                  <option value="">Select</option>
                  {GOVT_GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="job-form-group">
                <label>Pay scale min (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.govtJobFields.payScale.min}
                  onChange={(e) => update({
                    govtJobFields: {
                      ...form.govtJobFields,
                      payScale: { ...form.govtJobFields.payScale, min: e.target.value },
                    },
                  })}
                />
              </div>
            </div>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Pay scale max (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.govtJobFields.payScale.max}
                  onChange={(e) => update({
                    govtJobFields: {
                      ...form.govtJobFields,
                      payScale: { ...form.govtJobFields.payScale, max: e.target.value },
                    },
                  })}
                />
              </div>
              <div className="job-form-group">
                <label>Application fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.govtJobFields.applicationFee}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, applicationFee: e.target.value },
                  })}
                />
              </div>
            </div>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Exam date *</label>
                <input
                  type="date"
                  value={form.govtJobFields.examDate ? form.govtJobFields.examDate.slice(0, 10) : ''}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, examDate: e.target.value || undefined },
                  })}
                  required
                />
              </div>
              <div className="job-form-group">
                <label>Admit card date</label>
                <input
                  type="date"
                  value={form.govtJobFields.admitCardDate ? form.govtJobFields.admitCardDate.slice(0, 10) : ''}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, admitCardDate: e.target.value || undefined },
                  })}
                />
              </div>
            </div>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Result date</label>
                <input
                  type="date"
                  value={form.govtJobFields.resultDate ? form.govtJobFields.resultDate.slice(0, 10) : ''}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, resultDate: e.target.value || undefined },
                  })}
                />
              </div>
              <div className="job-form-group" />
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Official link *</label>
                <input
                  type="url"
                  value={form.govtJobFields.officialLink}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, officialLink: e.target.value },
                  })}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Notification PDF URL</label>
                <input
                  type="url"
                  value={form.govtJobFields.notificationPDF}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, notificationPDF: e.target.value },
                  })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Exam pattern</label>
                <input
                  value={form.govtJobFields.examPattern}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, examPattern: e.target.value },
                  })}
                  placeholder="e.g. Written + Interview"
                />
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Selection process</label>
                <input
                  value={form.govtJobFields.selectionProcess}
                  onChange={(e) => update({
                    govtJobFields: { ...form.govtJobFields, selectionProcess: e.target.value },
                  })}
                  placeholder="e.g. Written → Interview → Verification"
                />
              </div>
            </div>
          </section>
        )}

        {form.jobCategory === 'Private' && (
          <section className="job-form-section">
            <h2>Private job details</h2>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Work mode *</label>
                <select
                  value={form.privateJobFields.workMode}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, workMode: e.target.value },
                  })}
                  required
                >
                  <option value="">Select</option>
                  {WORK_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="job-form-group">
                <label>Company size</label>
                <select
                  value={form.privateJobFields.companySize}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, companySize: e.target.value },
                  })}
                >
                  <option value="">Select</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Job locations * (at least one)</label>
                {(form.privateJobFields.jobLocation || ['']).map((loc, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      value={loc}
                      onChange={(e) => {
                        const arr = [...form.privateJobFields.jobLocation];
                        arr[i] = e.target.value;
                        update({ privateJobFields: { ...form.privateJobFields, jobLocation: arr } });
                      }}
                      placeholder="e.g. Bangalore"
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        const arr = form.privateJobFields.jobLocation.filter((_, j) => j !== i);
                        update({ privateJobFields: { ...form.privateJobFields, jobLocation: arr.length ? arr : [''] } });
                      }}
                      style={{ visibility: form.privateJobFields.jobLocation.length > 1 ? 'visible' : 'hidden' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => update({
                    privateJobFields: {
                      ...form.privateJobFields,
                      jobLocation: [...form.privateJobFields.jobLocation, ''],
                    },
                  })}
                >
                  Add location
                </button>
              </div>
            </div>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Salary min (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.privateJobFields.salaryRange.min}
                  onChange={(e) => update({
                    privateJobFields: {
                      ...form.privateJobFields,
                      salaryRange: { ...form.privateJobFields.salaryRange, min: e.target.value },
                    },
                  })}
                />
              </div>
              <div className="job-form-group">
                <label>Salary max (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.privateJobFields.salaryRange.max}
                  onChange={(e) => update({
                    privateJobFields: {
                      ...form.privateJobFields,
                      salaryRange: { ...form.privateJobFields.salaryRange, max: e.target.value },
                    },
                  })}
                />
              </div>
            </div>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>Pay structure</label>
                <select
                  value={form.privateJobFields.salaryRange.payStructure}
                  onChange={(e) => update({
                    privateJobFields: {
                      ...form.privateJobFields,
                      salaryRange: { ...form.privateJobFields.salaryRange, payStructure: e.target.value },
                    },
                  })}
                >
                  {PAY_STRUCTURES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="job-form-group">
                <label>Industry</label>
                <input
                  value={form.privateJobFields.industry}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, industry: e.target.value },
                  })}
                  placeholder="e.g. IT"
                />
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>HR contact email *</label>
                <input
                  type="email"
                  value={form.privateJobFields.hrContactEmail}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, hrContactEmail: e.target.value },
                  })}
                  required
                />
              </div>
            </div>
            <div className="job-form-row">
              <div className="job-form-group">
                <label>HR contact phone * (10 digits)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={form.privateJobFields.hrContactPhone}
                  onChange={(e) => update({
                    privateJobFields: {
                      ...form.privateJobFields,
                      hrContactPhone: e.target.value.replace(/\D/g, '').slice(0, 10),
                    },
                  })}
                  placeholder="9876543210"
                  required
                />
              </div>
              <div className="job-form-group">
                <label>HR contact person</label>
                <input
                  value={form.privateJobFields.hrContactPerson}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, hrContactPerson: e.target.value },
                  })}
                />
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Company website</label>
                <input
                  type="url"
                  value={form.privateJobFields.companyWebsite}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, companyWebsite: e.target.value },
                  })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Application link</label>
                <input
                  type="url"
                  value={form.privateJobFields.applicationLink}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, applicationLink: e.target.value },
                  })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="job-form-row single">
              <div className="job-form-group">
                <label>Company description</label>
                <textarea
                  value={form.privateJobFields.companyDescription}
                  onChange={(e) => update({
                    privateJobFields: { ...form.privateJobFields, companyDescription: e.target.value },
                  })}
                  placeholder="Brief about the company"
                  rows={3}
                />
              </div>
            </div>
          </section>
        )}

        <div className="job-form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update job' : 'Post job & notify students'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(isEdit ? `/admin/jobs/${jobId}` : '/admin/jobs')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
