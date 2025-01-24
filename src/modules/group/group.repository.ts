import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @Inject('GROUP_REPOSITORY')
    private groupRepository: typeof Group,
  ) { }
  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupRepository.create({ ...createGroupDto });
  }

  async findAllGroups(): Promise<Group[]> {
    const groups = await this.groupRepository.findAll();
    return groups;
  }

  async findGroup(id: string): Promise<Group> {
    const group = await this.groupRepository.findByPk(id);
    return group;
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto): Promise<boolean> {
    const group = await this.groupRepository.update(updateGroupDto, { where: { id } });
    return Boolean(group[0]);
  }

  async removeGroup(id: string): Promise<boolean> {
    const group = await this.groupRepository.destroy({where:{id}});
    return Boolean(group[0]);
  }
}
