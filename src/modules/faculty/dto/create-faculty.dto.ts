import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateFacultyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  university_id: string;
}
