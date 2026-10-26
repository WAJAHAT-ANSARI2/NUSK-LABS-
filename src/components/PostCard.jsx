import { fmtDate } from "../lib/format";

export default function PostCard({ post }) {
  return (
    <a className="card post" href={"#/blog/" + post.id}>
      {post.cover && <img className="cv" src={post.cover} alt="" loading="lazy" />}
      <span className="tag">{post.tag}</span>
      <time>{fmtDate(post.date)}</time>
      <h3>{post.title}</h3>
      <p>{post.intro}</p>
    </a>
  );
}
