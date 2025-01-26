import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Column, DataType } from "sequelize-typescript";

export class CreateSubjectScheduleDto {
  @ApiProperty()
  @IsString()
  subject_id: string;

  @ApiProperty()
  @Column(DataType.DATE)
  start_date: Date;

  @ApiProperty()
  @Column(DataType.TIME) 
  start_time: string;

  @ApiProperty()
  @IsOptional()
  @Column(DataType.DATE)
  end_date?: Date;

  @ApiProperty()
  @IsOptional()
  @Column(DataType.TIME) 
  end_time?: string;

  @ApiProperty()
  @IsOptional()
  @Column(DataType.INTEGER) 
  instanse_count?: number;

  @ApiProperty()
  @IsOptional()
  @Column(DataType.STRING) 
  day_of_week_mask?: string;

  @ApiProperty()
  @IsOptional()
  @Column(DataType.STRING) 
  default_url?: string;
}
