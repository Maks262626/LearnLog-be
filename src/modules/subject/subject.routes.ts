export const SUBJECT_CONTROLLER = 'subject';

export const SUBJECT_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  GET_TEACHER_SUBJECTS: 'teacher-subject',
  GET_MY_COURSES: 'in-my-faculty',
  GET_SUBJECTS_IN_MY_GROUP: 'in-my-group',
  GET_SUBJECTS_BY_GROUP_ID: 'by-group-id/:id',
  FIND_ONE: ':id',
  UPDATE: ':id',
  DELETE: ':id',
} as const;
