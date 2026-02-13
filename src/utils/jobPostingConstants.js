/**
 * Job Posting System — constants and enums matching API schema.
 * Use these for forms, filters, and display.
 */

export const JOB_CATEGORIES = ['Government', 'Private'];

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'];

export const TARGET_QUALIFICATIONS = [
  '10th',
  '12th',
  'Diploma',
  'B.Tech',
  'B.Sc',
  'B.Com',
  'B.A',
  'MBA',
  'M.Tech',
];

export const CATEGORY_ELIGIBILITY = ['General', 'OBC', 'SC', 'ST', 'EWS', 'PWD'];

export const JOB_STATUSES = ['Draft', 'Active', 'Closed', 'Expired'];

export const NOTIFYING_AUTHORITIES = [
  'APPSC',
  'UPSC',
  'SSC',
  'RRB',
  'IBPS',
  'TNPSC',
  'KPSC',
  'MPSC',
];

export const GOVT_GRADES = ['Class 1', 'Class 2', 'Class 3', 'Class 4'];

export const WORK_MODES = ['Remote', 'On-site', 'Hybrid'];

export const PAY_STRUCTURES = ['CTC', 'Monthly', 'Hourly'];

export const COMPANY_SIZES = ['Startup', 'SME', 'Large', 'Enterprise'];

export const CURRENCY = 'INR';

/** Default job type when not specified */
export const DEFAULT_JOB_TYPE = 'Full-time';

/** Default category eligibility when not specified */
export const DEFAULT_CATEGORY_ELIGIBILITY = ['General'];

/** Job title length constraints */
export const JOB_TITLE_MIN = 10;
export const JOB_TITLE_MAX = 100;

/** Job description minimum length */
export const JOB_DESCRIPTION_MIN = 50;
