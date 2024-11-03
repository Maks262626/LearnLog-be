import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUniversityDto {
  @ApiProperty()
  @IsString()
  name: string;
}
