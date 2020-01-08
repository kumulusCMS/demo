import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import awsmobile from '../../../../aws-exports';

export enum ImgFormat {
  ORIGINAL = 0,
  THUMBNAIL = 200,
}

@Injectable({
  providedIn: 'root',
})
export class ImgService {
  private baseUrl = environment.imgApi;

  constructor() {}

  public getImage(format: ImgFormat, key: string): string {
    if (!key) {
      return '';
    }
    switch (format) {
      case ImgFormat.THUMBNAIL:
        return this.getThumbnail(key);
      case ImgFormat.ORIGINAL:
      default:
        return this.getOriginal(key) ? this.getOriginal(key) : '';
    }
  }

  private getThumbnail(key: string): string {
    const encodedConfig = window.btoa(
      JSON.stringify({
        bucket: awsmobile.aws_user_files_s3_bucket,
        key: `public/${key}`,
        edits: {
          resize: {
            width: 200,
            fit: 'contain',
          },
        },
      })
    );

    return `${this.baseUrl}${encodedConfig}`;
  }

  private getOriginal(key: string): string {
    const encodedConfig = window.btoa(
      JSON.stringify({
        bucket: awsmobile.aws_user_files_s3_bucket,
        key: `public/${key}`,
      })
    );

    return `${this.baseUrl}${encodedConfig}`;
  }
}
