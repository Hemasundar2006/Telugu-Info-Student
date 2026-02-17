import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api/auth';
import { getMyCompanyProfile } from '../api/companies';
import { handleApiError } from '../utils/errorHandler';
import { TARGET_QUALIFICATIONS } from '../utils/jobPostingConstants';
import './Register.css';

const studentSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required for student account'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  state: yup.string().oneOf(['AP', 'TS']).required('State is required'),
  qualification: yup
    .string()
    .oneOf(TARGET_QUALIFICATIONS, 'Select a valid qualification')
    .required('Qualification is required'),
  password: yup.string().min(6, 'Min 6 characters').optional(),
});

const recruiterSchema = yup.object({
  name: yup.string().required('Recruiter name is required'),
  companyName: yup.string().required('Company name is required'),
  phone: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  state: yup.string().oneOf(['AP', 'TS']).required('State is required'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Company mail is required'),
  password: yup
    .string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
});

export default function Register() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [mode, setMode] = useState('student'); // 'student' | 'company'

  const {
    register: registerStudent,
    handleSubmit: handleSubmitStudent,
    formState: studentFormState,
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: { name: '', phone: '', state: 'AP', email: '', qualification: '', password: '' },
  });

  const {
    register: registerRecruiter,
    handleSubmit: handleSubmitRecruiter,
    formState: recruiterFormState,
  } = useForm({
    resolver: yupResolver(recruiterSchema),
    defaultValues: {
      name: '',
      companyName: '',
      phone: '',
      state: 'AP',
      email: '',
      password: '',
    },
  });

  const onSubmitStudent = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone.replace(/\D/g, '').slice(0, 10),
        state: data.state,
        qualification: data.qualification,
        role: 'USER',
      };
      if (data.password) payload.password = data.password;

      const res = await registerApi(payload);
      if (res.success && res.token) {
        setAuth(res.token, res.user || res);
        toast.success('Student account created');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.error || 'Registration failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const onSubmitRecruiter = async (data) => {
    try {
      const payload = {
        name: data.name,
        companyName: data.companyName,
        phone: data.phone.replace(/\D/g, '').slice(0, 10),
        state: data.state || 'AP',
        role: 'COMPANY',
        email: data.email,
        password: data.password,
      };

      const res = await registerApi(payload);
      if (res.success && res.token) {
        setAuth(res.token, res.user || res);
        
        // Trigger company auto-creation by calling GET /api/companies/me
        // Backend will auto-create company with companyName from registration
        try {
          await getMyCompanyProfile();
          toast.success('Recruiter account created. Company profile initialized.');
        } catch (companyErr) {
          // Company creation might fail silently, but user is still logged in
          console.warn('Company auto-creation note:', handleApiError(companyErr));
          toast.success('Recruiter account created');
        }
        
        // After creating the company account via shared register,
        // send recruiter directly to the company profile page.
        navigate('/company/profile', { replace: true });
      } else {
        toast.error(res.error || 'Registration failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const isStudent = mode === 'student';

  return (
    <div className="register-page">
      <div className="register-form-panel">
        <div className="register-form-inner">
          <p className="register-badge">
            {isStudent ? 'Student sign up' : 'Recruiter / company sign up'}
          </p>
          <h1 className="register-title">
            {isStudent ? 'Create your student account' : 'Create your recruiter account'}
          </h1>
          <p className="register-subtitle">
            {isStudent
              ? 'Access career tools, documents, and AI-powered guidance.'
              : 'Post jobs, manage applications, and hire Telugu Info students.'}
          </p>

          <div className="register-toggle-wrap">
            <button
              type="button"
              onClick={() => setMode('student')}
              className={`register-toggle-btn ${isStudent ? 'active' : ''}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setMode('company')}
              className={`register-toggle-btn ${!isStudent ? 'active' : ''}`}
            >
              Recruiter / Company
            </button>
          </div>

          {isStudent ? (
            <form onSubmit={handleSubmitStudent(onSubmitStudent)} className="register-form">
              <div className="register-field">
                <label>Full name *</label>
                <input {...registerStudent('name')} placeholder="Your name" />
                {studentFormState.errors.name && (
                  <p className="error">{studentFormState.errors.name.message}</p>
                )}
              </div>
              <div className="register-row">
                <div className="register-field">
                  <label>Phone *</label>
                  <input
                    {...registerStudent('phone')}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    inputMode="numeric"
                  />
                  {studentFormState.errors.phone && (
                    <p className="error">{studentFormState.errors.phone.message}</p>
                  )}
                </div>
                <div className="register-field">
                  <label>State *</label>
                  <select {...registerStudent('state')}>
                    <option value="AP">Andhra Pradesh</option>
                    <option value="TS">Telangana</option>
                  </select>
                </div>
              </div>
              <div className="register-field">
                <label>Email *</label>
                <input
                  type="email"
                  {...registerStudent('email')}
                  placeholder="you@example.com"
                />
                {studentFormState.errors.email && (
                  <p className="error">{studentFormState.errors.email.message}</p>
                )}
              </div>
              <div className="register-field">
                <label>Qualification *</label>
                <select {...registerStudent('qualification')}>
                  <option value="">Select qualification</option>
                  {TARGET_QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                {studentFormState.errors.qualification && (
                  <p className="error">{studentFormState.errors.qualification.message}</p>
                )}
              </div>
              <div className="register-field">
                <label>Password (optional)</label>
                <input
                  type="password"
                  {...registerStudent('password')}
                  placeholder="Min 6 characters"
                />
                {studentFormState.errors.password && (
                  <p className="error">{studentFormState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="register-submit"
                disabled={studentFormState.isSubmitting}
              >
                {studentFormState.isSubmitting ? 'Creating account...' : 'Create student account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitRecruiter(onSubmitRecruiter)} className="register-form">
              <div className="register-field">
                <label>Recruiter name *</label>
                <input {...registerRecruiter('name')} placeholder="Your name" />
                {recruiterFormState.errors.name && (
                  <p className="error">{recruiterFormState.errors.name.message}</p>
                )}
              </div>
              <div className="register-field">
                <label>Company name *</label>
                <input
                  {...registerRecruiter('companyName')}
                  placeholder="Awesome Company Pvt Ltd"
                />
                {recruiterFormState.errors.companyName && (
                  <p className="error">{recruiterFormState.errors.companyName.message}</p>
                )}
              </div>
              <div className="register-row">
                <div className="register-field">
                  <label>Mobile number *</label>
                  <input
                    {...registerRecruiter('phone')}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    inputMode="numeric"
                  />
                  {recruiterFormState.errors.phone && (
                    <p className="error">{recruiterFormState.errors.phone.message}</p>
                  )}
                </div>
                <div className="register-field">
                  <label>State *</label>
                  <select {...registerRecruiter('state')}>
                    <option value="AP">Andhra Pradesh</option>
                    <option value="TS">Telangana</option>
                  </select>
                  {recruiterFormState.errors.state && (
                    <p className="error">{recruiterFormState.errors.state.message}</p>
                  )}
                </div>
              </div>
              <div className="register-field">
                <label>Company mail *</label>
                <input
                  type="email"
                  {...registerRecruiter('email')}
                  placeholder="hr@company.com"
                />
                {recruiterFormState.errors.email && (
                  <p className="error">{recruiterFormState.errors.email.message}</p>
                )}
              </div>
              <div className="register-field">
                <label>Password *</label>
                <input
                  type="password"
                  {...registerRecruiter('password')}
                  placeholder="Min 6 characters"
                />
                {recruiterFormState.errors.password && (
                  <p className="error">{recruiterFormState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="register-submit"
                disabled={recruiterFormState.isSubmitting}
              >
                {recruiterFormState.isSubmitting
                  ? 'Creating recruiter account...'
                  : 'Create recruiter account'}
              </button>
              <p className="register-note">
                We will create a recruiter user with role <strong>COMPANY</strong> and a linked
                company record in pending verification state.
              </p>
            </form>
          )}

          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="register-brand-panel">
        <div className="register-brand-inner">
          <img src="/Teluguinfo logo.png" alt="Telugu Info" />
          <h2 className="register-brand-title">తెలుగు InfQ</h2>
          <p className="register-brand-desc">
            Career Success Platform for students and recruiters — documents, jobs, and AI support
            in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
