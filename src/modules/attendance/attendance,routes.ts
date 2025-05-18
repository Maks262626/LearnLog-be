export const ATTENDANCE_CONTROLLER = 'attendance';

export const ATTENDANCE_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  GET_BY_SUBJECT_INSTANCE_ID: 'subject-instance/:id',
  FIND_ONE: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;
