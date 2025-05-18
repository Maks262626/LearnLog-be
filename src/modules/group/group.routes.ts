export const GROUP_CONTROLLER = 'group';

export const GROUP_ROUTES = {
  CREATE: '',
  FIND_ALL: '',
  FIND_IN_MY_FACULTY: 'get-in-my-faculty',
  FIND_BY_FACULTY_ID: 'get-by-faculty-id/:id',
  FIND_ONE: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;
