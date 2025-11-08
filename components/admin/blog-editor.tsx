'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Save,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (post: PostData) => Promise<void>
  initialData?: PostData
  mode: 'create' | 'edit'
}

interface PostData {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  type: string
  status: string
  metaTitle: string
  metaDescription: string
  featured: boolean
  isPinned: boolean
  allowComments: boolean
  tags: string[]
  categories: string[]
}

export default function BlogEditor({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}: BlogEditorProps) {
  const [formData, setFormData] = useState<PostData>(
    initialData || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      type: 'BLOG',
      status: 'DRAFT',
      metaTitle: '',
      metaDescription: '',
      featured: false,
      isPinned: false,
      allowComments: true,
      tags: [],
      categories: [],
    }
  )
  const [activeTab, setActiveTab] = useState('write')
  const [isSaving, setIsSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData({ ...formData, title, slug, metaTitle: title })
  }

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end) || placeholder
    const beforeText = formData.content.substring(0, start)
    const afterText = formData.content.substring(end)

    let newText = ''
    switch (syntax) {
      case 'bold':
        newText = `${beforeText}**${selectedText}**${afterText}`
        break
      case 'italic':
        newText = `${beforeText}_${selectedText}_${afterText}`
        break
      case 'underline':
        newText = `${beforeText}<u>${selectedText}</u>${afterText}`
        break
      case 'h1':
        newText = `${beforeText}# ${selectedText}${afterText}`
        break
      case 'h2':
        newText = `${beforeText}## ${selectedText}${afterText}`
        break
      case 'h3':
        newText = `${beforeText}### ${selectedText}${afterText}`
        break
      case 'ul':
        newText = `${beforeText}\n- ${selectedText}\n${afterText}`
        break
      case 'ol':
        newText = `${beforeText}\n1. ${selectedText}\n${afterText}`
        break
      case 'link':
        newText = `${beforeText}[${selectedText}](url)${afterText}`
        break
      case 'image':
        newText = `${beforeText}![${selectedText}](image-url)${afterText}`
        break
      case 'code':
        newText = `${beforeText}\`${selectedText}\`${afterText}`
        break
      case 'quote':
        newText = `${beforeText}\n> ${selectedText}\n${afterText}`
        break
      default:
        return
    }

    setFormData({ ...formData, content: newText })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()],
      })
      setCategoryInput('')
    }
  }

  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== category),
    })
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }

    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required')
      return
    }

    setIsSaving(true)
    try {
      await onSave(formData)
      toast.success(
        mode === 'create'
          ? 'Post created successfully'
          : 'Post updated successfully'
      )
      onClose()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Post' : 'Edit Post'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new blog post or news article with rich formatting'
              : 'Update your blog post or news article'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Post Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLOG">Blog Post</SelectItem>
                  <SelectItem value="NEWS">News Article</SelectItem>
                  <SelectItem value="UPDATE">Platform Update</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                  <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                  <SelectItem value="ARTICLE">Article</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief summary of the post..."
                rows={3}
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-2">
                {/* Markdown Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/30">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('h1', 'Heading 1')}
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('h2', 'Heading 2')}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('h3', 'Heading 3')}
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-8 bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('bold', 'bold text')}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('italic', 'italic text')}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('underline', 'underlined text')}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-8 bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('ul', 'list item')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('ol', 'list item')}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('quote', 'quote text')}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-8 bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('link', 'link text')}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('image', 'alt text')}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('code', 'code')}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>

                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your post content here using Markdown..."
                  rows={15}
                  className="font-mono"
                />
              </TabsContent>

              <TabsContent value="preview">
                <div className="border rounded-md p-6 min-h-[400px] prose dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.content || '*No content yet...*'}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Tags and Categories */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tags..."
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex gap-2">
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  placeholder="Add categories..."
                />
                <Button type="button" onClick={addCategory}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Meta */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">SEO Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  placeholder="SEO title (auto-filled from title)"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                  placeholder="SEO description..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Publish Options */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Publish Options</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) =>
                    setFormData({ ...formData, isPinned: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isPinned">Pin to Top</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowComments"
                  checked={formData.allowComments}
                  onChange={(e) =>
                    setFormData({ ...formData, allowComments: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="allowComments">Allow Comments</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
