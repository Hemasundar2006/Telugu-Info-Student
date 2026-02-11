import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../utils/errorHandler';

const schema = yup.object({
  name: yup.string().required('Recruiter name is required'),
  phone: yup.string().required('Phone is required'),
  state: yup.string().oneOf(['AP', 'TS']).required('State is required'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Company email is required'),
  password: yup
    .string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
  companyName: yup.string().required('Company name is required'),
  industry: yup.string().required('Industry is required'),
  location: yup.string().required('Location is required'),
  website: yup.string().url('Invalid URL').optional(),
  employeeCount: yup
    .number()
    .typeError('Must be a number')
    .positive('Must be positive')
    .integer('Must be an integer')
    .optional(),
  description: yup.string().required('Short description is required'),
});

const steps = ['Recruiter account', 'Company details', 'Confirm'];

export default function CompanyRegister() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      state: 'AP',
      email: '',
      password: '',
      companyName: '',
      industry: '',
      location: '',
      website: '',
      employeeCount: '',
      description: '',
    },
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 0) {
      fieldsToValidate = ['name', 'phone', 'state', 'email', 'password'];
    } else if (step === 1) {
      fieldsToValidate = [
        'companyName',
        'industry',
        'location',
        'website',
        'employeeCount',
        'description',
      ];
    }
    const valid = await trigger(fieldsToValidate);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (data) => {
    try {
      // 1) Create recruiter auth account with role COMPANY
      const authPayload = {
        name: data.name,
        phone: data.phone,
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
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const values = getValues();

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
            Post jobs, track applications, and hire verified students.
          </p>

          <div className="mt-4 flex items-center gap-2">
            {steps.map((label, index) => (
              <div key={label} className="flex-1 flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    index <= step
                      ? 'bg-primary text-white'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Recruiter name *
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
                  Phone *
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="9876543210"
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
              <div className="md:col-span-2">
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
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Company name *
                </label>
                <input
                  type="text"
                  {...register('companyName')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="Acme Pvt Ltd"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-error">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Industry *
                </label>
                <input
                  type="text"
                  {...register('industry')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="IT Services, EdTech, etc."
                />
                {errors.industry && (
                  <p className="mt-1 text-xs text-error">
                    {errors.industry.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="Hyderabad, TS"
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-error">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  {...register('website')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="https://company.com"
                />
                {errors.website && (
                  <p className="mt-1 text-xs text-error">
                    {errors.website.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Employee count
                </label>
                <input
                  type="number"
                  {...register('employeeCount')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="120"
                />
                {errors.employeeCount && (
                  <p className="mt-1 text-xs text-error">
                    {errors.employeeCount.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Company description *
                </label>
                <textarea
                  rows={4}
                  {...register('description')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="Tell students about your company and the kind of roles you hire for."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-error">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Review your recruiter account and company details before submitting. Our team will
                verify your information and activate your hiring dashboard.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <h2 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Recruiter
                  </h2>
                  <p className="font-medium">{values.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {values.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {values.phone} • {values.state}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <h2 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Company
                  </h2>
                  <p className="font-medium">{values.companyName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {values.industry}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {values.location}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <h2 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Company contact
                  </h2>
                  <p className="text-xs">
                    Website:{' '}
                    {values.website || <span className="text-slate-400">Not provided</span>}
                  </p>
                  <p className="mt-1 text-xs">
                    Employees:{' '}
                    {values.employeeCount || (
                      <span className="text-slate-400">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <h2 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Description
                </h2>
                <p className="text-xs whitespace-pre-line">
                  {values.description || (
                    <span className="text-slate-400">No description entered yet.</span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={step === 0 ? () => navigate('/register') : prevStep}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {step === 0 ? 'Back to student sign up' : 'Back'}
            </button>

            <div className="flex items-center gap-2">
              {step < steps.length - 1 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 text-xs font-semibold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              )}
              {step === steps.length - 1 && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2 text-xs font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for verification'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

