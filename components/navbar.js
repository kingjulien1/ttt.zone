import { useAuthStore } from "@/lib/state/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import Join from "./join";

export default function NavBar() {
  const token = useAuthStore((state) => state.token);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !!token) setIsLoggedIn(true);
    else if (typeof window !== "undefined" && !token) setIsLoggedIn(false);
  }, [token]);

  return (
    <nav className="absolute top-0 w-screen p-4">
      <ul className="flex justify-between items-center">
        <li className="font-bold text-sm">
          <Link href="/">
            <a>ttt.zone</a>
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <a href="/profile" className="text-sm font-bold">
              Profile
            </a>
          ) : (
            <Join />
          )}
        </li>
      </ul>
    </nav>
  );
}
