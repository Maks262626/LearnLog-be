export const FACULTY_CONTROLLER = 'faculty';

export const FACULTY_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  FIND_FACULTIES_IN_MY_UNI: 'get-faculties-in-my-uni',
  FIND_ONE: ':id',
  FIND_BY_UNI_ID: 'get-by-uni-id/:id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;
