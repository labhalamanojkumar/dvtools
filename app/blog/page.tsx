import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Tools Blog | Malti Tool Platform',
  description: 'A blog about developer tools, productivity, and best practices, with guides on everything from JWT decoders to performance profilers.',
  keywords: [
    "developer tools", "blog", "tutorials", "guides", "SEO", "performance",
    "security", "json", "jwt", "css", "image optimization", "data generation"
  ],
  openGraph: {
    title: 'Developer Tools Blog | Malti Tool Platform',
    description: 'In-depth guides and articles on a wide range of developer tools.',
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/og-image-blog.png', // Make sure to create this image
        width: 1200,
        height: 630,
        alt: 'Malti Tool Platform Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Tools Blog | Malti Tool Platform',
    description: 'In-depth guides and articles on a wide range of developer tools.',
    images: ['/og-image-blog.png'],
  },
};


async function getPosts() {
  const blogDir = path.join(process.cwd(), 'app', 'blog');
  const directories = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== '[slug]');

  const posts = directories.map(dirent => {
    const slug = dirent.name;
    const filePath = path.join(blogDir, slug, 'page.mdx');
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title || 'Untitled Post',
      description: data.description || '',
      date: data.date ? new Date(data.date) : new Date(),
      keywords: data.keywords || [],
    };
  }).filter((post): post is NonNullable<typeof post> => post !== null);

  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div>
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          The Malti Tool Platform Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Insights, guides, and updates on developer tools and productivity.
        </p>
      </header>

      <div className="grid gap-8">
        {posts.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.slug} legacyBehavior>
            <a className="block group">
              <Card className="hover:border-primary transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold group-hover:text-primary transition-colors duration-300">{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {format(post.date, 'MMMM d, yyyy')}
                  </p>
                  <CardDescription className="mt-3 text-base">
                    {post.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
