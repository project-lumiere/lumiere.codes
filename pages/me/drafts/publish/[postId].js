import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@components/layouts/Layout';
import prisma from '@lib/prisma';
import { compileMdx } from '@lib/mdxBundler';
import { getMDXComponent } from 'mdx-bundler/client';
import MDXComponents from '@components/editor/MDXComponents';

export default function Publish({ post }) {
  const router = useRouter();
  const [tags, setTag] = useState([]);

  const publishPost = async (event) => {
    try {
      event.preventDefault();
      const newTitle = event.target.title.value;
      const description = event.target.desc.value;
      const tagList = tags;
      const { slug } = post;
      const body = { slug, newTitle, description, tagList };
      console.log(body);
      await fetch('/api/post/publish', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await router.push('/me/drafts');
    } catch (error) {
      console.error(`error aaa: ${error}`);
    }
  };

  const addTag = async (event) => {
    event.preventDefault();
    if (event.target.tagInput.value !== '')
      setTag([...tags, event.target.tagInput.value]);
    event.target.tagInput.value = '';
  };

  const Component = useMemo(() => getMDXComponent(post.code), [post.code]);

  return (
    <>
      <Head>
        <title>Publish - Lumiere</title>
      </Head>

      <form onSubmit={publishPost}>
        <button
          type="submit"
          className="p-3.5 mb-4 text-3xl text-gray-200 duration-200 border border-gray-300 rounded-xl hover:text-green-600 hover:border-green-600"
        >
          Publish
        </button>
        <input
          id="title"
          className="w-full p-4 mb-3 text-3xl text-gray-100 bg-gray-800 outline-none rounded-xl"
          placeholder="Title"
          autoComplete="off"
          defaultValue={post.title}
        />
        <input
          id="desc"
          className="w-full p-3 mb-3 text-gray-100 bg-gray-800 outline-none rounded-xl"
          placeholder="Enter a small caption/description"
          autoComplete="off"
        />
        <div className="flex flex-row items-center justify-start my-2">
          <Image
            src={post.author.image}
            width={35}
            height={35}
            className="rounded-full "
            alt={`${post.author.username}s profile picture`}
          />
          <p className="ml-3">Published by {post.author.username}</p>
        </div>
        <div className="py-2 mb-4">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline w-full px-4 py-2 mr-4 text-purple-400 duration-200 border border-purple-400 hover:border-pink-600 rounded-xl hover:text-pink-600 hover:cursor-pointer"
            >
              <div className="inline-block my-3">
                <button
                  onClick={() => {
                    setTag(tags.filter((tempTag) => tempTag !== tag));
                  }}
                  type="button"
                  className="mr-4 text-red-700 duration-200 hover:text-red-400"
                >
                  X
                </button>
                <p className="inline">{tag}</p>
              </div>
            </div>
          ))}
        </div>
      </form>
      <form onSubmit={addTag} className="pb-6 mb-6 border-b-2 border-gray-500">
        <input
          id="tagInput"
          className="p-3 mb-3 mr-2 text-gray-100 bg-gray-800 outline-none rounded-xl"
          placeholder="Enter a tag"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-2.5 py-1 mb-4 text-gray-300 duration-200 border border-gray-400 rounded-xl hover:text-pink-600 hover:border-pink-600"
        >
          Add tag
        </button>
      </form>
      <Component components={MDXComponents} />
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { postId } = params;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
    },
  });

  const { code, frontmatter } = await compileMdx(post.content);

  post.code = code;
  post.frontmatter = frontmatter;

  post.createdAt = String(post.createdAt);
  post.updatedAt = String(post.updatedAt);

  return {
    props: { post },
  };
};

Publish.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
