import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { SubjectInstanceStatus, SubjectInstanceType } from '../entities/subject-instance.entity';

export class CreateSubjectInstanceDto {
  @ApiProperty()
  @IsString()
  subject_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  start_time: string;

  @ApiProperty()
  @IsString()
  end_time: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ enum: SubjectInstanceType })
  @IsEnum(SubjectInstanceType)
  type: SubjectInstanceType;

  @ApiProperty({ enum: SubjectInstanceStatus })
  @IsEnum(SubjectInstanceStatus)
  status: SubjectInstanceStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  url: string;
}
