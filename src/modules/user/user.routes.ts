export const USER_CONTROLLER = 'user';

export const USER_ROUTES = {
  REGISTER: 'register',
  ME: 'me',
  FIND_ALL_USERS: '',
  GET_TEACHERS_BY_FACULTY_ID: 'teachers/:id',
  GET_USERS_IN_MY_GROUP: 'in-my-group',
  GET_USERS_IN_MY_FACULTY: 'in-my-faculty',
  FIND_USER: ':id',
  FIND_USERS_FROM_UNIVERSITY: 'university/:id',
  FIND_USERS_FROM_FACULTY: 'faculty/:id',
  FIND_USERS_FROM_GROUP: 'group/:id',
  UPDATE_USER: ':id',
  SET_USER_ROLE: 'role/:id',
  DELETE_USER: ':id',
} as const;
