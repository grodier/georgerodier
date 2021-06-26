import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_OCTOKIT_TOKEN });

export async function getPostFromSlug(slug: string) {
  const content = await octokit.repos.getContent({
    owner: "grodier",
    repo: "georgerodier",
    path: `content/posts/${slug}.md`,
    headers: {
      Accept: "application/vnd.github.v3.raw",
    },
  });
  return content;
}
