import { BucketStorage, BucketFile } from './bucket.service';
import { copyFile, access, unlink, writeFile } from 'fs/promises';
import { join, basename } from 'path';

/**
 * Implementation that stores files locally in a pre-defined location.
 *
 * TODO: Add support for folder generation based on file paths
 */
export class LocalStorage extends BucketStorage {
  /**
   * Make an instance of the local storage which will store objects
   * at the specified folder.
   */
  constructor(bucketName: string, private folder: string) {
    super(bucketName);
  }

  async objectUpload(file: string | Buffer, target: string): Promise<BucketFile> {
    if (file instanceof Buffer) {
     await writeFile(join(this.folder, target), file, {});
    } else {
      await copyFile(file, join(this.folder, target));
    }
    return { name: target, uri: `/media/${basename(target)}` };
  }

  objectDownload(path: string, target: string): Promise<void> {
    return copyFile(join(this.folder, target), path);
  }

  objectExists(target: string): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      access(join(this.folder, target))
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  objectDelete(target: string): Promise<void> {
    // Get just the name of the file, this is for the case when the file name
    // is `/media/<filename>`
    const filename = join('Entries', target.slice(target.lastIndexOf('/') + 1));

    return unlink(join(this.folder, filename));
  }
}
