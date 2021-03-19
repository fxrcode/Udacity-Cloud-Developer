import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import Jimp from 'jimp/es'

const s3 = new AWS.S3()

const imagesBucketName = process.env.IMAGES_S3_BUCKET
const thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET

export const handler: SNSHandler = async (event: SNSEvent) => {
    console.log('Processing SNS event ' , JSON.stringify(event))
    for (const snsRecord of event.Records ) {
        const s3EventStr = snsRecord.Sns.Message
        console.log('Processing S3 event', s3EventStr)
        const s3Event = JSON.parse(s3EventStr)

        for (const record of s3Event.Records) {
            await processImage(record) // copied from sendNotifications.ts
        }
    }
}

async function processImage(record: S3EventRecord) {
    // get a key of an uploaded image in S3
    const key = record.s3.object.key
    console.log('Procesing S3 item with key: ', key)

    // download the image with key
    const response = await s3
        .getObject({
            Bucket: imagesBucketName,
            Key: key
        })
        .promise()

    const body = response.Body

    // resize the image
    //  1. read an image with JImp library
    const image = await Jimp.read(body)

    console.log('Resizing image')
    //  2. resize an image
    image.resize(150, Jimp.AUTO)
    //  3. convert the thumbtail to a buffer so as to upload to another S3
    const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)

    console.log(`Writing thumtail to another S3: ${thumbnailBucketName}`)
    // put the thumbtail image into another S3
    await s3
        .putObject({
            Bucket: thumbnailBucketName,
            Key: `${key}.jpeg`,
            Body: convertedBuffer
        })
        .promise()
}
