import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository){}
  
  create(createGroupDto: CreateGroupDto) {
    return this.groupRepository.createGroup(createGroupDto);
  }

  findAll() {
    return this.groupRepository.findAllGroups();
  }

  findOne(id: string) {
    return this.groupRepository.findGroup(id);
  }

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.updateGroup(id,updateGroupDto);
  }

  remove(id: string) {
    return this.groupRepository.removeGroup(id);
  }
}
