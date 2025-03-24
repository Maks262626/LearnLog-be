import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleName } from '../entities/user.entity';

export class SetRoleDto {
  @ApiProperty({ enum: UserRoleName })
  @IsEnum(UserRoleName)
  role: UserRoleName;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'The Auth0 user ID' })
  @IsString()
  @IsOptional()
  auth0_user_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_registration_completed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  university_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faculty_id?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  group_id?: string;

}
