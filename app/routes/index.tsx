import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";

import stylesUrl from "../styles/index.css";

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
  return { message: "this is awesome 😎" };
};

export default function Index() {
  let data = useRouteData();

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Welcome to the homepage of George Rodier!</h2>
      <p>Message from the loader: {data.message}</p>
    </div>
  );
}
