import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const { login: setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      if (res.success && res.token) {
        setAuth(res.token, res.user || res);
        toast.success('Logged in successfully');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.error || 'Login failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  return (
    <div className="login-split">
      <div className="login-form-panel">
        <div className="login-form-inner">
          <h1 className="login-welcome">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to Telugu Info</p>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="input-wrap">
              <FiMail className="input-icon left" size={20} />
              <input
                type="email"
                {...register('email')}
                placeholder="Email"
                autoComplete="email"
                className="input-with-icon"
              />
            </div>
            {formState.errors.email && (
              <span className="field-error">{formState.errors.email.message}</span>
            )}

            <div className="input-wrap">
              <FiLock className="input-icon left" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Password"
                autoComplete="current-password"
                className="input-with-icon"
              />
              <button
                type="button"
                className="input-icon right"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {formState.errors.password && (
              <span className="field-error">{formState.errors.password.message}</span>
            )}

            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>

            <button
              type="submit"
              className="login-btn-primary"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="login-footer-text">
            Don&apos;t have an account? <Link to="/register" className="login-footer-link">Create Account</Link>
          </p>
        </div>
      </div>

      <div className="login-brand-panel">
        <div className="brand-content">
          <img src="/Teluguinfo logo.png" alt="తెలుగు InfQ" className="brand-logo-img" />
          <h2 className="brand-title">తెలుగు InfQ</h2>
          <p className="brand-tagline">Career Success Platform</p>
        </div>
      </div>
    </div>
  );
}
