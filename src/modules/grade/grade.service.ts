import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import { Role } from 'src/shared/guards/role.guard';
import { ErrorMap } from 'src/shared/response/error.map';
import { User, UserRoleName } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';
import { GradeRepository } from './grade.repository';

@Injectable()
export class GradeService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly gradeRepository: GradeRepository,
  ) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  create(createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradeRepository.createGrade({ ...createGradeDto });
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  findAll(): Promise<Grade[]> {
    return this.gradeRepository.findAllGrades();
  }

  findOne(grade_id: string, callerUser: User): Promise<Grade> {
    if (!this.policy.isHasPermissionByGradeId(grade_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.gradeRepository.findGrade(grade_id);
  }

  getGradeByUserIdAndAssignmentId(
    user_id: string,
    assignment_id: string,
    callerUser: User,
  ): Promise<Grade> {
    if (!this.policy.isHasPermissionByAssignmentId(assignment_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.gradeRepository.getGradeByUserIdAndAssignmentId(user_id, assignment_id);
  }

  getGradesByAssignmentId(assignment_id: string, callerUser: User): Promise<Grade[]> {
    if (!this.policy.isHasPermissionByAssignmentId(assignment_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.gradeRepository.getGradesByAssignmentId(assignment_id);
  }

  update(grade_id: string, updateGradeDto: UpdateGradeDto, callerUser: User): Promise<boolean> {
    if (!this.policy.isHasPermissionByGradeId(grade_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.gradeRepository.updateGrade(grade_id, updateGradeDto);
  }

  remove(id: string): Promise<boolean> {
    return this.gradeRepository.removeGrade(id);
  }
}
