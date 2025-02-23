import { PartialType } from '@nestjs/swagger';
import { CreateSubjectInstanceDto } from './create-subject-instance.dto';

export class UpdateSubjectInstanceDto extends PartialType(CreateSubjectInstanceDto) {}
