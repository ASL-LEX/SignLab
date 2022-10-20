import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/auth.guard';
import { DatasetService } from './dataset.service';
import { Dataset } from './dataset.schema';

@Controller('/api/dataset')
export class DatasetController {

  constructor(private datasetService: DatasetService) {}

  @Get('/')
  @Auth('admin')
  async getDatasets(): Promise<Dataset[]> {
    return this.datasetService.findAll();
  }

}
