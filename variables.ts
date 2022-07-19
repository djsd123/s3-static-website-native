import * as pulumi from '@pulumi/pulumi'

export { config }

const stackConfig = new pulumi.Config('s3-static-website')
const config = {
    certificateArn: stackConfig.requireSecret('certificateArn'),
    domain: stackConfig.require('domain'),
    siteDir: stackConfig.require('pathToWebsiteContents')
}
