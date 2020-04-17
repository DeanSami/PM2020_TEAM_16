import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { config } from '../config/config.production';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service {

  constructor() { }

  uploadFile(file): Promise<ManagedUpload.SendData> {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: config.region
      }
    );
    const params = {
      Bucket: config.bucketName,
      Key: 'userImages/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };

    return bucket.upload(params).promise();
  }
}
