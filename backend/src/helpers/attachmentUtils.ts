import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('Attach file storage')
const XAWS = AWSXRay.captureAWS(AWS)

// FASHION: Implement the fileStogare logic
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = s3BucketName
    ){}

    getAttachmentUrl(imageId: string) {
      const url = `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
      logger.info(`Generate attachment file url: ${url}`)
      return url;
    }

    getUploadUrl(imageId: string) {
      logger.info(`Upload url imageId: ${imageId}`)
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: Number(urlExpiration)
        });
        return url as string;
    }
}
