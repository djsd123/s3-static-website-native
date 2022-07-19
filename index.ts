import { siteBucket } from './s3'

// Export the name of the bucket
export const siteBucketName = siteBucket.id;
export const URL = siteBucket.websiteURL
