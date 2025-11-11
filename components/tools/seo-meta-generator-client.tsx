'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Download,
  Search,
  CheckCircle2,
  Globe,
  Share2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function SeoMetaGeneratorClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [author, setAuthor] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const { toast } = useToast();

  const generateMetaTags = () => {
    const basicMeta = `<!-- Basic Meta Tags -->
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="keywords" content="${keywords}" />
<meta name="author" content="${author}" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />`;

    const ogTags = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:site_name" content="${siteName}" />`;

    const twitterTags = `<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${image}" />
<meta property="twitter:creator" content="${twitterHandle}" />`;

    const jsonLd = `<!-- JSON-LD Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${title}",
  "description": "${description}",
  "url": "${url}",
  "image": "${image}",
  "author": {
    "@type": "Person",
    "name": "${author}"
  }
}
</script>`;

    return { basicMeta, ogTags, twitterTags, jsonLd };
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const downloadTags = () => {
    const { basicMeta, ogTags, twitterTags, jsonLd } = generateMetaTags();
    const allTags = `${basicMeta}\n\n${ogTags}\n\n${twitterTags}\n\n${jsonLd}`;
    
    const blob = new Blob([allTags], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'Meta tags downloaded as HTML file',
    });
  };

  const { basicMeta, ogTags, twitterTags, jsonLd } = generateMetaTags();

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Meta Tag Generator</h1>
          <p className="text-muted-foreground">
            Generate optimized meta tags for search engines and social media
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Search className="mr-1 h-3 w-3" />
          SEO Tools
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional SEO meta tag generator with OpenGraph and Twitter Card support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate comprehensive meta tags for improved SEO and social media sharing. Create OpenGraph tags, Twitter Cards, JSON-LD schema, and basic meta tags that help search engines understand and display your content properly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Generate basic meta tags</li>
                <li>• OpenGraph / Facebook tags</li>
                <li>• Twitter Card tags</li>
                <li>• JSON-LD structured data</li>
                <li>• Copy individual sections</li>
                <li>• Download complete file</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Globe className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Optimize website SEO</li>
                <li>• Social media sharing</li>
                <li>• Blog post metadata</li>
                <li>• Landing page optimization</li>
                <li>• Product page SEO</li>
                <li>• Content marketing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Information</CardTitle>
            <CardDescription>Enter your page details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Page"
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your page..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="space-y-2">
              <Label>Page URL *</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL *</Label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Website"
              />
            </div>

            <div className="space-y-2">
              <Label>Author</Label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Twitter Handle</Label>
              <Input
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@username"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Meta Tags</CardTitle>
              <CardDescription>Copy or download your meta tags</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="og">OpenGraph</TabsTrigger>
                  <TabsTrigger value="twitter">Twitter</TabsTrigger>
                  <TabsTrigger value="jsonld">JSON-LD</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-2">
                  <Textarea
                    value={basicMeta}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(basicMeta, 'Basic meta tags')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </TabsContent>

                <TabsContent value="og" className="space-y-2">
                  <Textarea
                    value={ogTags}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(ogTags, 'OpenGraph tags')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </TabsContent>

                <TabsContent value="twitter" className="space-y-2">
                  <Textarea
                    value={twitterTags}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(twitterTags, 'Twitter tags')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </TabsContent>

                <TabsContent value="jsonld" className="space-y-2">
                  <Textarea
                    value={jsonLd}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(jsonLd, 'JSON-LD schema')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </TabsContent>
              </Tabs>

              <Button onClick={downloadTags} className="w-full mt-4">
                <Download className="mr-2 h-4 w-4" />
                Download All Tags
              </Button>
            </CardContent>
          </Card>

          {image && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Social media preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <img src={image} alt="Preview" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{title || 'Page Title'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {description || 'Description will appear here'}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Share2 className="h-3 w-3 mr-1" />
                      {siteName || 'example.com'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
