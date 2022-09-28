import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseStudy } from '../schemas/responsestudy.schema';
import { Readable } from 'stream';
import { ResponseUpload } from '../schemas/response-upload.schema';
import { ResponseService } from './response.service';
import { StudyService } from './study.service';
import { TagService } from './tag.service';
import { ResponseUploadService } from './response-upload.service';
import { BucketStorage, BucketFile } from './bucket/bucket.service';
import {ConfigService} from '@nestjs/config';

/**
 * Example ResponseUpload model that expects data in the form below
 * ```
 * {
 *    responderID: string,
 *    responseID: string,
 *    filename: string,
 *    meta: {
 *      prompt: string,
 *    }
 * }
 * ```
 */
const responseUploadFindOneMock = jest.fn((params: any) => {
  let result: any = null;

  if (params.responseID.trim() == '2') {
    result = {
      responseID: '2',
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
const responseUploadModel = {
  // Delete many implementation to avoid errors
  deleteMany(_params: any) {
    return {
      async exec() {},
    };
  },

  findOne(params: any) {
    return responseUploadFindOneMock(params);
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
      result.errors['responserID'] = {
        properties: { message: 'responseID must be of type string' },
      };
    }
    if (!params.responseID) {
      result.errors['responseID'] = {
        properties: { message: 'responseID must be of type string' },
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

const responseService = {
  responseExists(params: any) {
    let result = null;

    if (params.id == '2') {
      result = {
        responseID: '2',
        responderID: '1',
        filename: 'my_video.mp4',
        meta: {
          prompt: 'grass',
        },
      };
    }

    return Promise.resolve(result);
  },

  createResponse(params: any) {
    return {
      async exec() {
        return params;
      },
    };
  },
};

const studyService = {
  getStudies() {
    return ['study1', 'study2', 'study3'];
  },
};

const configService = {
  getOrThrow<T>(search: string) {
    return ['mp4', 'oog', 'webm'];
  }
}

/**
 * Mock the response schema since it indirectly gets a different module
 * declaration from the `app`
 */
jest.mock('../schemas/response.schema', () => ({
  Response: () => {
    return { name: 'Response' };
  },
}));
jest.mock('../schemas/response-upload.schema', () => ({
  ResponseUpload: () => {
    return { name: 'Response' };
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
    return { isDirectory: () => { return false; } };
  },
  rm: (_path: string) => {
    return Promise.resolve();
  }
}));

/**
 * Mock file bucket upload
 */
const bucketService = {
  objectUpload(path: string, target: string): Promise<BucketFile> {
    return Promise.resolve({ name: path, uri: target });
  },
};

describe('ResponseService', () => {
  // Service being tested
  let responseUploadService: ResponseUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseUploadService,
        {
          provide: getModelToken(ResponseUpload.name),
          useValue: responseUploadModel,
        },
        {
          provide: getModelToken(ResponseStudy.name),
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
          provide: ResponseService,
          useValue: responseService,
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

    responseUploadService = await module.resolve(ResponseUploadService);
    // @ts-ignore
    jest.spyOn(responseUploadService, 'extractZIP').mockReturnValue(Promise.resolve({ type: 'success' }));
  });

  describe('uploadResponseDataCSV()', () => {
    it('single line CSV should fail', async () => {
      const testInput = Readable.from([
        `This is garbage and now good no commas for you`,
      ]);

      const result = await responseUploadService.uploadResponseDataCSV(
        testInput,
      );
      expect(result.type).toEqual('error');
    });

    it('should not allow empty CSV', async () => {
      const testInput = Readable.from(['']);

      const result = await responseUploadService.uploadResponseDataCSV(
        testInput,
      );
      expect(result.type).toEqual('error');
      expect(result.message).toContain('No responses found in CSV');
    });

    it('should catch CSVs that do not match validation requirements', async () => {
      // Missing responderID
      const testInput = Readable.from([
        `responseID,filename,prompt
         1,example.mp4,tree`,
      ]);

      const result = await responseUploadService.uploadResponseDataCSV(
        testInput,
      );
      expect(result.type).toEqual('error');
    });

    it('should catch invalid CSVs', async () => {
      // Extra input on last line (butterfly)
      const testInput = Readable.from([
        `responseID,responderID,filename,prompt
         1,2,example.mp4,tree,butterfly`,
      ]);

      const result = await responseUploadService.uploadResponseDataCSV(
        testInput,
      );
      expect(result.type).toEqual('error');
      expect(result.message).toContain('Failed to parse CSV');
    });

    it('should not allow duplicated ResponseUploads', async () => {
      // Response ID duplicated in insertion
      const testInput = Readable.from([
        `responseID,responderID,filename,prompt
        2,2,example.mp4,tree
        1,3,example.mp4,bread`,
      ]);

      const result = await responseUploadService.uploadResponseDataCSV(
        testInput,
      );
      expect(result.type).toEqual('error');
      expect(result!.where![0].message).toContain('already exists');
    });

    it('should allow valid CSV', async () => {
      const testInput = Readable.from([
        `responseID,responderID,filename,prompt
         1,2,example.mp4,tree
         3,4,another.mp4,bread
         5,6,what.mp4,grass
         7,8,another.mp4,water`,
      ]);

      const result = await responseUploadService.uploadResponseDataCSV(
        testInput,
      );
      expect(result.type).toEqual('success');
    });
  });

  describe('uploadResponseVideos()', () => {
    it('should give warning on a ZIP file with not content', async () => {
      const result = await responseUploadService.uploadResponseVideos(
        'empty.zip',
      );

      expect(result.saveResult.type).toEqual('warning');
      expect(result.saveResult.message).toContain('No response videos found in ZIP, no responses saved');
    });

    it('should give warning if file does not have a cooresponding response upload', async () => {
      readdirMock.mockImplementation((_path: string) => {
        return ['tree_response.mp4'];
      });
      responseUploadFindOneMock.mockImplementation((_params: any) => {
        return {
          async exec() {
            return null;
          },
        };
      });

      const result = await responseUploadService.uploadResponseVideos(
        'missing_response_upload.zip',
      );

      expect(result.saveResult.type).toEqual('warning');
      expect(result.saveResult.message).toContain(
        'Uploading video files caused warnings',
      );
    });

    it('should work for ZIP that has the cooresponding ResponseUploads', async () => {
      readdirMock.mockImplementation((_path: string) => {
        return ['tree_response.mp4', 'bread_response.mp4'];
      });

      responseUploadFindOneMock.mockImplementation((params: any) => {
        let result: any = null;

        if (params.filename == 'tree_response.mp4') {
          result = {
            responseID: '1',
            responderID: '2',
            filename: 'tree_response.mp4',
            meta: {
              prompt: 'tree',
            },
          };
        } else if (params.filename == 'bread_response.mp4') {
          result = {
            responseID: '1',
            responderID: '2',
            filename: 'bread_response.mp4',
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

      const result = await responseUploadService.uploadResponseVideos(
        'all_good.zip',
      );

      expect(result.saveResult.type).toEqual('success');
    });
  });
});
