import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { getPostFromSlug } from "../utils/github.server";
import remark from "remark";
import html from "remark-html";
import stylesUrl from "../styles/index.css";
//import matter from "gray-matter";

export let meta: MetaFunction = () => {
  return {
    title: "George Rodier",
    description: "Welcome to the homepage of George Rodier!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  const post = await getPostFromSlug("hello-world");
  //const { data: mdData, content: mdContent } = matter(post.data);
  // console.log("MDDATA", mdData);
  // console.log("CONTENT", mdContent);
  const result = await remark().use(html).process(post.data);
  return { content: result.toString() };
};

export default function Index() {
  let { content } = useRouteData();

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Welcome to the homepage of George Rodier!</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
