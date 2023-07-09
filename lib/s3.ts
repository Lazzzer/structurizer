import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
});

export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
) {
  const s3Params = {
    Bucket: process.env.S3_BUCKET as string,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  const signedUrl = await getSignedUrl(s3, new PutObjectCommand(s3Params), {
    expiresIn: 60,
  });

  const res = await fetch(signedUrl, {
    method: "PUT",
    body: buffer,
    headers: {
      "Content-Type": "application/pdf",
    },
  });

  if (!res.ok) {
    throw new Error("Could not upload file");
  }
}

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET as string,
    Key: key,
  });

  await s3.send(command);
}

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
