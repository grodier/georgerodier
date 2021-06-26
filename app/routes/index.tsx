import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
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
  return { posts };
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
