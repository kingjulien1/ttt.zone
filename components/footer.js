import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  // links in form {{href}:{title}}
  const [links] = useState({
    ["/"]: "Home",
    about: "About",
    conact: "Contact",
    legal: "Legal",
  });

  return (
    <footer className="w-screen py-10 space-y-8 bg-black text-neutral-500 text-sm">
      <ul className="w-full flex justify-center space-x-8">
        {Object.keys(links).map((href) => (
          <li>
            <Link href={href}>
              <a>{links[href]}</a>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="w-full flex justify-center space-x-8">
        <li>
          <a
            href="https://github.com/kingjulien1/ttt.zone"
            target="_blank"
            className="icon-btn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </li>
        <li>
          <ColorModeToggle />
        </li>
      </ul>
      <div className="w-full flex justify-center">
        <span className="text-sm">made with ❤️ by kingjulien1</span>
      </div>
    </footer>
  );
}

function ColorModeToggle() {
  return (
    <button className="icon-btn hover:text-rose-500">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  );
}
