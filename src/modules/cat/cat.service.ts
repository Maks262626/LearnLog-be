import { Inject, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatService {
  constructor(
    @Inject('CATS_REPOSITORY') private catRepository: typeof Cat,
  ) {}
  create(createCatDto: CreateCatDto) {

    return this.catRepository.create({...createCatDto})
  }

  findAll() {
    return this.catRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
    
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
