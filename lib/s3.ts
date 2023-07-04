import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
});

export async function deleteUserFolder(location: string) {
  let count = 0;
  async function recursiveDelete(token?: string) {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: location,
      ContinuationToken: token,
    });
    const list = await s3.send(listCommand);
    if (list.KeyCount) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET,
        Delete: {
          Objects: list.Contents?.map((item) => ({ Key: item.Key })),
          Quiet: false,
        },
      });
      let deleted = await s3.send(deleteCommand);
      count += deleted.Deleted?.length ?? 0;

      if (deleted.Errors) {
        deleted.Errors.map((error) =>
          console.error(`${error.Key} could not be deleted - ${error.Code}`)
        );
      }
    }
    if (list.NextContinuationToken) {
      recursiveDelete(list.NextContinuationToken);
    }
    return count;
  }
  return recursiveDelete();
}
