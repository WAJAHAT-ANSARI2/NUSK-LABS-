import PostCard from "../components/PostCard";
import { POSTS } from "../data/posts";

export default function Blog() {
  return (
    <section className="blk">
      <h2>Blogs</h2>
      <p className="sub">Security research, guides and notes.</p>
      <div className="grid">
        {POSTS.map((p) => <PostCard post={p} key={p.id} />)}
      </div>
    </section>
  );
}
