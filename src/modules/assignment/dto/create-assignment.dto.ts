import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class CreateAssignmentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  desciption: string;

  @ApiProperty()
  @IsDate()
  due_date: Date;

  @ApiProperty()
  @IsString()
  subject_id: string;
}
