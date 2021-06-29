import type { HeadersFunction, MetaFunction, LoaderFunction } from "remix";
import { useRouteData, json } from "remix";
import { getPostFromSlug } from "../utils/posts.server";
import remark from "remark";
import html from "remark-html";
import DateFormatter from "../components/DateFormatter";

export let meta: MetaFunction = ({ data }) => {
  let { matter } = data;
  return {
    title: matter.title,
    description: matter.description || "",
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
  let { title, published, author } = matter;

  return (
    <main className="p-6 max-w-2xl mx-auto mt-4 space-y-8">
      <div>
        <h1 className="text-5xl font-bold text-gray-900">{title}</h1>
        <div className="mt-4">
          <span className="text-xl font-medium italic text-green-900">
            {author.name}
          </span>{" "}
          -{" "}
          <span className="text-xl font-medium text-green-900">
            <DateFormatter dateString={published} />
          </span>
        </div>
      </div>
      <article
        className="prose md:prose-lg prose-green"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}
