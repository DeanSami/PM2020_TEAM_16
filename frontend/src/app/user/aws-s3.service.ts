import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { configSample } from '../config/config.production';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service {

  constructor() { }

  uploadFile(file, name, src = 'userImages/'): Promise<ManagedUpload.SendData> {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: configSample.accessKeyId,
        secretAccessKey: configSample.secretAccessKey,
        region: configSample.region
      }
    );
    const params = {
      Bucket: configSample.bucketName,
      Key: src + name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };

    return bucket.upload(params).promise();
  }
}
