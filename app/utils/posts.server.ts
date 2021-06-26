import { getMdFileFromPath } from "./github.server";
import matter from "gray-matter";

export async function getPostFromSlug(slug: string) {
  const post = await getMdFileFromPath(`content/posts/${slug}`);
  return matter(post.data as any);
}
