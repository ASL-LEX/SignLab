import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Entry } from '../../entry/entry.schema';
import { EntryService } from '../../entry/entry.service';

@Injectable()
export class EntryPipe implements PipeTransform<string, Promise<Entry>> {
  constructor(private readonly entryService: EntryService) {}

  async transform(value: string, _metatype: ArgumentMetadata): Promise<Entry> {
    const entry = await this.entryService.find({ _id: value });
    if (!entry) {
      throw new BadRequestException(`Entry with id ${value} not found`);
    }
    return entry;
  }
}
