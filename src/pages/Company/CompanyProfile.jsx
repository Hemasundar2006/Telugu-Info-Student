import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  getMyCompanyProfile,
  updateMyCompanyProfile,
} from '../../api/companies';
import { handleApiError } from '../../utils/errorHandler';

const schema = yup.object({
  companyName: yup.string().nullable(),
  registrationNumber: yup.string().nullable(),
  yearFounded: yup
    .number()
    .typeError('Must be a number')
    .integer('Must be an integer')
    .nullable()
    .optional(),
  companyType: yup.string().nullable(),
  industry: yup.string().nullable(),
  companySize: yup.string().nullable(),
  website: yup.string().url('Invalid URL').nullable().optional(),
  linkedInProfile: yup.string().url('Invalid URL').nullable().optional(),
  headquarters: yup.string().nullable(),
  officeLocations: yup.string().nullable(),
  contactEmail: yup.string().email('Invalid email').nullable().optional(),
  hrContactNumber: yup.string().nullable(),
  logo: yup.string().url('Invalid URL').nullable().optional(),
  banner: yup.string().url('Invalid URL').nullable().optional(),
  gallery: yup.string().nullable(),
  videoUrl: yup.string().url('Invalid URL').nullable().optional(),
  about: yup.string().nullable(),
  tagline: yup.string().nullable(),
  coreValues: yup.string().nullable(),
  products: yup.string().nullable(),
  achievements: yup.string().nullable(),
  recruiterName: yup.string().nullable(),
  recruiterDesignation: yup.string().nullable(),
  recruiterEmail: yup.string().email('Invalid email').nullable().optional(),
  recruiterPhone: yup.string().nullable(),
  recruiterLinkedIn: yup.string().url('Invalid URL').nullable().optional(),
  recruiterPhoto: yup.string().url('Invalid URL').nullable().optional(),
  benefits: yup.string().nullable(),
  customBenefits: yup.string().nullable(),
  cultureTags: yup.string().nullable(),
  diversityStatement: yup.string().nullable(),
  workEnvironment: yup.string().nullable(),
  dressCode: yup.string().nullable(),
  salaryMin: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .optional(),
  salaryMax: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .optional(),
  hiringTimeline: yup.string().nullable(),
  preferredQualifications: yup.string().nullable(),
  hiringIndustries: yup.string().nullable(),
  commonRoles: yup.string().nullable(),
  fresherFriendly: yup.boolean().nullable().optional(),
  internshipAvailable: yup.boolean().nullable().optional(),
  gstNumber: yup.string().nullable(),
  panNumber: yup.string().nullable(),
  businessLicense: yup.string().nullable(),
});

export default function CompanyProfile() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: '',
      registrationNumber: '',
      yearFounded: '',
      companyType: '',
      industry: '',
      companySize: '',
      website: '',
      linkedInProfile: '',
      headquarters: '',
      officeLocations: '',
      contactEmail: '',
      hrContactNumber: '',
      logo: '',
      banner: '',
      gallery: '',
      videoUrl: '',
      about: '',
      tagline: '',
      coreValues: '',
      products: '',
      achievements: '',
      recruiterName: '',
      recruiterDesignation: '',
      recruiterEmail: '',
      recruiterPhone: '',
      recruiterLinkedIn: '',
      recruiterPhoto: '',
      benefits: '',
      customBenefits: '',
      cultureTags: '',
      diversityStatement: '',
      workEnvironment: '',
      dressCode: '',
      salaryMin: '',
      salaryMax: '',
      hiringTimeline: '',
      preferredQualifications: '',
      hiringIndustries: '',
      commonRoles: '',
      fresherFriendly: false,
      internshipAvailable: false,
      gstNumber: '',
      panNumber: '',
      businessLicense: '',
    },
  });

  useEffect(() => {
    const loadCompany = async () => {
      if (!user || user.role !== 'COMPANY') {
        setLoading(false);
        return;
      }

      try {
        const res = await getMyCompanyProfile();
        if (!res?.success || !res.data) {
          toast.error(res?.error || 'Failed to load company profile');
          setLoading(false);
          return;
        }
        const c = res.data;
        setCompany(c);

        reset({
          companyName: c.companyName || '',
          registrationNumber: c.registrationNumber || '',
          yearFounded: c.yearFounded ?? '',
          companyType: c.companyType || '',
          industry: c.industry || '',
          companySize: c.companySize || '',
          website: c.website || '',
          linkedInProfile: c.linkedInProfile || '',
          headquarters: c.headquarters || '',
          officeLocations: (c.officeLocations || []).join(', '),
          contactEmail: c.contactEmail || c.email || '',
          hrContactNumber: c.hrContactNumber || c.phoneNumber || '',
          logo: c.logo || '',
          banner: c.banner || '',
          gallery: (c.gallery || []).join(', '),
          videoUrl: c.videoUrl || '',
          about: c.about || '',
          tagline: c.tagline || '',
          coreValues: (c.coreValues || []).join(', '),
          products: c.products || '',
          achievements: c.achievements || '',
          recruiterName: c.recruiter?.name || '',
          recruiterDesignation: c.recruiter?.designation || '',
          recruiterEmail: c.recruiter?.email || '',
          recruiterPhone: c.recruiter?.phone || '',
          recruiterLinkedIn: c.recruiter?.linkedIn || '',
          recruiterPhoto: c.recruiter?.photo || '',
          benefits: (c.benefits || []).join(', '),
          customBenefits: c.customBenefits || '',
          cultureTags: (c.cultureTags || []).join(', '),
          diversityStatement: c.diversityStatement || '',
          workEnvironment: c.workEnvironment || '',
          dressCode: c.dressCode || '',
          salaryMin: c.salaryRange?.min ?? '',
          salaryMax: c.salaryRange?.max ?? '',
          hiringTimeline: c.hiringTimeline || '',
          preferredQualifications: (c.preferredQualifications || []).join(', '),
          hiringIndustries: (c.hiringIndustries || []).join(', '),
          commonRoles: (c.commonRoles || []).join(', '),
          fresherFriendly: !!c.fresherFriendly,
          internshipAvailable: !!c.internshipAvailable,
          gstNumber: c.gstNumber || '',
          panNumber: c.panNumber || '',
          businessLicense: c.businessLicense || '',
        });
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!company) return;
    setSaving(true);
    try {
      const payload = {
        companyName: data.companyName || undefined,
        registrationNumber: data.registrationNumber || undefined,
        yearFounded: data.yearFounded ? Number(data.yearFounded) : undefined,
        companyType: data.companyType || undefined,
        industry: data.industry || undefined,
        companySize: data.companySize || undefined,
        website: data.website || undefined,
        linkedInProfile: data.linkedInProfile || undefined,
        headquarters: data.headquarters || undefined,
        officeLocations: data.officeLocations
          ? data.officeLocations.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        contactEmail: data.contactEmail || undefined,
        hrContactNumber: data.hrContactNumber || undefined,
        logo: data.logo || undefined,
        banner: data.banner || undefined,
        gallery: data.gallery
          ? data.gallery.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        videoUrl: data.videoUrl || undefined,
        about: data.about || undefined,
        tagline: data.tagline || undefined,
        coreValues: data.coreValues
          ? data.coreValues.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        products: data.products || undefined,
        achievements: data.achievements || undefined,
        recruiter: {
          name: data.recruiterName || undefined,
          designation: data.recruiterDesignation || undefined,
          email: data.recruiterEmail || undefined,
          phone: data.recruiterPhone || undefined,
          linkedIn: data.recruiterLinkedIn || undefined,
          photo: data.recruiterPhoto || undefined,
        },
        benefits: data.benefits
          ? data.benefits.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        customBenefits: data.customBenefits || undefined,
        cultureTags: data.cultureTags
          ? data.cultureTags.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        diversityStatement: data.diversityStatement || undefined,
        workEnvironment: data.workEnvironment || undefined,
        dressCode: data.dressCode || undefined,
        salaryRange:
          data.salaryMin || data.salaryMax
            ? {
                min: data.salaryMin ? Number(data.salaryMin) : undefined,
                max: data.salaryMax ? Number(data.salaryMax) : undefined,
              }
            : undefined,
        hiringTimeline: data.hiringTimeline || undefined,
        preferredQualifications: data.preferredQualifications
          ? data.preferredQualifications.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        hiringIndustries: data.hiringIndustries
          ? data.hiringIndustries.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        commonRoles: data.commonRoles
          ? data.commonRoles.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        fresherFriendly: data.fresherFriendly,
        internshipAvailable: data.internshipAvailable,
        gstNumber: data.gstNumber || undefined,
        panNumber: data.panNumber || undefined,
        businessLicense: data.businessLicense || undefined,
      };

      const res = await updateMyCompanyProfile(payload);
      if (res?.success && res.data) {
        setCompany(res.data);
        toast.success('Profile updated successfully.');
      } else {
        toast.error(res?.error || 'Update failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'COMPANY') {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-6">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Company profile
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This page is only available for recruiter/company accounts.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No company profile found for this account yet.
          </p>
        </div>
      </div>
    );
  }

  const normalizedStatus = (company.verificationStatus || '').toString().toLowerCase();
  const isVerified =
    company.isVerified === true || normalizedStatus === 'verified';
  const isRejected = normalizedStatus === 'rejected';
  const isPending = !isVerified && !isRejected;
  const completion =
    typeof company.profileCompletionPercentage === 'number'
      ? company.profileCompletionPercentage
      : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-1">
            Company profile
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {company.companyName || 'Your company'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Fill out your company profile to increase visibility with students.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              isVerified
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                : isRejected
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
            }`}
          >
            {isVerified
              ? 'Verified'
              : isRejected
              ? 'Rejected'
              : 'Pending verification'}
          </span>
          <div className="w-48">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Profile completion
              </span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                {completion}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(100, Math.max(0, completion))}%` }}
              />
            </div>
          </div>
          {isPending && (
            <p className="max-w-xs text-xs text-slate-600 dark:text-slate-400 text-right">
              Your company is under review. You can continue updating your profile; it will be
              visible to students after Super Admin approves your company.
            </p>
          )}
          {isRejected && (
            <p className="max-w-xs text-xs text-slate-600 dark:text-slate-400 text-right">
              Your company was rejected. Please contact support or update details and wait for a new
              review.
            </p>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Basic Info */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Basic information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Company name
              </label>
                <input
                  type="text"
                  {...register('companyName')}
                  disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-error">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Registration number
              </label>
                <input
                  type="text"
                  {...register('registrationNumber')}
                  disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Year founded
              </label>
                <input
                  type="number"
                  {...register('yearFounded')}
                  disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Company type
              </label>
                <input
                  type="text"
                  {...register('companyType')}
                  disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="Private, Public, Startup, etc."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Industry
              </label>
                <input
                  type="text"
                  {...register('industry')}
                  disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="IT Services, EdTech, etc."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Company size
              </label>
                <input
                  type="text"
                  {...register('companySize')}
                  disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="e.g. 11–50, 51–200"
              />
            </div>
          </div>
        </section>

        {/* Branding */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Branding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Website
              </label>
              <input
                type="url"
                {...register('website')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="https://company.com"
              />
              {errors.website && (
                <p className="mt-1 text-xs text-error">{errors.website.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                LinkedIn page
              </label>
              <input
                type="url"
                {...register('linkedInProfile')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="https://linkedin.com/company/..."
              />
              {errors.linkedInProfile && (
                <p className="mt-1 text-xs text-error">
                  {errors.linkedInProfile.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                {...register('logo')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
              {errors.logo && (
                <p className="mt-1 text-xs text-error">{errors.logo.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Banner URL
              </label>
              <input
                type="url"
                {...register('banner')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
              {errors.banner && (
                <p className="mt-1 text-xs text-error">{errors.banner.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Gallery image URLs (comma separated)
              </label>
              <input
                type="text"
                {...register('gallery')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Video URL
              </label>
              <input
                type="url"
                {...register('videoUrl')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="YouTube or other hosted video"
              />
              {errors.videoUrl && (
                <p className="mt-1 text-xs text-error">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Company description
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Tagline
              </label>
              <input
                type="text"
                {...register('tagline')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                About
              </label>
              <textarea
                rows={4}
                {...register('about')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Core values (comma separated)
                </label>
                <input
                  type="text"
                  {...register('coreValues')}
                  disabled={isRejected}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Products / services
                </label>
                <input
                  type="text"
                  {...register('products')}
                  disabled={isRejected}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Achievements
              </label>
              <textarea
                rows={3}
                {...register('achievements')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>
        </section>

        {/* Contact & recruiter */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Contact & recruiter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Headquarters
              </label>
              <input
                type="text"
                {...register('headquarters')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="City, State, Country"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Office locations (comma separated)
              </label>
              <input
                type="text"
                {...register('officeLocations')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Contact email
              </label>
              <input
                type="email"
                {...register('contactEmail')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-xs text-error">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                HR contact number
              </label>
              <input
                type="text"
                {...register('hrContactNumber')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Recruiter name
              </label>
              <input
                type="text"
                {...register('recruiterName')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Recruiter designation
              </label>
              <input
                type="text"
                {...register('recruiterDesignation')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Recruiter email
              </label>
              <input
                type="email"
                {...register('recruiterEmail')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
              {errors.recruiterEmail && (
                <p className="mt-1 text-xs text-error">
                  {errors.recruiterEmail.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Recruiter phone
              </label>
              <input
                type="text"
                {...register('recruiterPhone')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Recruiter LinkedIn
              </label>
              <input
                type="url"
                {...register('recruiterLinkedIn')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Recruiter photo URL
              </label>
              <input
                type="url"
                {...register('recruiterPhoto')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="https://example.com/recruiter.jpg"
              />
              {errors.recruiterPhoto && (
                <p className="mt-1 text-xs text-error">{errors.recruiterPhoto.message}</p>
              )}
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Used as author avatar on your company posts (synced to your account).
              </p>
            </div>
          </div>
        </section>

        {/* Benefits & culture */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Benefits & culture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Benefits (comma separated)
              </label>
              <input
                type="text"
                {...register('benefits')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Culture tags (comma separated)
              </label>
              <input
                type="text"
                {...register('cultureTags')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Diversity statement
              </label>
              <textarea
                rows={3}
                {...register('diversityStatement')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Work environment
              </label>
              <input
                type="text"
                {...register('workEnvironment')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="Hybrid, Remote, Office-first, etc."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Dress code
              </label>
              <input
                type="text"
                {...register('dressCode')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>
        </section>

        {/* Hiring preferences & verification */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Hiring preferences & verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Hiring timeline
              </label>
              <input
                type="text"
                {...register('hiringTimeline')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
                placeholder="e.g. 2–4 weeks"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Common roles (comma separated)
              </label>
              <input
                type="text"
                {...register('commonRoles')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Preferred qualifications (comma separated)
              </label>
              <input
                type="text"
                {...register('preferredQualifications')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Hiring industries (comma separated)
              </label>
              <input
                type="text"
                {...register('hiringIndustries')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Salary range (min)
              </label>
              <input
                type="number"
                {...register('salaryMin')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Salary range (max)
              </label>
              <input
                type="number"
                {...register('salaryMax')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                GST number
              </label>
              <input
                type="text"
                {...register('gstNumber')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                PAN number
              </label>
              <input
                type="text"
                {...register('panNumber')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Business license
              </label>
              <input
                type="text"
                {...register('businessLicense')}
                disabled={isRejected}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving || isRejected}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

