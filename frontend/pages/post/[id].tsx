import { GetPosts, GetPost } from "../../lib/postdata_api";
import { PostData, PostDataProps } from "../../types/postdata";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import React from "react";

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const postList: PostData[] = await GetPosts();
  return {
    paths: postList.map((post) => {
      return {
        params: {
          id: post.id.toString(),
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostDataProps, Params> = async (
  context,
) => {
  const { id } = context.params as Params;
  const postData: PostData = await GetPost(id);
  return {
    props: {
      postData,
    },
  };
};

const Post: NextPage<PostDataProps> = ({ postData }: PostDataProps) => {
  return (
    <main>
      <Head>
        <title>{postData.title}</title>
      </Head>

      <h1>{postData.title}</h1>

      <p>{postData.body}</p>

      <Link href="/">Go back to home</Link>
    </main>
  );
};

export default Post;
