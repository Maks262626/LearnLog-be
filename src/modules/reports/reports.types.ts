import { Assignment } from '../assignment/entities/assignment.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FinalGrade } from '../final-grade/entities/final-grade.entity';
import { Grade } from '../grade/entities/grade.entity';
import { SubjectInstance } from '../subject-instance/entities/subject-instance.entity';
import { Subject } from '../subject/entities/subject.entity';
import { User } from '../user/entities/user.entity';

export interface StudentGradesReport {
  subject: Subject;
  finalGrade: FinalGrade;
  grades: {
    assignment: Assignment;
    grade: Grade;
  }[];
}

export interface StudentAttendancesReport {
  subject: Subject;
  attendances: {
    subjectInstance: SubjectInstance;
    attendance: Attendance;
  }[];
}

export interface StudentGroupAttendanceSummaryReport {
  subject: Subject;
  studentAttendances: {
    user: Pick<User, 'id' | 'first_name' | 'last_name'>;
    attendances: {
      subjectInstance: SubjectInstance;
      attendance: Attendance;
    }[];
  }[];
}

export interface StudentGroupGradesSummaryReport {
  subject: Subject;
  studentGrades: {
    user: Pick<User, 'id' | 'first_name' | 'last_name'>;
    finalGrade: FinalGrade;
    grades: {
      assignment: Assignment;
      grade: Grade;
    }[];
  }[];
}
