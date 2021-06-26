import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { getPostFromSlug } from "../utils/posts.server";
import remark from "remark";
import html from "remark-html";

export let meta: MetaFunction = ({ data }) => {
  let { matter } = data;
  return {
    title: matter.title,
    description: matter.excerpt || "",
  };
};

export let loader: LoaderFunction = async ({ params }) => {
  let { slug } = params;
  let post = await getPostFromSlug(slug);
  let result = await remark().use(html).process(post.content);
  return { content: result.toString(), matter: post.data };
};

export default function Post() {
  let { content, matter } = useRouteData();
  let { title } = matter;

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>{title}</h1>
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
