import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './group.repository';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) { }

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

  update(id: string, updateGroupDto: UpdateGroupDto): Promise<boolean> {
    return this.groupRepository.updateGroup(id, updateGroupDto);
  }

  remove(id: string): Promise<boolean> {
    return this.groupRepository.removeGroup(id);
  }
}
