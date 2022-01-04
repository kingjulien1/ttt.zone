import Link from "next/link";
import Join from "./join";

export default function NavBar() {
  return (
    <nav className="absolute top-0 w-screen p-4">
      <ul className="flex justify-between items-center">
        <li className="font-bold text-sm">
          <Link href="/">ttt.zone</Link>
        </li>
        <li>
          <Join />
        </li>
      </ul>
    </nav>
  );
}
