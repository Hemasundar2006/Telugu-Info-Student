import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../utils/errorHandler';
import { getMyCompanyProfile } from '../../api/companies';

const schema = yup.object({
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
    .required('Company email is required'),
  password: yup
    .string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
});

export default function CompanyRegister() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      companyName: '',
      phone: '',
      state: 'AP',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // 1) Create recruiter auth account with role COMPANY
      const authPayload = {
        name: data.name,
        companyName: data.companyName,
        phone: data.phone.replace(/\D/g, '').slice(0, 10),
        state: data.state,
        role: 'COMPANY',
        email: data.email,
        password: data.password,
      };

      const authRes = await registerApi(authPayload);

      if (!authRes.success || !authRes.token) {
        toast.error(authRes.error || 'Recruiter registration failed');
        return;
      }

      // Log them in so we have the COMPANY token
      setAuth(authRes.token, authRes.user || authRes);

      toast.success('Company recruiter account created');
      // Trigger company auto-creation (if backend does lazy create on /companies/me)
      try {
        await getMyCompanyProfile();
      } catch (companyErr) {
        // eslint-disable-next-line no-console
        console.warn('Company auto-creation note:', handleApiError(companyErr));
      }
      // After creating the company account, take them to company profile
      navigate('/company/profile', { replace: true });
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-slate-200/70 dark:border-slate-700/70 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/70 dark:border-slate-700/70 bg-slate-50/80 dark:bg-slate-900/80">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-1">
            Company sign up
          </p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Join Telugu Info Hiring Network
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create a recruiter account. Fill company profile after signup.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Recruiter / HR name *
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-error">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Company name *
              </label>
              <input
                type="text"
                {...register('companyName')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="SoftTech Pvt Ltd"
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-error">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Company email *
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="hr@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-error">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Mobile number *
              </label>
              <input
                type="text"
                {...register('phone')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="9876543210"
                inputMode="numeric"
                maxLength={10}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-error">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                State *
              </label>
              <select
                {...register('state')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
              >
                <option value="AP">Andhra Pradesh</option>
                <option value="TS">Telangana</option>
              </select>
              {errors.state && (
                <p className="mt-1 text-xs text-error">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Password *
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="Min 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-error">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2 text-xs font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Creating...' : 'Create company account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

