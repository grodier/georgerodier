import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_OCTOKIT_TOKEN });

export async function getMdFileFromPath(path: string) {
  const content = await octokit.repos.getContent({
    owner: "grodier",
    repo: "georgerodier",
    path: `${path}.md`,
    headers: {
      Accept: "application/vnd.github.v3.raw",
    },
  });

  console.log("CONTENT", content);
  return content;
}
