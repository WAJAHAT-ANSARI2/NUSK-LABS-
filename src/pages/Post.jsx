import { POSTS } from "../data/posts";
import { fmtDate } from "../lib/format";

function Block({ b }) {
  if (typeof b === "string") return <p>{b}</p>;
  if (b.h) return <h3>{b.h}</h3>;
  if (b.code) return <pre><code>{b.code}</code></pre>;
  if (b.img) return <figure><img src={b.img} alt={b.alt || ""} loading="lazy" />{b.caption && <figcaption>{b.caption}</figcaption>}</figure>;
  return null;
}

export default function Post({ id }) {
  const post = POSTS.find((p) => p.id === id);
  if (!post) {
    return (
      <div className="art">
        <p>That post does not exist.</p>
        <a className="back" href="#/blog">See all posts</a>
      </div>
    );
  }
  return (
    <article className="art">
      <a className="back" href="#/blog">Back to blog</a>
      <h1>{post.title}</h1>
      <span className="tag">{post.tag}</span>
      <time>{fmtDate(post.date)}</time>
      {post.cover && <img className="cover" src={post.cover} alt={post.title} />}
      {post.body.map((b, i) => <Block key={i} b={b} />)}
    </article>
  );
}
