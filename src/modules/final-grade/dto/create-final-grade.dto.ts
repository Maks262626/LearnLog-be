import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateFinalGradeDto {
  @ApiProperty()
  @IsString()
  subject_id: string;

  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsInt()
  final_grade?: number | null;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  exam_grade?: number;
}
