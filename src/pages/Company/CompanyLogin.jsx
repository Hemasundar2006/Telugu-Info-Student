import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';
import { handleApiError } from '../../utils/errorHandler';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Company email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function CompanyLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      if (res.success && res.token) {
        const user = res.user || res;
        
        // Check if logged-in user has COMPANY role
        if (user.role !== 'COMPANY') {
          toast.error('This login is for recruiter/company accounts only. Please use the student login.');
          return;
        }
        
        setAuth(res.token, user);
        toast.success('Logged in successfully');
        navigate(from, { replace: true });
      } else {
        toast.error(res.error || 'Login failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  return (
    <div className="min-h-[70vh] grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center bg-white/95 dark:bg-slate-900/95 px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-1">
              Company / Recruiter login
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Sign in to your recruiter account
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Access your company dashboard, manage jobs, and hire students.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Company email *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="hr@company.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
              {formState.errors.email && (
                <p className="mt-1 text-xs text-error">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-10 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {formState.errors.password && (
                <p className="mt-1 text-xs text-error">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Use the company email and password you registered with.
              </span>
              <Link
                to="/forgot-password"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Signing in...' : 'Login as recruiter'}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-500 dark:text-slate-400">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Don&apos;t have a recruiter account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary-dark">
                Create company account
              </Link>
            </p>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Are you a student?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Student login
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
            Recruiter portal — post jobs, manage applications, and hire Telugu Info students.
          </p>
        </div>
      </div>
    </div>
  );
}
