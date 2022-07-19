import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws';
import * as awsnative from '@pulumi/aws-native'
import { config } from './variables'

export { siteBucket }

// Create Website bucket
const siteBucket = new awsnative.s3.Bucket('s3-website-bucket', {
    bucketName: config.domain,
    websiteConfiguration: {
        indexDocument: 'index.html',
        errorDocument: '404.html'
    }
});

import * as fs from 'fs'
import * as mime from 'mime'
import * as path from 'path'

const siteDir = 'www'

// Crawl www directory and create bucket objects
for (const item of fs.readdirSync(siteDir)) {
    const filePath = path.join(siteDir, item)
    new aws.s3.BucketObject(item.replace('.', '-'), {
        bucket: siteBucket.id,
        source: new pulumi.asset.FileAsset(filePath),
        contentType: mime.getType(filePath) || undefined
    });
}

pulumi.all([siteBucket]).apply(([siteBucket]) => {
    new aws.s3.BucketPolicy('s3-website-bucket-policy', {
        bucket: siteBucket.id,
        policy: {
            Version: '2012-10-17',
            Statement: [{
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: pulumi.interpolate `${siteBucket.arn}/*`
            }]
        }
    });
})
