import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { SubjectType } from '../entities/subject.entity';

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: SubjectType })
  @IsEnum(SubjectType)
  type: SubjectType;

  @ApiProperty()
  @IsString()
  group_id: string;

  @ApiProperty()
  @IsString()
  teacher_id: string;
}
