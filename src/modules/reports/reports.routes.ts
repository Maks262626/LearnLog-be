export const REPORTS_CONTROLLER = 'reports';

export const REPORTS_ROUTES = {
  STUDENT_GRADES: 'student-grades',
  STUDENT_INDIVIDUAL_ATTENDANCES: 'student-individual-attendances',
  STUDENT_INDIVIDUAL_ATTENDANCES_PDF: 'student-individual-attendances/pdf',
  STUDENT_INDIVIDUAL_GRADES_PDF: 'student-individual-grades/pdf',
  STUDENT_GRADES_BY_USER_ID: 'student-grades/:id',
  STUDENT_INDIVIDUAL_ATTENDANCES_BY_USER_ID: 'student-individual-attendances/:id',
  STUDENT_GROUP_ATTENDANCE_SUMMARY: 'student-group-attendance-summary/:id',
  STUDENT_GROUP_GRADE_SUMMARY: 'student-group-grade-summary/:id',
  STUDENT_GROUP_ATTENDANCE_INDIVIDUAL_PDF: 'student-group-attendance-individual/pdf/:id',
  STUDENT_GROUP_ATTENDANCE_SUMMARY_XLSX: 'student-group-attendance-summary/xlsx/:id',
  STUDENT_GROUP_GRADE_SUMMARY_XLSX: 'student-group-grade-summary/xlsx/:id',
} as const;
