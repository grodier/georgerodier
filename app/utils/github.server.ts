import { Octokit } from "@octokit/rest";
import { addToCache, readFromCache } from "./octocache.server";
import matter from "gray-matter";

const octokit = new Octokit({ auth: process.env.GITHUB_OCTOKIT_TOKEN });

export async function getFilesAtPath(path: string, matchTag: string) {
  try {
    const { data: files, headers } = await octokit.repos.getContent({
      owner: "grodier",
      repo: "georgerodier",
      path: path,
      headers: {
        "If-None-Match": matchTag,
      },
    });
    console.log("getFiles Success", headers);
    let posts = await Promise.all(
      (files as any)
        .filter(({ type }: any) => type === "file")
        .map(async ({ path, name }: any) => {
          const post = await getMdFileFromPath(path);
          const { data } = matter(post as any);
          return {
            slug: name.replace(/\.md$/, ""),
            description: data.excerpt,
            title: data.title,
          };
        })
    );
    let retval = { posts, etag: headers.etag };
    await addToCache(path, retval);
    return retval;
  } catch ({ status, response }) {
    if (status === 304) {
      console.log("getFiles 304", response.headers);
      return await readFromCache(path);
    }
  }
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
    console.log("getMd Success", headers);
    let retval = { content, etag: headers.etag };
    await addToCache(path, retval);
    return retval;
  } catch ({ status, response }) {
    if (status === 304) {
      console.log("getMd 304", response.headers);
      return await readFromCache(path);
    }
  }
}
