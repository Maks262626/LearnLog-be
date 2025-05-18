export const STUDENT_SUBMISSION_CONTROLLER = 'student-submission';

export const STUDENT_SUBMISSION_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  FIND_ONE: ':id',
  FIND_BY_SUBJECT_ID: 'by-subject-id/:id',
  UPDATE: ':id',
  DELETE: ':id',
} as const;
