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

export let loader: LoaderFunction = async ({ params, request }) => {
  let { slug } = params;
  let post = await getPostFromSlug(
    slug,
    request.headers.get("if-none-match") || ""
  );
  let result = await remark().use(html).process(post.content);
  return json(
    { content: result.toString(), matter: post.data },
    {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=3.154e7",
        Etag: post.etag || "",
      },
    }
  );
};

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "",
    Etag: loaderHeaders.get("Etag") || "",
  };
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
