import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { AttendanceStatus } from "../entities/attendance.entity";

export class CreateAttendanceDto {
  @ApiProperty()
  @IsString()
  subject_instance_id: string;

  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
