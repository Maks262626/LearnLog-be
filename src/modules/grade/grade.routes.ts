export const GRADE_CONTROLLER = 'grade';

export const GRADE_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  FIND_BY_USER_ASSIGNMENT: 'by-user-assignment-id/:userId/:assignmentId',
  FIND_BY_ASSIGNMENT: 'by-assignment-id/:id',
  FIND_ONE: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;
