import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { StudentSubmissionStatus } from '../entities/student-submission.entity';

export class CreateStudentSubmissionDto {
  @ApiProperty()
  @IsString()
  file_url: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  submission_date: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  student_comments: string;

  @ApiProperty({ enum: StudentSubmissionStatus })
  @IsEnum(StudentSubmissionStatus)
  status: StudentSubmissionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty()
  @IsString()
  assignment_id: string;
}
