import { useRouter } from 'next/router';
import Image from 'next/image';
import { getTimeAndDate } from '@lib/utilities/formatDate';
import Link from 'next/link';
import { FaPen, FaClock } from 'react-icons/fa';
import Article from '@components/ui/Article';

export default function Publication({ post, visibility }) {
  const router = useRouter();

  const unpublishPost = async (slug) => {
    try {
      const body = { slug };
      await fetch('/api/post/unpublish', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await router.push('/me/publications');
    } catch (error) {
      console.error(error);
    }
  };

  const editPost = async (slug) => {
    router.push(`/me/publications/${slug}`);
  };

  const deletePost = async (slug) => {
    try {
      const body = { slug };
      await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await router.push('/me/publications');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article>
      <Link href={`/${post.author.username}/${post.slug}`} passHref>
        <Article title={`View ${post.title}`}>
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="mb-2">{post.desc}</p>
          <div className="mb-2">
            {post.tags.map((tag) => (
              <div
                key={tag}
                className="inline w-full px-2 py-1 mr-2 text-purple-400 duration-200 border border-purple-400 hover:border-pink-600 rounded-xl hover:text-pink-600 hover:cursor-pointer"
              >
                <div className="inline-block my-1">
                  <p className="inline">{tag}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center my-2 space-x-2">
            <Image
              src={post.author.image}
              alt={`Image of ${post.author.username}`}
              className="rounded-full"
              width={40}
              height={40}
            />
            <Link href={`/${post.author.username}`} passHref>
              <p className="text-gray-300 duration-200 cursor-pointer hover:text-pink-600">
                {post.author.username}
              </p>
            </Link>
          </div>
          <span className="text-base text-gray-500">
            <p className="flex items-center">
              <FaPen className="inline mr-2" />
              Created on {getTimeAndDate(post.createdAt)}
            </p>
            <p className="flex items-center">
              <FaClock className="inline mr-2" />
              Updated on {getTimeAndDate(post.updatedAt)}
            </p>
          </span>
        </Article>
      </Link>
      {visibility === 'private' && (
        <div className="flex flex-row mt-2 space-x-2">
          <button
            type="button"
            className="p-2.5 button-tertiary"
            onClick={() => editPost(post.slug)}
          >
            Edit
          </button>
          <button
            type="button"
            className="p-2.5 button-tertiary"
            onClick={() => unpublishPost(post.slug)}
          >
            Unpublish
          </button>
          <button
            type="button"
            className="p-2.5 button-danger"
            onClick={() => deletePost(post.slug)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
