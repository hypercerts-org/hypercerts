import { PostData } from "../types/postdata";
import Link from "next/link";

export default function Post({ title, body, id }: PostData) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{body}</p>
      <Link href={`/post/${id}`}>Read more...</Link>
    </article>
  );
}
