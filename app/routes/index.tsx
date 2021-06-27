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

export let loader: LoaderFunction = async () => {
  let posts = await getAllPosts();
  return json(
    { posts },
    {
      headers: {
        "Cache-Control":
          "max-age=30, s-maxage=900, stale-while-revalidate=3.154e7",
      },
    }
  );
};

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return { "Cache-Control": loaderHeaders.get("Cache-Control") || "" };
};

export default function Index() {
  let { posts } = useRouteData();
  return (
    <div>
      <h2>Welcome to the homepage of George Rodier!</h2>
      <h3>Posts</h3>
      <ul>
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link to={`posts/${post.slug}`}>{post.title}</Link>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
