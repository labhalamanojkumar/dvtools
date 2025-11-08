import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center space-x-3 group">
              <Logo size="md" variant="gradient" className="group-hover:scale-105 transition-transform duration-200" />
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                DvTools
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional developer tools for modern web development. Fast,
              secure, and privacy-focused.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tools/json-formatter"
                  className="text-muted-foreground hover:text-primary"
                >
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/base64"
                  className="text-muted-foreground hover:text-primary"
                >
                  Base64 Encoder
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/jwt-decoder"
                  className="text-muted-foreground hover:text-primary"
                >
                  JWT Decoder
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/regexp-tester"
                  className="text-muted-foreground hover:text-primary"
                >
                  RegExp Tester
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-muted-foreground hover:text-primary"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Logo size="sm" variant="minimal" className="inline" />
            © {new Date().getFullYear()} DvTools. All rights reserved.
          </div>
          <div className="mt-4 flex space-x-4 sm:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://www.linkedin.com/company/dvtools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
