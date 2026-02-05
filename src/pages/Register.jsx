import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api/auth';
import { handleApiError } from '../utils/errorHandler';
import { STATES } from '../utils/constants';
import './Login.css';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  state: yup.string().oneOf(['AP', 'TS']).required('State is required'),
  email: yup.string().email('Invalid email').optional(),
  password: yup.string().min(6, 'Min 6 characters').optional(),
});

export default function Register() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', phone: '', state: 'AP', email: '', password: '' },
  });

  const onSubmit = async (data) => {
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
        toast.success('Account created');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.error || 'Registration failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  return (
    <div className="login-split">
      <div className="login-form-panel">
        <div className="login-form-inner">
          <h1 className="login-welcome">Create Account</h1>
          <p className="login-subtitle">Join Telugu Info Career Success Platform</p>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="input-wrap">
              <input
                {...register('name')}
                placeholder="Full name *"
                className="input-with-icon input-full"
              />
            </div>
            {formState.errors.name && (
              <span className="field-error">{formState.errors.name.message}</span>
            )}

            <div className="input-wrap">
              <input
                {...register('phone')}
                placeholder="Phone *"
                className="input-with-icon input-full"
              />
            </div>
            {formState.errors.phone && (
              <span className="field-error">{formState.errors.phone.message}</span>
            )}

            <div className="input-wrap">
              <select {...register('state')} className="input-with-icon input-full select-dark">
                <option value="AP">Andhra Pradesh</option>
                <option value="TS">Telangana</option>
              </select>
            </div>

            <div className="input-wrap">
              <input
                type="email"
                {...register('email')}
                placeholder="Email (optional)"
                className="input-with-icon input-full"
              />
            </div>
            {formState.errors.email && (
              <span className="field-error">{formState.errors.email.message}</span>
            )}

            <div className="input-wrap">
              <input
                type="password"
                {...register('password')}
                placeholder="Password (optional, min 6)"
                className="input-with-icon input-full"
              />
            </div>
            {formState.errors.password && (
              <span className="field-error">{formState.errors.password.message}</span>
            )}

            <button
              type="submit"
              className="login-btn-primary"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="login-footer-text">
            Already have an account? <Link to="/login" className="login-footer-link">Login</Link>
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
