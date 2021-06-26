import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_OCTOKIT_TOKEN });

export async function getFilesAtPath(path: string) {
  const content = await octokit.repos.getContent({
    owner: "grodier",
    repo: "georgerodier",
    path: path,
  });
  return content.data;
}
export async function getMdFileFromPath(path: string) {
  const { data: content } = await octokit.repos.getContent({
    owner: "grodier",
    repo: "georgerodier",
    path,
    headers: {
      Accept: "application/vnd.github.v3.raw",
    },
  });
  return content;
}
