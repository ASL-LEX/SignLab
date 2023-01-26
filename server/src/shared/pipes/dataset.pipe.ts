import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common';
import { Dataset } from '../../dataset/dataset.schema';
import { DatasetService } from '../../dataset/dataset.service';

@Injectable()
export class DatasetPipe implements PipeTransform<string, Promise<Dataset>> {
  constructor(private readonly datasetService: DatasetService) {}

  async transform(value: string): Promise<Dataset> {
    const dataset = await this.datasetService.findOne({ _id: value });
    if (!dataset) {
      throw new BadRequestException(`Dataset ${value} does not exist`);
    }
    return dataset;
  }
}
