import type { MetaFunction, HeadersFunction, LoaderFunction } from "remix";
import { useRouteData, json } from "remix";
import { Link } from "react-router-dom";
import { getAllPosts } from "../utils/posts.server";

export let meta: MetaFunction = () => {
  return {
    title: "George Rodier",
    description: "Welcome to the homepage of George Rodier!",
  };
};

export let loader: LoaderFunction = async ({ request }) => {
  let { files: posts, etag } = await getAllPosts(
    request.headers.get("if-none-match") || ""
  );
  return json(
    { posts },
    {
      headers: {
        "Cache-Control": "s-maxage=1, stale-while-revalidate=3.154e7",
        Etag: etag,
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

export default function Index() {
  let { posts } = useRouteData();
  return (
    <main className="max-w-lg mx-auto mt-4 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Welcome to the homepage of George Rodier!
        </h2>
      </div>
      <ul className="space-y-12">
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link
              to={`posts/${post.slug}`}
              className="text-xl font-semibold text-blue-900 hover:underline hover:text-blue-800 focus:text-blue-800"
            >
              {post.title}
            </Link>
            <p className="mt-3 text-base text-gray-500">{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
