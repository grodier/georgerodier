import { getMdFileFromPath, getFilesAtPath } from "./github.server";
import matter from "gray-matter";

export async function getPostFromSlug(slug: string, matchTag: string) {
  const post = await getMdFileFromPath(`content/posts/${slug}.md`, matchTag);
  let postMatter = matter(post?.content as any);
  return { ...postMatter, etag: post?.etag };
}

export async function getAllPosts(matchTag: string) {
  const { posts, etag } = (await getFilesAtPath(
    "content/posts",
    matchTag
  )) as any;

  return { files: posts, etag };
}
