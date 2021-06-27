import type { HeadersFunction, MetaFunction, LoaderFunction } from "remix";
import { useRouteData, json } from "remix";
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
  return json(
    { content: result.toString(), matter: post.data },
    {
      headers: {
        "Cache-Control":
          "max-age=60, s-maxage=86400, stale-while-revalidate=3.154e7",
      },
    }
  );
};

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return { "Cache-Control": loaderHeaders.get("Cache-Control") || "" };
};

export default function Post() {
  let { content, matter } = useRouteData();
  let { title } = matter;

  return (
    <div>
      <h1>{title}</h1>
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
