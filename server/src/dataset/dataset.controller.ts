import { Controller, Get, Post, Body } from '@nestjs/common';
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

  @Post('/')
  @Auth('admin')
  async createDataset(@Body() dataset: Dataset): Promise<Dataset> {
    return this.datasetService.create(dataset);
  }

  @Get('/exists/:datasetName')
  @Auth('admin')
  async datasetExists(@Body() datasetName: string): Promise<boolean> {
    return this.datasetService.findOne({ name: datasetName }) !== null;
  }

}
