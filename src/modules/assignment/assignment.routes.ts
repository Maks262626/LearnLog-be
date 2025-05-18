export const ASSIGNMENT_CONTROLLER = 'assignment';

export const ASSIGNMENT_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  FIND_BY_SUBJECT_ID: 'by-subject-id/:id',
  FIND_ONE: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;
