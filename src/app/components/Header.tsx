"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link href="/" aria-label="Go to homepage">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
        <NavLink href="/whats-new" pathname={pathname}>
          See what&apos;s new! 🎉
        </NavLink>
        <NavLink href="/dashboard" pathname={pathname}>
          Forms
        </NavLink>
        <NavLink href="/account" pathname={pathname}>
          Account
        </NavLink>
        <NavLink href="/docs" pathname={pathname}>
          Docs
        </NavLink>
      </nav>

      {/* Right: Session Management */}
      <div className="flex items-center gap-4">
        {status === "loading" && (
          <span className="text-gray-500 text-sm">Loading...</span>
        )}

        {status === "authenticated" ? (
          <>
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            {session?.user?.name && (
              <span className="text-gray-600 text-sm">Hi, {session.user.name}!</span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
              aria-label="Log out"
            >
              Log out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            aria-label="Sign in"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-gray-700 focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-md border-t md:hidden">
          <ul className="flex flex-col gap-4 p-4">
            <li>
              <NavLink href="/whats-new" pathname={pathname} onClick={toggleMobileMenu}>
                See what&apos;s new! 🎉
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard" pathname={pathname} onClick={toggleMobileMenu}>
                Forms
              </NavLink>
            </li>
            <li>
              <NavLink href="/account" pathname={pathname} onClick={toggleMobileMenu}>
                Account
              </NavLink>
            </li>
            <li>
              <NavLink href="/docs" pathname={pathname} onClick={toggleMobileMenu}>
                Docs
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function NavLink({
  href,
  pathname,
  children,
  onClick,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`hover:text-blue-600 ${
        isActive ? "text-blue-600 font-bold" : "text-gray-700"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}