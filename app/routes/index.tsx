import type { MetaFunction, HeadersFunction, LoaderFunction } from "remix";
import { useRouteData, json } from "remix";
import { Link } from "react-router-dom";
import { getAllPosts } from "../utils/posts.server";
import DateFormatter from "../components/DateFormatter";

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
  posts.sort((a: any, b: any) => {
    return +new Date(b.published) - +new Date(a.published);
  });
  console.log("POSTS2", posts);
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
    <main className="p-6 max-w-xl mx-auto mt-4 space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 text-center">
          Welcome to the homepage of George Rodier!
        </h2>
      </div>
      <ul className="space-y-12">
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link
              to={`posts/${post.slug}`}
              className="text-xl font-semibold text-green-900 hover:underline hover:text-green-800 focus:text-green-800"
            >
              {post.title}
            </Link>
            <div>
              - <DateFormatter dateString={post.published} />
            </div>
            <p className="mt-3 text-base text-gray-500">{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
