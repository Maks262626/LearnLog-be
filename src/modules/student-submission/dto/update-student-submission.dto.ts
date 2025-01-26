import { PartialType } from '@nestjs/swagger';
import { CreateStudentSubmissionDto } from './create-student-submission.dto';

export class UpdateStudentSubmissionDto extends PartialType(CreateStudentSubmissionDto) {}
