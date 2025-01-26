import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { StudentSubmissionStatus } from "../entities/student-submission.entity";

export class CreateStudentSubmissionDto {
  @ApiProperty()
  @IsString()
  file_url: string;

  @ApiProperty()
  @IsDate()
  submission_date: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  student_comments: string;

  @ApiProperty({ enum: StudentSubmissionStatus })
  @IsEnum(StudentSubmissionStatus)
  type: StudentSubmissionStatus;

  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  assignment_id: string;
}
