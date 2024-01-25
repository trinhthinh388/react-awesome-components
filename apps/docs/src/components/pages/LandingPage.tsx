import Link from 'next/link';

export const LandingPage = () => {
  return (
    <main className="relative overflow-hidden z-10 pt-12 md:pt-40 xl:pt-45 h-[calc(100vh_-_64px_-_205px)] mb-12">
      <div className="mx-auto max-w-[900px] px-4 sm:px-8 xl:px-0 relative z-1">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold sm:text-6xl xl:text-heading-1">
            A collection of{' '}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
              Awesome
            </span>{' '}
            React components and hooks.
          </h1>
          <p className="max-w-[600px] mx-auto mb-9 md:text-lg">
            You're looking for a component or a hook to use in your next React
            project. Look no further React Awesome Components got you covered.
          </p>

          <Link
            className="inline-block bg-gradient-to-r from-[#238aff] to-[#07f] rounded-full text-white [text-shadow:_0_1px_1px_#00387838] [box-shadow:_0_1px_2px_#00295738] px-6 py-3 text-[min(1.3rem,max(3.5vw,1.2rem))] leading-[1.6] hover:[box-shadow:_0_5px_30px_-10px_#0078ffab] [filter:_brightness(1.05)] transition-[all_.2s_ease]"
            href="/docs"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
};
