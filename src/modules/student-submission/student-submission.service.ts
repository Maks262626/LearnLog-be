import { Injectable } from '@nestjs/common';
import { CreateStudentSubmissionDto } from './dto/create-student-submission.dto';
import { UpdateStudentSubmissionDto } from './dto/update-student-submission.dto';
import { StudentSubmissionRepository } from './student-submission.repository';
import { StudentSubmission } from './entities/student-submission.entity';

@Injectable()
export class StudentSubmissionService {
  constructor(private readonly studentSubmissionRepository:StudentSubmissionRepository){}

  create(createStudentSubmissionDto: CreateStudentSubmissionDto):Promise<StudentSubmission> {
    return this.studentSubmissionRepository.createStudentSubmission(createStudentSubmissionDto);
  }

  findAll():Promise<StudentSubmission[]> {
    return this.studentSubmissionRepository.findAllStudentSubmissions();
  }

  findOne(id: string):Promise<StudentSubmission> {
    return this.studentSubmissionRepository.findStudentSubmission(id);
  }

  update(id: string, updateStudentSubmissionDto: UpdateStudentSubmissionDto):Promise<boolean> {
    return this.studentSubmissionRepository.updateStudentSubmission(id,updateStudentSubmissionDto);
  }

  remove(id: string):Promise<boolean> {
    return this.studentSubmissionRepository.removeStudentSubmission(id);
  }
}
