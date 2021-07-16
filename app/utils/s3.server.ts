import { config, S3 } from "aws-sdk";
import { ulid } from "ulid";
import matter from "gray-matter";

config.update({
  region: process.env.AWS_PORTFOLIO_REGION,
  signatureVersion: "v4",
  credentials: {
    accessKeyId: process.env.AWS_PORTFOLIO_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_PORTFOLIO_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";

let s3 = new S3({
  apiVersion: "2006-03-01",
});

export type FileItem = {
  key: string;
  name: string;
  location: string;
  [key: string]: any;
};

export type FolderItem = {
  name: string;
  path: string;
  numFiles: number;
};

export type BucketItems = {
  files: Array<FileItem>;
  folders: Array<FolderItem>;
};

export async function listItemsAtPath(path: string = ""): Promise<BucketItems> {
  let response = await s3
    .listObjectsV2({
      Delimiter: "/",
      Prefix: path,
      Bucket: BUCKET_NAME,
    })
    .promise();

  let contentFiles = response.Contents
    ? response.Contents.filter(({ Key }) => Key !== response.Prefix)
    : [];

  let files = await Promise.all(
    contentFiles.map(async (item) => {
      let key = item.Key || "";
      let { data } = await getFile(key);
      let location = key.split("/").pop()?.split(".")[0] || "";
      return {
        ...data,
        key,
        location,
        name: (data.title as string) || location,
      };
    })
  );

  let folders = response.CommonPrefixes
    ? await Promise.all(
        response.CommonPrefixes.map(async ({ Prefix: path }) => {
          let response = await s3
            .listObjectsV2({
              Delimiter: "/",
              Prefix: path,
              Bucket: BUCKET_NAME,
            })
            .promise();

          let files =
            response.Contents?.filter(
              (item) => item.Key !== response.Prefix
            ).map((item) => {
              let key = item.Key || "";
              return {
                key,
                name: key.split("/").pop() || "",
              };
            }) || [];

          return {
            path: path || "",
            name: path?.replace(/\/$/, "") || "",
            numFiles: files.length,
          };
        })
      )
    : [];

  return { files, folders };
}

export async function getFile(path: string) {
  let response = await s3
    .getObject({ Bucket: BUCKET_NAME, Key: path })
    .promise();

  let body = response.Body?.toString() || "";
  let pm = matter(body);
  return pm;
}

export async function createFolder(path: string) {
  await s3
    .putObject({
      Bucket: BUCKET_NAME,
      Key: `${path}/`,
    })
    .promise();
}

export async function createFile(path: string): Promise<string> {
  let id = ulid();
  let content = `---
  title: "Untitled"
---`;
  await s3
    .putObject({
      Bucket: BUCKET_NAME,
      Key: `${path}/${id}.md`,
      Body: content,
    })
    .promise();

  return id;
}

export async function updateFile(
  path: string,
  content: string,
  fmData: object
) {
  let fileContent = matter.stringify(content, fmData);

  await s3
    .putObject({
      Bucket: BUCKET_NAME,
      Key: path,
      Body: fileContent,
    })
    .promise();
}
