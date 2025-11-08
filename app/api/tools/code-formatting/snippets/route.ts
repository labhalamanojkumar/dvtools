import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { getLanguageFromFileName } from "@/lib/utils";

interface Snippet {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  code: string;
  tags: string[];
  created_at: string;
}

interface FileUpload {
  name: string;
  content: string;
}

const SNIPPETS_FILE = join(process.cwd(), "data", "code-formatting-snippets.json");

// Ensure snippets file exists
async function ensureSnippetsFile() {
  try {
    await readFile(SNIPPETS_FILE, "utf-8");
  } catch (error) {
    // Create file with default snippets
    const defaultSnippets: Snippet[] = [
      {
        id: uuidv4(),
        name: "React Functional Component",
        description: "Basic React functional component with TypeScript",
        language: "typescript",
        category: "react",
        code: `import React from 'react';

interface Props {
  title: string;
  onClick?: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  return (
    <div className="my-component">
      <h1>{title}</h1>
      {onClick && (
        <button onClick={onClick}>
          Click me
        </button>
      )}
    </div>
  );
};

export default MyComponent;`,
        tags: ["react", "component", "typescript", "functional"],
        created_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Express.js Route Handler",
        description: "Basic Express.js route handler with error handling",
        language: "javascript",
        category: "javascript",
        code: `const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;`,
        tags: ["express", "api", "route", "nodejs"],
        created_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Python Class with Properties",
        description: "Python class with properties and methods",
        language: "python",
        category: "python",
        code: `class User:
    def __init__(self, name: str, email: str):
        self._name = name
        self._email = email

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, value: str) -> None:
        if not value:
            raise ValueError("Name cannot be empty")
        self._name = value

    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, value: str) -> None:
        if "@" not in value:
            raise ValueError("Invalid email address")
        self._email = value

    def __str__(self) -> str:
        return f"User(name='{self._name}', email='{self._email}')"

# Usage
user = User("John Doe", "john@example.com")
print(user)`,
        tags: ["python", "class", "properties", "oop"],
        created_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "CSS Flexbox Layout",
        description: "Responsive flexbox layout with CSS Grid fallback",
        language: "css",
        category: "css",
        code: `.container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}

.item {
  flex: 1 1 300px;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* CSS Grid fallback for older browsers */
@supports not (display: flex) {
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
}`,
        tags: ["css", "flexbox", "layout", "responsive"],
        created_at: new Date().toISOString(),
      },
    ];

    await writeFile(SNIPPETS_FILE, JSON.stringify(defaultSnippets, null, 2), "utf-8");
  }
}

export async function GET() {
  try {
    await ensureSnippetsFile();
    const data = await readFile(SNIPPETS_FILE, "utf-8");
    const snippets: Snippet[] = JSON.parse(data);

    return NextResponse.json({
      success: true,
      snippets,
    });

  } catch (error: any) {
    console.error("Snippets GET error:", error);
    return NextResponse.json(
      { error: "Failed to load snippets", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, language, category, code, tags, files } = body;

    await ensureSnippetsFile();
    const data = await readFile(SNIPPETS_FILE, "utf-8");
    const snippets: Snippet[] = JSON.parse(data);
    
    if (files) {
      // Handle file uploads
      const uploadedFiles = files as FileUpload[];
      const newSnippets: Snippet[] = uploadedFiles.map(file => ({
        id: uuidv4(),
        name: file.name.split(".")[0], // Use filename without extension as name
        description: description || "Imported from file",
        language: getLanguageFromFileName(file.name),
        category: category || "general",
        code: file.content,
        tags: tags || [],
        created_at: new Date().toISOString(),
      }));

      snippets.push(...newSnippets);
      await writeFile(SNIPPETS_FILE, JSON.stringify(snippets, null, 2), "utf-8");

      return NextResponse.json({
        success: true,
        snippets: newSnippets,
      });
    } else {
      // Handle direct snippet creation
      if (!name || !code) {
        return NextResponse.json(
          { error: "Name and code are required" },
          { status: 400 }
        );
      }

      const newSnippet: Snippet = {
        id: uuidv4(),
        name,
        description: description || "",
        language: language || "javascript",
        category: category || "general",
        code,
        tags: tags || [],
        created_at: new Date().toISOString(),
      };

      snippets.push(newSnippet);
      await writeFile(SNIPPETS_FILE, JSON.stringify(snippets, null, 2), "utf-8");

      return NextResponse.json({
        success: true,
        snippet: newSnippet,
      });
    }
  } catch (error: any) {
    console.error("Snippets POST error:", error);
    return NextResponse.json(
      { error: "Failed to save snippet", details: error.message },
      { status: 500 }
    );
  }
}