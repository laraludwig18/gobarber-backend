import aws, { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error('File not found.');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        ContentType: contentType,
        Body: fileContent,
      })
      .promise();

    fs.promises.unlink(originalPath);

    return file;
  }
}

export default DiskStorageProvider;
