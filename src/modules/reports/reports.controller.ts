import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { ReporstService } from './reports.service';

@UseGuards(AuthGuard('jwt'))
@Controller('reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private readonly reportsService: ReporstService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Get('/student-grades')
  studentGrades(@CurrentUser() user: User) {
    return this.reportsService.studentGrades(user.id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Get('/student-individual-attendances')
  individualStudentAttendances(@CurrentUser() user: User) {
    return this.reportsService.individualStudentAttendances(user.id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Get('/student-individual-attendances/pdf')
  async individualStudentAttendancesPdf(@Res() res: Response, @CurrentUser() user: User) {
    const { id, first_name, last_name } = user;
    const fullName = `${first_name} ${last_name}`;
    const attendanceReport = await this.reportsService.individualStudentAttendances(id);
    const pdfBuffer = this.reportsService.generateStudentAttendanceReportPdf(
      attendanceReport,
      fullName,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=attendance_report.pdf',
      'Content-Length': Buffer.byteLength(pdfBuffer),
    });

    res.end(Buffer.from(pdfBuffer));
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Get('/student-individual-grades/pdf')
  async generateIndividualStudentGradesReportPdf(@Res() res: Response, @CurrentUser() user: User) {
    const { id, first_name, last_name } = user;
    const fullName = `${first_name} ${last_name}`;

    const gradeReport = await this.reportsService.studentGrades(id);
    const pdfBuffer = await this.reportsService.generateIndividualStudentGradesReportPdf(
      gradeReport,
      fullName,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=grade_report.pdf',
      'Content-Length': Buffer.byteLength(pdfBuffer),
    });

    res.end(Buffer.from(pdfBuffer));
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/student-grades/:id')
  studentGradesByUserId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reportsService.studentGrades(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/student-individual-attendances/:id')
  individualStudentAttendancesByUserId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reportsService.individualStudentAttendances(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/student-group-attendance-summary/:id')
  studentGroupAttendanceSummary(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reportsService.studentGroupAttendanceSummary(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/student-group-grade-summary/:id')
  studentGroupGradeSummary(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reportsService.studentGroupGradesSummaryReport(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/student-group-attendance-individual/pdf/:id')
  async IndividualAttendanceReportsByGroupPdf(
    @Res() res: Response,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const pdfBuffer = await this.reportsService.generateIndividualAttendanceReportsByGroupPdf(
      id,
      user,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=attendance_report.pdf',
      'Content-Length': Buffer.byteLength(pdfBuffer),
    });

    res.end(Buffer.from(pdfBuffer));
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/student-group-attendance-summary/xlsx/:id')
  async AttendanceReportsByGroupXlsx(
    @Res() res: Response,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const reports = await this.reportsService.studentGroupAttendanceSummary(id, user);
    const xlsxBuffer = await this.reportsService.generateStudentGroupAttendanceSummaryXlxs(reports);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="group-report.xlsx"`);

    res.send(xlsxBuffer);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/student-group-grade-summary/xlsx/:id')
  async GradeReportsByGroupXlsx(
    @Res() res: Response,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const reports = await this.reportsService.studentGroupGradesSummaryReport(id);
    const xlsxBuffer = await this.reportsService.generateStudentGroupGradesSummaryXlxs(reports);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="group-report.xlsx"`);

    res.send(xlsxBuffer);
  }
}
