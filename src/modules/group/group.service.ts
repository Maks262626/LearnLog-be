import { ForbiddenException, Injectable } from '@nestjs/common';
import { ErrorMap } from 'src/shared/response/error.map';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly groupRepository: GroupRepository,
  ) {}

  create(createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupRepository.createGroup(createGroupDto);
  }

  findAll(): Promise<Group[]> {
    return this.groupRepository.findAllGroups();
  }

  findGroupsByFacultyId(id: string): Promise<Group[]> {
    return this.groupRepository.findGroupsByFacultyId(id);
  }

  findOne(id: string): Promise<Group> {
    return this.groupRepository.findGroup(id);
  }

  update(id: string, updateGroupDto: UpdateGroupDto, callerUser: User): Promise<boolean> {
    if (!this.policy.isManagerHasPermissionByGroupId(id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.groupRepository.updateGroup(id, updateGroupDto);
  }

  remove(id: string, callerUser: User): Promise<boolean> {
    if (!this.policy.isManagerHasPermissionByGroupId(id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.groupRepository.removeGroup(id);
  }
}
