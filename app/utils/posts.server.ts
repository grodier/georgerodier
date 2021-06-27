import { getMdFileFromPath, getFilesAtPath } from "./github.server";
import matter from "gray-matter";

export async function getPostFromSlug(slug: string, matchTag: string) {
  const post = await getMdFileFromPath(`content/posts/${slug}.md`, matchTag);
  let postMatter = matter(post?.content as any);
  return { ...postMatter, etag: post?.etag };
}

export async function getAllPosts() {
  const posts = (await getFilesAtPath("content/posts")) as any;
  const files = await Promise.all(
    posts
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
  return files;
}
