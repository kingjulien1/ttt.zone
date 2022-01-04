import { Transition } from "@headlessui/react";

function Error({ statusCode }) {
  return (
    <section className="w-screen h-screen flex justify-center items-center ">
      <Transition
        enter="transform transition duration-[600ms]"
        enterFrom="opacity-0 translate-y-20"
        enterTo="opacity-100 rotate-0 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 scale-95 "
        appear
        show
      >
        <h1 className="text-8xl font-bold ">{statusCode}</h1>
        <Transition.Child>
          <p className="mt-6 text-sm font-light text-center">
            Sorry, {statusCode === 404 ? "Not found." : "Something went wrong."}
          </p>
        </Transition.Child>
      </Transition>
    </section>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
