import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="min-h-[70vh] grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center bg-white/95 dark:bg-slate-900/95 px-4 py-10">
        <div className="w-full max-w-md space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-1">
              Forgot password
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Reset instructions
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              If you&apos;ve lost access, please contact support from your registered email or
              phone to reset your password.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>
              For now, password resets are handled manually to keep your account secure. We&apos;ll
              add self‑service reset soon.
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark transition"
          >
            Back to login
          </Link>
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
            Career Success Platform for Telugu students — secure access to your documents and tools.
          </p>
        </div>
      </div>
    </div>
  );
}
