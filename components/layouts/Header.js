import NavItem from '@components/layouts/NavItem';
import Avatar from '@components/ui/Avatar';
import { Gradient } from '@lib/gradient';
import projectLumiere from '@public/images/logos/ProjectLumiere.svg';
import { signIn, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { route } from 'next/dist/server/router';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { useMediaQuery } from 'react-responsive';

const menuItems = [{ name: 'Publications', link: '/press' }];

export default function Header({ pageType }) {
  useEffect(() => {
    if (!(pageType === 'home')) {
      const gradient = new Gradient();
      gradient.initGradient('.header-gradient-canvas');
    }
  }, [pageType]);

  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 889 });
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const searchQuery = async (event) => {
    event.preventDefault();
    const query = event.target.search.value;
    await router.push(`/search/${query}`);
    event.target.search.value = '';
  }


  if (pageType === 'home') {
    // Home page header — includes several differences for the home page
    return (
      <header className="sticky top-0 z-40 flex items-center bg-gray-900 border-b border-gray-700 bg-opacity-90 backdrop-filter backdrop-blur-sm backdrop-saturate-200 h-18 lg:h-16">
        <div className="container flex items-center">
          <div className="pr-8 border-r border-gray-600 lg:pr-7 md:border-0 md:pr-0">
            <Link href="/">
              <a>
                <figure className="flex items-center group">
                  <div className="relative mr-1.5 mb-0.5 w-10 h-10 lg:w-8 lg:h-8">
                    <Image
                      src={projectLumiere}
                      alt="Project Lumiere logo"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <figcaption className="mb-1 font-serif text-3xl leading-none text-gray-300 transition-colors duration-200 lg:text-2xl group-hover:text-gray-200 lg:mb-0.5">
                    Lumiere
                  </figcaption>
                </figure>
              </a>
            </Link>
          </div>

          {/* Menu bar for large screens */}
          <nav className="flex mt-1 space-x-5 text-sm md:hidden">
            {!isMobile &&
              menuItems.map((item) => (
                <NavItem
                  title={item.name}
                  link={item.link ? item.link : undefined}
                  contents={item.contents ? item.contents : undefined}
                  key={item.name}
                />
              ))}
          </nav>
          <form
            className="relative flex items-center ml-auto mr-7 lg:mr-6 md:hidden beta"
            onSubmit={searchQuery}
          >
            <input
              type="text"
              name="search"
              placeholder="Search for anything"
              autoComplete="off"
              className={`py-3 lg:py-2.5 rounded-lg border-2 bg-transparent ${
                session ? 'pr-18 lg:pr-14' : 'pr-9 lg:pr-8'
              } pl-4 text-sm border-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 hover:border-gray-600 placeholder-gray-500`}
            />
            <FiSearch className="absolute right-0 w-6 h-6 mr-4 text-gray-600" />
          </form>
          {session ? (
            <Avatar renderPosition="container" />
          ) : (
            <button
              type="button"
              className="px-5 py-3 text-sm lg:text-xs button-primary lg:px-4 lg:py-2.5 md:hidden"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          )}

          {/* Menu bar for small screens */}
          <button
            type="button"
            className="hidden w-12 h-8 ml-auto transition bg-gray-500 place-items-center rounded-2xl opacity-80 md:grid hover:bg-gray-400 hover:opacity-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <IoReorderThreeOutline className="w-6 text-gray-100 h-7" />
          </button>
        </div>
        <div
          className={`fixed top-0 z-50 w-screen h-screen bg-gray-900 bg-opacity-95 mt-16 p-5 space-y-5 ${
            isOpen && isMobile ? '' : 'hidden'
          }`}
        >
          {isMobile &&
            menuItems.map((item) => (
              <NavItem
                title={item.name}
                link={item.link ? item.link : undefined}
                contents={item.contents ? item.contents : undefined}
                key={item.name}
              />
            ))}
          {session ? (
            <Avatar pageType="mobile" />
          ) : (
            <button
              type="button"
              className="px-5 py-3 text-sm lg:text-xs button-primary lg:px-4 lg:py-2.5"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          )}
          <button
            type="button"
            className="flex items-center space-x-2 heading-tertiary"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FiSun /> : <FiMoon />}
            <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
          </button>
        </div>
      </header>
    );
  }

  // Default header — for everything else
  return (
    <header className="sticky top-0 z-40 flex items-center mb-16 bg-gray-900 border-b border-gray-700 h-18 lg:h-16">
      <div className="absolute z-0 w-full h-full -mt-60 lg:-mt-64">
        <div className="relative h-48">
          <canvas
            className="absolute top-0 header-gradient-canvas"
            data-js-darken-top
            data-transition-in
          />
        </div>
      </div>
      <div className="container z-40 flex items-center">
        <div className="pr-8 border-r border-gray-600 lg:pr-7 md:border-0 md:pr-0">
          <Link href="/">
            <a>
              <figure className="flex items-center group">
                <div className="relative mr-1.5 mb-0.5 w-10 h-10 lg:w-8 lg:h-8">
                  <Image
                    src={projectLumiere}
                    alt="Project Lumiere logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <figcaption className="mb-1 font-serif text-3xl leading-none text-gray-300 transition-colors duration-200 lg:text-2xl group-hover:text-gray-200 lg:mb-0.5">
                  Lumiere
                </figcaption>
              </figure>
            </a>
          </Link>
        </div>

        {/* Menu bar for large screens */}
        <nav className="flex mt-1 space-x-5 text-sm md:hidden">
          {!isMobile &&
            menuItems.map((item) => (
              <NavItem
                title={item.name}
                link={item.link ? item.link : undefined}
                contents={item.contents ? item.contents : undefined}
                key={item.name}
              />
            ))}
        </nav>
        <form className="relative flex items-center ml-auto mr-7 lg:mr-6 md:hidden beta" onSubmit={searchQuery}>
          <input
            id="search"
            type="text"
            name="search"
            placeholder="Search for anything"
            autoComplete="off"
            className={`text-field ${
              session ? 'pr-18 lg:pr-14' : 'pr-9 lg:pr-8'
            } border-gray-700`}
          />
          <FiSearch className="absolute right-0 w-6 h-6 mr-4 text-gray-600" />
        </form>
        {session ? (
          <Avatar renderPosition="container" />
        ) : (
          <button
            type="button"
            className="px-5 py-3 text-sm lg:text-xs button-primary lg:px-4 lg:py-2.5 md:hidden"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}

        {/* Menu bar for small screens */}
        <button
          type="button"
          className="hidden w-12 h-8 ml-auto transition bg-gray-500 place-items-center rounded-2xl opacity-80 md:grid hover:bg-gray-400 hover:opacity-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IoReorderThreeOutline className="w-6 text-gray-100 h-7" />
        </button>
      </div>

      <div
        className={`fixed top-0 z-50 w-screen h-screen bg-gray-900 opacity-95 mt-16 p-5 space-y-5 ${
          isOpen && isMobile ? '' : 'hidden'
        }`}
      >
        {isMobile &&
          menuItems.map((item) => (
            <NavItem
              title={item.name}
              link={item.link ? item.link : undefined}
              contents={item.contents ? item.contents : undefined}
              key={item.name}
            />
          ))}
        {session ? (
          <Avatar pageType="mobile" />
        ) : (
          <button
            type="button"
            className="px-5 py-3 text-sm lg:text-xs button-primary lg:px-4 lg:py-2.5"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}
        <button
          type="button"
          className="flex items-center space-x-2 heading-tertiary"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FiSun /> : <FiMoon />}
          <p>Toggle theme</p>
        </button>
      </div>
    </header>
  );
}
