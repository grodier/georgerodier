import { useLoaderData } from "remix";

export const loader = async () => {
  return {
    posts: [
      {
        title: "Array Methods: The Gateway to Functional Programming",
        external: {
          location:
            "https://dev.to/grodier/array-methods-the-gateway-to-functional-programming-f29",
          siteName: "DEV",
        },
        description: "",
        date: "May 10, 2019",
      },
    ],
    projects: [
      {
        slug: "recipes",
        title: "Recipes",
        link: "https://recipes.georgerodier.com",
      },
    ],
  };
};

export default function IndexRoute() {
  const { posts, projects } = useLoaderData();
  return (
    <main>
      <h1>George Rodier</h1>
      <span>In progress. Cool things coming...</span>
      <section>
        <h2>Selected Writing</h2>
        <ul>
          {posts.map((post: any, idx: number) => {
            return (
              <li key={idx}>
                <a href={post.external.location}>
                  <h3>{post.title}</h3>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h2>Selected Projects</h2>
      </section>
    </main>
  );
}
