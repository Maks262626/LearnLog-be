import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { SubjectInstanceStatus, SubjectInstanceType } from "../entities/subject-instance.entity";

export class CreateSubjectInstanceDto {
  @ApiProperty()
  @IsString()
  schedule_id: string;

  @ApiProperty()
  @IsString()
  name: string;

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
