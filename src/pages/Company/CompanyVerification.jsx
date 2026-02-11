import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { searchCompanies, verifyCompany } from '../../api/companies';
import { handleApiError } from '../../utils/errorHandler';

export default function CompanyVerification() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await searchCompanies({ verificationStatus: 'PENDING', limit: 50, page: 1 });
      const list = res?.data || res?.results || [];
      setCompanies(list);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleVerify = async (companyId, action) => {
    setVerifyingId(companyId);
    try {
      const payload = {
        verificationStatus: action === 'approve' ? 'VERIFIED' : 'REJECTED',
        reason:
          action === 'approve' ? 'Approved by Super Admin' : 'Rejected by Super Admin',
      };
      await verifyCompany(companyId, payload);
      toast.success(
        action === 'approve' ? 'Company verified successfully' : 'Company rejected'
      );
      await loadCompanies();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-1">
            Company verification
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Review recruiter companies
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Approve or reject recruiter/company accounts before they can fully use hiring tools.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Pending companies
          </p>
          <button
            type="button"
            onClick={loadCompanies}
            className="text-xs px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
            Loading pending companies...
          </div>
        ) : companies.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
            No companies awaiting verification right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                    Company
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                    Contact
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                    Created
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-700 dark:text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr
                    key={c.companyId || c._id}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-4 py-2 align-top">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {c.companyName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Status: {c.verificationStatus}
                      </div>
                    </td>
                    <td className="px-4 py-2 align-top text-xs text-slate-600 dark:text-slate-300">
                      <div className="mb-1">
                        <span className="font-medium">Email:</span> {c.email || c.contactEmail || '—'}
                      </div>
                      <div>
                        <span className="font-medium">Mobile:</span>{' '}
                        {c.phoneNumber || c.phone || c.hrContactNumber || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-2 align-top text-xs text-slate-600 dark:text-slate-300">
                      {c.location || '—'}
                    </td>
                    <td className="px-4 py-2 align-top text-xs text-slate-600 dark:text-slate-300">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-2 align-top text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          disabled={verifyingId === (c.companyId || c._id)}
                          onClick={() =>
                            handleVerify(c.companyId || c._id, 'approve')
                          }
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={verifyingId === (c.companyId || c._id)}
                          onClick={() =>
                            handleVerify(c.companyId || c._id, 'reject')
                          }
                          className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

