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
    <main className="max-w-lg mx-auto divide-y-2 divide-gray-200">
      <div>
        <h2>Welcome to the homepage of George Rodier!</h2>
      </div>
      <ul>
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link to={`posts/${post.slug}`}>{post.title}</Link>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
