import { ForbiddenException, Injectable } from '@nestjs/common';
import { ErrorMap } from 'src/shared/response/error.map';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { CreateFinalGradeDto } from './dto/create-final-grade.dto';
import { UpdateFinalGradeDto } from './dto/update-final-grade.dto';
import { FinalGrade } from './entities/final-grade.entity';
import { FinalGradeRepository } from './final-grade.repository';

@Injectable()
export class FinalGradeService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly finalGradeRepository: FinalGradeRepository,
  ) {}

  create(createFinalGradeDto: CreateFinalGradeDto): Promise<FinalGrade> {
    return this.finalGradeRepository.createFinalGrade(createFinalGradeDto);
  }

  findAll(): Promise<FinalGrade[]> {
    return this.finalGradeRepository.findAllFinalGrades();
  }

  findOne(id: string): Promise<FinalGrade> {
    return this.finalGradeRepository.findFinalGrade(id);
  }

  update(
    final_grade_id: string,
    updateFinalGradeDto: UpdateFinalGradeDto,
    callerUser: User,
  ): Promise<boolean> {
    if (!this.policy.isHasPermissionByFinalGradeId(final_grade_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.finalGradeRepository.updateFinalGrade(final_grade_id, updateFinalGradeDto);
  }

  remove(id: string): Promise<boolean> {
    return this.finalGradeRepository.removeFinalGrade(id);
  }
}
