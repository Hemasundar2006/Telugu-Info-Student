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

const studentSchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  state: yup.string().oneOf(['AP', 'TS']).required('State is required'),
  email: yup.string().email('Invalid email').optional(),
  password: yup.string().min(6, 'Min 6 characters').optional(),
});

const recruiterSchema = yup.object({
  name: yup.string().required('Recruiter name is required'),
  companyName: yup.string().required('Company name is required'),
  phone: yup.string().required('Mobile number is required'),
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
    defaultValues: { name: '', phone: '', state: 'AP', email: '', password: '' },
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
        phone: data.phone,
        state: data.state,
        role: 'USER',
      };
      if (data.email) payload.email = data.email;
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
        phone: data.phone,
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
        
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.error || 'Registration failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const isStudent = mode === 'student';

  return (
    <div className="min-h-[70vh] grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center bg-white/95 dark:bg-slate-900/95 px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-1">
                {isStudent ? 'Student sign up' : 'Recruiter / company sign up'}
              </p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {isStudent ? 'Create your student account' : 'Create your recruiter account'}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {isStudent
                  ? 'Access career tools, documents, and AI-powered guidance.'
                  : 'Post jobs, manage applications, and hire Telugu Info students.'}
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('student')}
              className={`px-3 py-1 rounded-full transition ${
                isStudent
                  ? 'bg-primary text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setMode('company')}
              className={`px-3 py-1 rounded-full transition ${
                !isStudent
                  ? 'bg-primary text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Recruiter / Company
            </button>
          </div>

          {isStudent ? (
            <form onSubmit={handleSubmitStudent(onSubmitStudent)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Full name *
                </label>
                <input
                  {...registerStudent('name')}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                {studentFormState.errors.name && (
                  <p className="mt-1 text-xs text-error">
                    {studentFormState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Phone *
                  </label>
                  <input
                    {...registerStudent('phone')}
                    placeholder="10-digit mobile"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  />
                  {studentFormState.errors.phone && (
                    <p className="mt-1 text-xs text-error">
                      {studentFormState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    State *
                  </label>
                  <select
                    {...registerStudent('state')}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  >
                    <option value="AP">Andhra Pradesh</option>
                    <option value="TS">Telangana</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  {...registerStudent('email')}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                {studentFormState.errors.email && (
                  <p className="mt-1 text-xs text-error">
                    {studentFormState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Password (optional)
                </label>
                <input
                  type="password"
                  {...registerStudent('password')}
                  placeholder="Min 6 characters"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                {studentFormState.errors.password && (
                  <p className="mt-1 text-xs text-error">
                    {studentFormState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
                disabled={studentFormState.isSubmitting}
              >
                {studentFormState.isSubmitting ? 'Creating account...' : 'Create student account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitRecruiter(onSubmitRecruiter)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Recruiter name *
                </label>
                <input
                  {...registerRecruiter('name')}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                {recruiterFormState.errors.name && (
                  <p className="mt-1 text-xs text-error">
                    {recruiterFormState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Company name *
                </label>
                <input
                  {...registerRecruiter('companyName')}
                  placeholder="Awesome Company Pvt Ltd"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                {recruiterFormState.errors.companyName && (
                  <p className="mt-1 text-xs text-error">
                    {recruiterFormState.errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Mobile number *
                  </label>
                  <input
                    {...registerRecruiter('phone')}
                    placeholder="Company mobile"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  />
                  {recruiterFormState.errors.phone && (
                    <p className="mt-1 text-xs text-error">
                      {recruiterFormState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    State *
                  </label>
                  <select
                    {...registerRecruiter('state')}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  >
                    <option value="AP">Andhra Pradesh</option>
                    <option value="TS">Telangana</option>
                  </select>
                  {recruiterFormState.errors.state && (
                    <p className="mt-1 text-xs text-error">
                      {recruiterFormState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Company mail *
                </label>
                <input
                  type="email"
                  {...registerRecruiter('email')}
                  placeholder="hr@company.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                {recruiterFormState.errors.email && (
                  <p className="mt-1 text-xs text-error">
                    {recruiterFormState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  {...registerRecruiter('password')}
                  placeholder="Min 6 characters"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                {recruiterFormState.errors.password && (
                  <p className="mt-1 text-xs text-error">
                    {recruiterFormState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
                disabled={recruiterFormState.isSubmitting}
              >
                {recruiterFormState.isSubmitting
                  ? 'Creating recruiter account...'
                  : 'Create recruiter account'}
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                We will create a recruiter user with role <span className="font-semibold">COMPANY</span>{' '}
                and a linked company record in pending verification state.
              </p>
            </form>
          )}

          <div className="space-y-4">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
        <div className="text-center text-slate-50 space-y-3">
          <img
            src="/Teluguinfo logo.png"
            alt="తెలుగు InfQ"
            className="mx-auto mb-3 h-24 w-auto object-contain drop-shadow-lg"
          />
          <h2 className="text-2xl font-bold tracking-tight">తెలుగు InfQ</h2>
          <p className="text-sm text-slate-200">
            Career Success Platform for students and recruiters — documents, jobs, and AI support in
            one place.
          </p>
        </div>
      </div>
    </div>
  );
}
