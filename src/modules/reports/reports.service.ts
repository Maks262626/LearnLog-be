import { ForbiddenException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as path from 'path';
import { ErrorMap } from 'src/shared/response/error.map';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { AttendanceStatus } from '../attendance/entities/attendance.entity';
import { FinalGradeRepository } from '../final-grade/final-grade.repository';
import { GradeRepository } from '../grade/grade.repository';
import { SubjectInstanceRepository } from '../subject-instance/subject-instance.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { UserRepository } from '../user/user.repository';
import {
  StudentAttendancesReport,
  StudentGradesReport,
  StudentGroupAttendanceSummaryReport,
  StudentGroupGradesSummaryReport,
} from './reports.types';

@Injectable()
export class ReporstService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly subjectRepository: SubjectRepository,
    private readonly subjectInstanceRepository: SubjectInstanceRepository,
    private readonly finalGradeRepository: FinalGradeRepository,
    private readonly assigmentsRepository: AssignmentRepository,
    private readonly gradeRepository: GradeRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async studentGrades(user_id: string, callerUser?: User): Promise<StudentGradesReport[]> {
    if (callerUser && !this.policy.isManagerHasPermission(user_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    const user = await this.userRepository.findUser(user_id);
    const { group_id } = user;
    const subjects = await this.subjectRepository.getSubjectsByGroupId(group_id);
    const data: StudentGradesReport[] = [];
    for (const subject of subjects) {
      const finalGrade = await this.finalGradeRepository.findFinalGradeBySubjectAndUserId(
        subject.id,
        user_id,
      );
      const assignments = await this.assigmentsRepository.getAssigmentsBySubjectId(
        subject.id,
        false,
      );
      const grades: StudentGradesReport['grades'] = [];
      for (const assignment of assignments) {
        const grade = await this.gradeRepository.getGradeByUserIdAndAssignmentId(
          user_id,
          assignment.id,
        );
        grades.push({ assignment, grade });
      }
      data.push({ subject, finalGrade, grades });
    }
    return data;
  }

  async studentGroupGradesSummaryReport(
    group_id: string,
  ): Promise<StudentGroupGradesSummaryReport[]> {
    const subjects = await this.subjectRepository.getSubjectsByGroupId(group_id);
    const users = await this.userRepository.findUsersFromGroup(group_id);
    const data: StudentGroupGradesSummaryReport[] = [];
    for (const subject of subjects) {
      const studentGrades: StudentGroupGradesSummaryReport['studentGrades'] = [];
      const assignments = await this.assigmentsRepository.getAssigmentsBySubjectId(
        subject.id,
        false,
      );
      for (const user of users) {
        const grades: StudentGroupGradesSummaryReport['studentGrades'][number]['grades'] = [];
        const finalGrade = await this.finalGradeRepository.findFinalGradeBySubjectAndUserId(
          subject.id,
          user.id,
        );
        for (const assignment of assignments) {
          const grade = await this.gradeRepository.getGradeByUserIdAndAssignmentId(
            user.id,
            assignment.id,
          );
          grades.push({ assignment, grade });
        }
        studentGrades.push({
          user: { id: user.id, first_name: user.first_name, last_name: user.last_name },
          finalGrade,
          grades,
        });
      }
      data.push({ subject, studentGrades });
    }

    return data;
  }

  async individualStudentAttendances(
    user_id: string,
    callerUser?: User,
  ): Promise<StudentAttendancesReport[]> {
    if (callerUser && !this.policy.isManagerHasPermission(user_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    const user = await this.userRepository.findUser(user_id);
    const { group_id } = user;
    const subjects = await this.subjectRepository.getSubjectsByGroupId(group_id);
    const data: StudentAttendancesReport[] = [];

    for (const subject of subjects) {
      const row: StudentAttendancesReport = { subject, attendances: [] };

      const subjectInstances = await this.subjectInstanceRepository.findSubjectInstancesBySubjectId(
        subject.id,
        false,
      );
      for (const subjectInstance of subjectInstances) {
        const attendance = await this.attendanceRepository.getBySubjectInstanceAndUserId(
          subjectInstance.id,
          user_id,
        );
        row.attendances.push({ subjectInstance, attendance });
      }
      data.push(row);
    }
    return data;
  }

  async studentGroupAttendanceSummary(
    group_id: string,
    callerUser: User,
  ): Promise<StudentGroupAttendanceSummaryReport[]> {
    if (!this.policy.isManagerHasPermissionByGroupId(group_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    const subjects = await this.subjectRepository.getSubjectsByGroupId(group_id);
    const users = await this.userRepository.findUsersFromGroup(group_id);
    const data: StudentGroupAttendanceSummaryReport[] = [];

    for (const subject of subjects) {
      const studentAttendances: StudentGroupAttendanceSummaryReport['studentAttendances'] = [];

      const subjectInstances = await this.subjectInstanceRepository.findSubjectInstancesBySubjectId(
        subject.id,
      );

      for (const user of users) {
        const attendances: StudentGroupAttendanceSummaryReport['studentAttendances'][number]['attendances'] =
          [];
        for (const subjectInstance of subjectInstances) {
          const attendance = await this.attendanceRepository.getBySubjectInstanceAndUserId(
            subjectInstance.id,
            user.id,
          );
          attendances.push({ subjectInstance, attendance });
        }
        studentAttendances.push({
          user: { id: user.id, first_name: user.first_name, last_name: user.last_name },
          attendances,
        });
      }
      data.push({ subject, studentAttendances });
    }
    return data;
  }

  setBasePdf(doc: jsPDF, name: string) {
    doc.setFont('helvetica');
    doc.setFontSize(14);
    const logoPath = path.resolve(process.cwd(), 'src', 'assets', 'logo.png');
    const image = fs.readFileSync(logoPath, { encoding: 'base64' });

    doc.addImage(image, 'PNG', 14, 10, 30, 20);
    doc.text(`Student: ${name}`, 50, 17);
    (doc as any).lastAutoTable = { finalY: 35 };
  }

  writeIndividualStudentAttendancereport(
    doc: jsPDF,
    report: StudentAttendancesReport,
    index: number,
  ) {
    const subject = report.subject;
    const attendances = report.attendances;

    const startY = (doc as any)['lastAutoTable'] ? (doc as any)['lastAutoTable'].finalY + 10 : 40;

    doc.setFontSize(12);
    doc.text(
      `${index + 1}. ${subject.name} (${subject.type}) — ${subject.teacher.first_name} ${subject.teacher.last_name}`,
      14,
      startY,
    );

    if (attendances.length === 0) {
      doc.setFontSize(11);
      doc.text('No attendances.', 16, startY + 7);

      (doc as any).lastAutoTable = { finalY: startY + 14 };
      return;
    }

    const rows = attendances.map(({ subjectInstance, attendance }) => [
      dayjs(subjectInstance.date).format('DD.MM.YYYY'),
      subjectInstance.start_time,
      subjectInstance.end_time,
      subjectInstance.type,
      attendance.status,
    ]);

    autoTable(doc, {
      startY: startY + 7,
      head: [['Date', 'Start Time', 'End Time', 'Type', 'Status']],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 10 },
    });
  }
  writeIndividualStudentGradesReport(doc: jsPDF, report: StudentGradesReport) {
    const margin = 15;
    const { subject, finalGrade, grades } = report;
    const subjectTitle = `${subject.name} (${subject.type.toUpperCase()})`;
    const teacherName =
      `${subject.teacher?.first_name ?? ''} ${subject.teacher?.last_name ?? ''}`.trim();

    const startY = (doc as any)['lastAutoTable'] ? (doc as any)['lastAutoTable'].finalY + 10 : 40;

    doc.setFontSize(12);
    doc.text(subjectTitle, margin, startY);

    let y = startY + 6;

    doc.setFontSize(10);
    doc.text(`Teacher: ${teacherName}`, margin, y);
    y += 6;

    if (finalGrade) {
      doc.setFontSize(11);
      doc.text(`Final Grade: ${finalGrade.final_grade}`, margin, y);
      y += 5;
      if (finalGrade.exam_grade !== null && finalGrade.exam_grade !== undefined) {
        doc.text(`Exam Grade: ${finalGrade.exam_grade}`, margin, y);
        y += 6;
      }
    }

    if (grades.length > 0) {
      const tableData = grades.map(({ assignment, grade }) => [
        assignment.name,
        assignment.description,
        new Date(assignment.due_date).toLocaleDateString(),
        grade.grade_value !== null ? grade.grade_value.toString() : 'N/A',
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Assignment Name', 'Description', 'Due Date', 'Grade']],
        body: tableData,
        margin: { left: margin, right: margin },
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 9 },
      });
    } else {
      doc.setFontSize(10);
      doc.text('No assignments recorded.', margin, y);
      (doc as any)['lastAutoTable'] = { finalY: y + 10 };
    }

    const currentY = (doc as any)['lastAutoTable']?.finalY ?? y;
    if (currentY > 270) {
      doc.addPage();
    }
  }

  generateStudentAttendanceReportPdf(reports: StudentAttendancesReport[], fullName: string) {
    const doc = new jsPDF();
    this.setBasePdf(doc, fullName);

    reports.forEach((report, index) => {
      this.writeIndividualStudentAttendancereport(doc, report, index);
    });

    const pdfBuffer = doc.output('arraybuffer');
    return Buffer.from(pdfBuffer);
  }

  async generateIndividualAttendanceReportsByGroupPdf(group_id: string, callerUser: User) {
    if (!this.policy.isManagerHasPermissionByGroupId(group_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    const users = await this.userRepository.findUsersFromGroup(group_id);
    const doc = new jsPDF();

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const fullName = `${user.first_name} ${user.last_name}`;

      const reports = await this.individualStudentAttendances(user.id);

      if (i > 0) doc.addPage();

      this.setBasePdf(doc, fullName);

      reports.forEach((report, index) => {
        this.writeIndividualStudentAttendancereport(doc, report, index);
      });
    }

    const pdfBuffer = doc.output('arraybuffer');
    return Buffer.from(pdfBuffer);
  }

  async generateIndividualStudentGradesReportPdf(reports: StudentGradesReport[], fullName: string) {
    const doc = new jsPDF();
    this.setBasePdf(doc, fullName);

    for (const report of reports) {
      this.writeIndividualStudentGradesReport(doc, report);
    }

    const pdfBuffer = doc.output('arraybuffer');
    return Buffer.from(pdfBuffer);
  }

  async generateStudentGroupAttendanceSummaryXlxs(reports: StudentGroupAttendanceSummaryReport[]) {
    const workbook = new ExcelJS.Workbook();

    for (const report of reports) {
      const subjectName = report.subject.name;
      const worksheet = workbook.addWorksheet(subjectName);

      const subjectInstances = await this.subjectInstanceRepository.findSubjectInstancesBySubjectId(
        report.subject.id,
      );
      const dates: string[] = subjectInstances.map((si) => dayjs(si.date).format('DD-MM-YYYY'));

      worksheet.columns = [
        { header: 'Студент', key: 'student', width: 30 },
        ...subjectInstances.map((si) => ({
          header: dayjs(si.date).format('DD-MM-YYYY'),
          key: si.id,
          width: 15,
        })),
      ];

      report.studentAttendances.forEach((studentData) => {
        const fullName = `${studentData.user.first_name} ${studentData.user.last_name}`;
        const rowData = { student: fullName };
        studentData.attendances.forEach((attendanceData) => {
          const attendanceRecord =
            attendanceData.attendance.status === AttendanceStatus.PRESENT ? '+' : '-';
          rowData[attendanceData.subjectInstance.id] = attendanceRecord;
        });
        worksheet.addRow(rowData);
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async generateStudentGroupGradesSummaryXlxs(reports: StudentGroupGradesSummaryReport[]) {
    const workbook = new ExcelJS.Workbook();

    for (const report of reports) {
      const subjectName = report.subject.name;
      const worksheet = workbook.addWorksheet(subjectName);

      const assignments = await this.assigmentsRepository.getAssigmentsBySubjectId(
        report.subject.id,
      );
      worksheet.columns = [
        { header: 'Студент', key: 'student', width: 30 },
        ...assignments.map((a) => ({ header: a.name, key: a.id, width: 15 })),
        { header: 'Фінальна оцінка', key: 'final-grade', width: 15 },
      ];

      report.studentGrades.forEach((studentData) => {
        const fullName = `${studentData.user.first_name} ${studentData.user.last_name}`;
        const rowData = { student: fullName };
        studentData.grades.map((gradesData) => {
          const grade = gradesData.grade.grade_value ?? '';
          const assignment = gradesData.assignment;
          rowData[assignment.id] = grade;
        });
        const finalGrade = studentData.finalGrade;
        rowData['final-grade'] = finalGrade?.final_grade ?? '';
        worksheet.addRow(rowData);
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
