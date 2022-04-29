import Head from 'next/head';
import prisma from '@lib/prisma';
import Layout from '@components/layouts/Layout';

export default function Query(props) {
  return (
    <>
      <Head>
        <title>{props.query} — Lumiere</title>
      </Head>

      <>

      </>

    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { query } = params;
  
  const posts = await prisma.post.findMany({
    where: {
      tags: {
        has: query
      }
    }
  });

  posts.forEach((post) => {
    post.createdAt = String(post.createdAt);
    post.updatedAt = String(post.updatedAt);
  });

  return {
    props: {
      query,
      posts
    }
  }
}

Query.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}