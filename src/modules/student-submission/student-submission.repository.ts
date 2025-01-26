import { Inject, Injectable } from '@nestjs/common';
import { CreateStudentSubmissionDto } from './dto/create-student-submission.dto';
import { UpdateStudentSubmissionDto } from './dto/update-student-submission.dto';
import { StudentSubmission } from './entities/student-submission.entity';

@Injectable()
export class StudentSubmissionRepository {
  constructor(
    @Inject('STUDENT_SUBMISSION_REPOSITORY')
    private studentSubmissionRepository: typeof StudentSubmission
  ){}

  async createStudentSubmission(createStudentSubmissionDto: CreateStudentSubmissionDto):Promise<StudentSubmission> {
    return await this.studentSubmissionRepository.create({...createStudentSubmissionDto});
  }

  async findAllStudentSubmissions():Promise<StudentSubmission[]> {
    const studentSubmission = await this.studentSubmissionRepository.findAll();
    return studentSubmission;
  }

  async findStudentSubmission(id: string):Promise<StudentSubmission> {
    const studentSubmission = await this.studentSubmissionRepository.findByPk(id);
    return studentSubmission
  }

  async updateStudentSubmission(id: string, updateStudentSubmissionDto: UpdateStudentSubmissionDto):Promise<boolean> {
    const studentSubmission = await this.studentSubmissionRepository.update(updateStudentSubmissionDto,{where:{id}});
    return Boolean(studentSubmission[0]);
  }

  async removeStudentSubmission(id: string):Promise<boolean> {
    const studentSubmission = await this.studentSubmissionRepository.destroy({where:{id}});
    return Boolean(studentSubmission[0]);
  }
}
