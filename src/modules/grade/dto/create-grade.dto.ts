import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ required: false, nullable: true })
  @IsInt()
  grade_value?: number | null;

  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  assignment_id: string;
}
