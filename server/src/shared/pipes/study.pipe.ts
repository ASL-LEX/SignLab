import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Study } from '../../study/study.schema';
import { StudyService } from '../../study/study.service';

@Injectable()
export class StudyPipe implements PipeTransform<string, Promise<Study>> {
  constructor(private readonly studyService: StudyService) {}

  async transform(value: string, _metatype: ArgumentMetadata): Promise<Study> {
    const study = await this.studyService.find(value);
    if (!study) {
      throw new BadRequestException(`Study with id ${value} not found`);
    }
    return study;
  }
}
