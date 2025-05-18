export const SUBJECT_INSTANCE_CONTROLLER = 'subject-instance';

export const SUBJECT_INSTANCE_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  FIND_ONE: ':id',
  TEACHER_SCHEDULE: 'teacher-schedule',
  STUDENT_GROUP: 'in-my-group',
  BY_SUBJECT_ID: 'by-subject-id/:id',
  BY_GROUP_ID: 'by-group-id/:id',
  UPDATE: ':id',
  DELETE: ':id',
} as const;
