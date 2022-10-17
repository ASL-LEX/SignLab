import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EntryStudy } from '../schemas/entrystudy.schema';
import { Readable } from 'stream';
import { EntryUpload } from '../schemas/entry-upload.schema';
import { EntryService } from './entry.service';
import { StudyService } from './study.service';
import { TagService } from './tag.service';
import { EntryUploadService } from './entry-upload.service';
import { BucketStorage, BucketFile } from './bucket/bucket.service';
import { ConfigService } from '@nestjs/config';

/**
 * Example EntryUpload model that expects data in the form below
 * ```
 * {
 *    responderID: string,
 *    entryID: string,
 *    filename: string,
 *    meta: {
 *      prompt: string,
 *    }
 * }
 * ```
 */
const entryUploadFindOneMock = jest.fn((params: any) => {
  let result: any = null;

  if (params.entryID.trim() == '2') {
    result = {
      entryID: '2',
      responderID: '1',
      filename: 'my_video.mp4',
      meta: {
        prompt: 'grass',
      },
    };
  }

  return {
    async exec() {
      return result;
    },
  };
});
const entryUploadModel = {
  // Delete many implementation to avoid errors
  deleteMany(_params: any) {
    return {
      async exec() {},
    };
  },

  findOne(params: any) {
    return entryUploadFindOneMock(params);
  },

  create(params: any) {
    return {
      async exec() {
        return params;
      },
    };
  },

  async validate(params: any) {
    // Make sure all fields present
    const result: any = { errors: {} };
    if (!params.responderID) {
      result.errors['entryrID'] = {
        properties: { message: 'entryID must be of type string' },
      };
    }
    if (!params.entryID) {
      result.errors['entryID'] = {
        properties: { message: 'entryID must be of type string' },
      };
    }
    if (!params.filename) {
      result.errors['filename'] = {
        properties: { message: 'filename must be of type string' },
      };
    }
    if (!params.meta) {
      result.errors['meta'] = {
        properties: { message: 'meta must be an object' },
      };
    } else if (!params.meta.prompt) {
      result.errors['prompt'] = {
        properties: { message: 'prompt must be a string' },
      };
    }

    if (Object.keys(result.errors).length > 0) {
      throw result;
    }
  },

  deleteOne(_params: any) {},
};

const entryService = {
  entryExists(params: any) {
    let result = null;

    if (params.id == '2') {
      result = {
        entryID: '2',
        responderID: '1',
        filename: 'my_video.mp4',
        meta: {
          prompt: 'grass',
        },
      };
    }

    return Promise.resolve(result);
  },

  createEntry(params: any) {
    return {
      async exec() {
        return params;
      },
    };
  },

  updateVideoURL(_params: any) {},
};

const studyService = {
  getStudies() {
    return ['study1', 'study2', 'study3'];
  },
};

const configService = {
  getOrThrow<T>(search: string) {
    return ['mp4', 'oog', 'webm'];
  },
};

/**
 * Mock the entry schema since it indirectly gets a different module
 * declaration from the `app`
 */
jest.mock('../schemas/entry.schema', () => ({
  Entry: () => {
    return { name: 'Entry' };
  },
}));
jest.mock('../schemas/entry-upload.schema', () => ({
  EntryUpload: () => {
    return { name: 'Entry' };
  },
}));

/**
 * Mock file oriented operations
 */
const readdirMock = jest.fn<string[], [string]>((_path) => {
  return [];
});

jest.mock('fs/promises', () => ({
  readdir: (path: string) => {
    return readdirMock(path);
  },
  stat: (_path: string) => {
    return {
      isDirectory: () => {
        return false;
      },
    };
  },
  rm: (_path: string) => {
    return Promise.resolve();
  },
}));

/**
 * Mock file bucket upload
 */
const bucketService = {
  objectUpload(path: string, target: string): Promise<BucketFile> {
    return Promise.resolve({ name: path, uri: target });
  },
};

describe('EntryService', () => {
  // Service being tested
  let entryUploadService: EntryUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryUploadService,
        {
          provide: getModelToken(EntryUpload.name),
          useValue: entryUploadModel,
        },
        {
          provide: getModelToken(EntryStudy.name),
          useValue: {},
        },
        {
          provide: StudyService,
          useValue: studyService,
        },
        {
          provide: TagService,
          useValue: {},
        },
        {
          provide: EntryService,
          useValue: entryService,
        },
        {
          provide: BucketStorage,
          useValue: bucketService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    entryUploadService = await module.resolve(EntryUploadService);
    jest
      .spyOn(entryUploadService, 'extractZIP')
      .mockReturnValue(Promise.resolve({ type: 'success' }));
  });

  describe('uploadEntryDataCSV()', () => {
    it('single line CSV should fail', async () => {
      const testInput = Readable.from([
        `This is garbage and now good no commas for you`,
      ]);

      const result = await entryUploadService.uploadEntryDataCSV(testInput);
      expect(result.type).toEqual('error');
    });

    it('should not allow empty CSV', async () => {
      const testInput = Readable.from(['']);

      const result = await entryUploadService.uploadEntryDataCSV(testInput);
      expect(result.type).toEqual('error');
      expect(result.message).toContain('No entries found in CSV');
    });

    it('should catch CSVs that do not match validation requirements', async () => {
      // Missing responderID
      const testInput = Readable.from([
        `entryID,filename,prompt
         1,example.mp4,tree`,
      ]);

      const result = await entryUploadService.uploadEntryDataCSV(testInput);
      expect(result.type).toEqual('error');
    });

    it('should catch invalid CSVs', async () => {
      // Extra input on last line (butterfly)
      const testInput = Readable.from([
        `entryID,responderID,filename,prompt
         1,2,example.mp4,tree,butterfly`,
      ]);

      const result = await entryUploadService.uploadEntryDataCSV(testInput);
      expect(result.type).toEqual('error');
      expect(result.message).toContain('Failed to parse CSV');
    });

    it('should not allow duplicated EntryUploads', async () => {
      // Entry ID duplicated in insertion
      const testInput = Readable.from([
        `entryID,responderID,filename,prompt
        2,2,example.mp4,tree
        1,3,example.mp4,bread`,
      ]);

      const result = await entryUploadService.uploadEntryDataCSV(testInput);
      expect(result.type).toEqual('error');
      expect(result!.where![0].message).toContain('already exists');
    });

    it('should allow valid CSV', async () => {
      const testInput = Readable.from([
        `entryID,responderID,filename,prompt
         1,2,example.mp4,tree
         3,4,another.mp4,bread
         5,6,what.mp4,grass
         7,8,another.mp4,water`,
      ]);

      const result = await entryUploadService.uploadEntryDataCSV(testInput);
      expect(result.type).toEqual('success');
    });
  });

  describe('uploadEntryVideos()', () => {
    it('should give warning on a ZIP file with not content', async () => {
      const result = await entryUploadService.uploadEntryVideos('empty.zip');

      expect(result.saveResult.type).toEqual('warning');
      expect(result.saveResult.message).toContain(
        'No entry videos found in ZIP, no entries saved',
      );
    });

    it('should give warning if file does not have a cooresponding entry upload', async () => {
      readdirMock.mockImplementation((_path: string) => {
        return ['tree_entry.mp4'];
      });
      entryUploadFindOneMock.mockImplementation((_params: any) => {
        return {
          async exec() {
            return null;
          },
        };
      });

      const result = await entryUploadService.uploadEntryVideos(
        'missing_entry_upload.zip',
      );

      expect(result.saveResult.type).toEqual('warning');
      expect(result.saveResult.message).toContain(
        'Uploading video files caused warnings',
      );
    });

    it('should work for ZIP that has the cooresponding EntryUploads', async () => {
      readdirMock.mockImplementation((_path: string) => {
        return ['tree_entry.mp4', 'bread_entry.mp4'];
      });

      entryUploadFindOneMock.mockImplementation((params: any) => {
        let result: any = null;

        if (params.filename == 'tree_entry.mp4') {
          result = {
            entryID: '1',
            responderID: '2',
            filename: 'tree_entry.mp4',
            meta: {
              prompt: 'tree',
            },
          };
        } else if (params.filename == 'bread_entry.mp4') {
          result = {
            entryID: '1',
            responderID: '2',
            filename: 'bread_entry.mp4',
            meta: {
              prompt: 'bread',
            },
          };
        }

        return {
          async exec() {
            return result;
          },
        };
      });

      const result = await entryUploadService.uploadEntryVideos('all_good.zip');

      expect(result.saveResult.type).toEqual('success');
    });
  });
});
