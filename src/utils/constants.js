export const ROLES = ['USER', 'SUPPORT', 'ADMIN', 'SUPER_ADMIN'];
export const STATES = ['AP', 'TS'];
export const TIERS = ['FREE', '1_RUPEE', '9_RUPEE'];
export const DOC_TYPES = ['HALL_TICKET', 'RESULT', 'ROADMAP'];
export const DOC_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];
export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];
export const CATEGORIES = ['OC', 'BC', 'SC', 'ST'];
export const ACTIONS = [
  'LOGIN',
  'REGISTER',
  'DOCUMENT_UPLOAD',
  'DOCUMENT_APPROVE',
  'DOCUMENT_REJECT',
  'DOCUMENT_VIEW',
  'TICKET_CREATE',
  'TICKET_ASSIGN',
  'TICKET_COMPLETE',
  'COLLEGE_PREDICT',
  'PAYMENT_VERIFY',
  'USER_UPDATE',
  'PROFILE_UPDATE',
];
export const RESOURCE_TYPES = ['DOCUMENT', 'TICKET', 'USER', 'PAYMENT', 'AUTH', 'PREDICTOR'];

export const DOC_TYPE_LABELS = {
  HALL_TICKET: 'Hall Ticket',
  RESULT: 'Result',
  ROADMAP: 'Roadmap',
};

export const STATE_LABELS = { AP: 'Andhra Pradesh', TS: 'Telangana' };

export const TIER_LABELS = {
  FREE: 'Free',
  '1_RUPEE': '₹1 Plan',
  '9_RUPEE': '₹9 Plan',
};
