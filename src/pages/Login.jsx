import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import { handleApiError } from '../utils/errorHandler';
import './Login.css';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('student'); // 'student' (USER) | 'company' (COMPANY)
  const from = location.state?.from?.pathname || '/dashboard';

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  // If user hits /company/login, default to recruiter/company mode for clarity
  useEffect(() => {
    if (location.pathname === '/company/login') {
      setMode('company');
    }
  }, [location.pathname]);

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      if (res.success && res.token) {
        const user = res.user || res;
        const userRole = user.role || user.role;
        
        // Validate role matches login mode
        if (mode === 'company' && userRole !== 'COMPANY') {
          toast.error('This email is not registered as a company account. Please use student login or create a company account.');
          return;
        }
        
        if (mode === 'student' && userRole === 'COMPANY') {
          toast.error('This is a company account. Please use company login.');
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
  
  const isStudent = mode === 'student';

  return (
    <div className="login-page">
      <div className="login-form-panel">
        <div className="login-form-inner">
          <p className="login-badge">
            {isStudent ? 'Student login (role: USER)' : 'Recruiter / company login (role: COMPANY)'}
          </p>
          <h1 className="login-title">
            {isStudent ? 'Sign in to Telugu Info' : 'Sign in to recruiter portal'}
          </h1>
          <p className="login-subtitle">
            {isStudent
              ? 'Sign in as a student (USER) to access your dashboard and career tools.'
              : 'Sign in as a recruiter (COMPANY) to access your company dashboard and hiring tools.'}
          </p>

          <div className="login-toggle-wrap">
            <button
              type="button"
              onClick={() => setMode('student')}
              className={`login-toggle-btn ${isStudent ? 'active' : ''}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setMode('company')}
              className={`login-toggle-btn ${!isStudent ? 'active' : ''}`}
            >
              Recruiter / Company
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="login-field">
              <label>{isStudent ? 'Student email *' : 'Company email *'}</label>
              <div className="login-input-wrap">
                <FiMail className="input-icon" size={18} aria-hidden />
                <input
                  type="email"
                  {...register('email')}
                  placeholder={isStudent ? 'you@example.com' : 'hr@company.com'}
                  autoComplete="email"
                />
              </div>
              {formState.errors.email && (
                <p className="error">{formState.errors.email.message}</p>
              )}
            </div>

            <div className="login-field">
              <label>{isStudent ? 'Password' : 'Password *'}</label>
              <div className="login-input-wrap">
                <FiLock className="input-icon" size={18} aria-hidden />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="with-icon-right"
                />
                <button
                  type="button"
                  className="input-icon input-icon-right"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {formState.errors.password && (
                <p className="error">{formState.errors.password.message}</p>
              )}
            </div>

            <div className="login-actions">
              <span className="hint">
                {isStudent
                  ? 'Use the student (USER) email and password you registered with.'
                  : 'Use the recruiter/company (COMPANY) email and password you registered with.'}
              </span>
              <Link to="/forgot-password" className="login-forgot">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting
                ? 'Signing in...'
                : isStudent
                ? 'Login'
                : 'Login as recruiter'}
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <div className="login-footer">
            <p>
              Don&apos;t have an account?{' '}
              <Link to={isStudent ? '/register' : '/company/register'}>
                {isStudent ? 'Create student account' : 'Create company account'}
              </Link>
            </p>
            {isStudent ? (
              <p>
                Are you a recruiter?{' '}
                <Link to="/company/login">Recruiter / company login</Link>
              </p>
            ) : (
              <p>
                Are you a student?{' '}
                <Link to="/login">Student login</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="login-brand-panel">
        <div className="login-brand-inner">
          <img src="/Teluguinfo logo.png" alt="Telugu Info" />
          <h2 className="login-brand-title">తెలుగు InfQ</h2>
          <p className="login-brand-desc">
            One login for documents, tickets, AI career guidance, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
