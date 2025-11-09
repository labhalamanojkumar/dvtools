"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/ui/logo";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  BarChart3,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Tools", href: "/tools" },
  { name: "Blog", href: "/blog" },
  { name: "News", href: "/news" },
  { name: "Docs", href: "/docs" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Donate", href: "/donate" },
  { name: "Contact", href: "/contact" },
  { name: "Feedback", href: "/feedback" },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center space-x-3 group">
          <Logo size="md" variant="gradient" className="group-hover:scale-105 transition-transform duration-200" />
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            DvTools
          </span>
        </a>

        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              suppressHydrationWarning
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />

          <Button variant="outline" size="sm" asChild className="hidden md:flex">
            <a href="/donate" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Donate</span>
            </a>
          </Button>

          {status === "loading" || !mounted ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                    {isAdmin && mounted && (
                      <p className="text-xs leading-none text-primary font-medium">
                        Administrator
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </DropdownMenuItem>
                {isAdmin && mounted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </a>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault();
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/auth/signin">Sign In</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/auth/signup">Sign Up</a>
              </Button>
            </div>
          )}

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
                suppressHydrationWarning
              >
                {item.name}
              </a>
            ))}
            <div className="px-3 py-2">
              <Button asChild variant="outline" className="w-full mb-2">
                <a
                  href="/donate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Support Us</span>
                </a>
              </Button>
            </div>
            <div className="px-3 py-2 space-y-2">
              {session && mounted ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="text-xs">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {session.user?.name}
                      </p>
                      {isAdmin && mounted && (
                        <p className="text-xs text-primary">Administrator</p>
                      )}
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>
                  </Button>
                  {isAdmin && mounted && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <a
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </a>
                  </Button>
                  <Button asChild className="w-full">
                    <a
                      href="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
