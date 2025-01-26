import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateGradeDto {
  @ApiProperty()
  @IsInt()
  grade_value: number;

  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  assignment_id: string;
}
