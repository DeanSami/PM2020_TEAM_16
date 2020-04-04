import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
  AWS = require('aws-sdk');
  credentials = new this.AWS.SharedIniFileCredentials({profile: 'sns_profile'});
  constructor() { }
}
