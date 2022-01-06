import { Dialog, Transition, Tab } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function Join() {
  let [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <>
      <button onClick={open} className="btn">
        Join
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog className="fixed inset-0 z-10 overflow-y-auto" onClose={close}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg text-center font-medium leading-6 text-gray-900">
                  Join the zone
                </Dialog.Title>
                <div className="my-6 w-full flex justify-center">
                  <a
                    className="btn hover:text-white hover:cursor-pointer hover:no-underline flex items-center space-x-2 px-6"
                    href={`https://api.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`}
                  >
                    <span>
                      <svg
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </span>
                    <span>Sign In With Instagram</span>
                  </a>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 text-center">
                    Please note that only tattoo-artists should sign-up and make an account. If you are a customer, you
                    can just use this site anonymously.
                  </p>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
