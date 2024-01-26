import Link from 'next/link';
import { ArrowRight, Code2, Rabbit, Feather, Server } from 'lucide-react';

const Card = ({
  title,
  icon,
  desc,
}: {
  title: string;
  icon: React.ReactNode;
  desc: string;
}) => {
  return (
    <div className="nextra-card max-w-64 nx-group nx-flex nx-flex-col nx-justify-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900">
      <span className="nx-flex flex-col nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 nx-flex nx-items-center">
        {icon}
        <span className="font-medium text-2xl mb-4">{title}</span>
        <span className="text-center font-normal">{desc}</span>
      </span>
    </div>
  );
};

export const LandingPage = () => {
  return (
    <main className="relative overflow-hidden z-10 pt-12 md:pt-40 xl:pt-45 mb-12">
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
            className="inline-flex items-center justify-between bg-gradient-to-r from-[#238aff] to-[#07f] rounded-full text-white [text-shadow:_0_1px_1px_#00387838] [box-shadow:_0_1px_2px_#00295738] px-6 py-3 text-[min(1.3rem,max(3.5vw,1.2rem))] leading-[1.6] hover:[box-shadow:_0_5px_30px_-10px_#0078ffab] [filter:_brightness(1.05)] transition-[all_.2s_ease]"
            href="/docs"
          >
            Get started
            <ArrowRight className="ml-2" size={24} />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 xl:px-0 relative z-1 pt-24 mb-12">
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center gap-8">
          <Card
            icon={<Code2 className="!w-12 !h-12" />}
            title="DX"
            desc="Intuitive, feature-complete API providing a seamless experience to developers."
          />

          <Card
            icon={<Rabbit className="!w-12 !h-12" />}
            title="Performance"
            desc="Minimizes the number of re-renders, minimizes validate computation, and faster mounting."
          />

          <Card
            icon={<Feather className="!w-12 !h-12" />}
            title="Light weight"
            desc="Package size matters. React Awesome Components won't make your node_modules heavier than the black hole."
          />

          <Card
            icon={<Server className="!w-12 !h-12" />}
            title="Server safe"
            desc="React Awesome Components can be used on both CSR and SSR application."
          />
        </div>
      </div>
    </main>
  );
};
