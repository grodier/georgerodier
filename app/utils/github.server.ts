import { Octokit } from "@octokit/rest";
import { addToCache, readFromCache } from "./octocache.server";

const octokit = new Octokit({ auth: process.env.GITHUB_OCTOKIT_TOKEN });

export async function getFilesAtPath(path: string) {
  const content = await octokit.repos.getContent({
    owner: "grodier",
    repo: "georgerodier",
    path: path,
  });
  return content.data;
}

export async function getMdFileFromPath(path: string, matchTag: string = "") {
  try {
    const { data: content, headers } = await octokit.repos.getContent({
      owner: "grodier",
      repo: "georgerodier",
      path,
      headers: {
        Accept: "application/vnd.github.v3.raw",
        "If-None-Match": matchTag,
      },
    });
    let retval = { content, etag: headers.etag };
    await addToCache(path, retval);
    return { content, etag: headers.etag };
  } catch ({ status, response }) {
    if (status === 304) {
      return await readFromCache(path);
    }
  }
}
