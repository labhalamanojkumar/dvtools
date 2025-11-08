import { NextRequest, NextResponse } from "next/server";
import * as yaml from "js-yaml";

interface PipelineJob {
  name: string;
  stage: string;
  status: "success" | "failed" | "running" | "pending";
  duration?: string;
  startedAt?: string;
}

interface PipelineRun {
  id: string;
  status: "success" | "failed" | "running" | "pending";
  branch: string;
  commit: string;
  duration: string;
  startedAt: string;
  jobs: PipelineJob[];
}

interface Artifact {
  name: string;
  size: string;
  type: string;
  job: string;
  createdAt: string;
}

// Validate pipeline configuration
function validatePipelineConfig(config: string, platform: string): string[] {
  const errors: string[] = [];

  try {
    // Parse YAML (skip for Jenkinsfile)
    if (platform !== "jenkins") {
      yaml.load(config);
    }
  } catch (error: any) {
    errors.push(`YAML syntax error: ${error.message}`);
    return errors;
  }

  // Platform-specific validation
  if (platform === "gitlab") {
    if (!config.includes("stages:")) {
      errors.push("GitLab CI requires 'stages' definition");
    }
    if (!config.match(/^\w+-job:/m)) {
      errors.push("No jobs defined in pipeline");
    }
    if (config.includes("script:") && !config.match(/script:\s*\n\s*-/)) {
      errors.push("Jobs must have script commands");
    }
  } else if (platform === "github") {
    if (!config.includes("on:")) {
      errors.push("GitHub Actions requires 'on' trigger definition");
    }
    if (!config.includes("jobs:")) {
      errors.push("GitHub Actions requires 'jobs' definition");
    }
    if (!config.match(/runs-on:/)) {
      errors.push("Jobs must specify 'runs-on' runner");
    }
  } else if (platform === "jenkins") {
    if (!config.includes("pipeline {")) {
      errors.push("Jenkins requires 'pipeline' block");
    }
    if (!config.includes("agent")) {
      errors.push("Pipeline must specify 'agent'");
    }
    if (!config.includes("stages {")) {
      errors.push("Pipeline must have 'stages' definition");
    }
  }

  // Common validations
  if (config.length < 20) {
    errors.push("Pipeline configuration is too short");
  }

  if (config.includes("TODO") || config.includes("FIXME")) {
    errors.push("Pipeline contains TODO or FIXME comments");
  }

  return errors;
}

// Mock pipeline run history
function getMockRunHistory(platform: string): PipelineRun[] {
  const runs: PipelineRun[] = [
    {
      id: "12345",
      status: "success",
      branch: "main",
      commit: "abc123f",
      duration: "5m 32s",
      startedAt: "2024-01-15 10:30:00",
      jobs: [
        { name: "build", stage: "build", status: "success", duration: "2m 15s" },
        { name: "test", stage: "test", status: "success", duration: "1m 45s" },
        { name: "deploy", stage: "deploy", status: "success", duration: "1m 32s" }
      ]
    },
    {
      id: "12344",
      status: "failed",
      branch: "feature/new-api",
      commit: "def456a",
      duration: "3m 12s",
      startedAt: "2024-01-15 09:15:00",
      jobs: [
        { name: "build", stage: "build", status: "success", duration: "2m 10s" },
        { name: "test", stage: "test", status: "failed", duration: "1m 02s" }
      ]
    },
    {
      id: "12343",
      status: "success",
      branch: "main",
      commit: "ghi789b",
      duration: "6m 05s",
      startedAt: "2024-01-14 16:45:00",
      jobs: [
        { name: "build", stage: "build", status: "success", duration: "2m 20s" },
        { name: "test", stage: "test", status: "success", duration: "1m 50s" },
        { name: "deploy", stage: "deploy", status: "success", duration: "1m 55s" }
      ]
    },
    {
      id: "12342",
      status: "running",
      branch: "develop",
      commit: "jkl012c",
      duration: "2m 30s",
      startedAt: "2024-01-15 11:00:00",
      jobs: [
        { name: "build", stage: "build", status: "success", duration: "2m 05s" },
        { name: "test", stage: "test", status: "running" }
      ]
    }
  ];

  return runs;
}

// Mock artifacts
function getMockArtifacts(platform: string): Artifact[] {
  return [
    {
      name: "dist.tar.gz",
      size: "12.5 MB",
      type: "archive",
      job: "build",
      createdAt: "2024-01-15 10:32:00"
    },
    {
      name: "test-results.xml",
      size: "145 KB",
      type: "test-report",
      job: "test",
      createdAt: "2024-01-15 10:34:00"
    },
    {
      name: "coverage-report.html",
      size: "2.3 MB",
      type: "coverage",
      job: "test",
      createdAt: "2024-01-15 10:34:00"
    },
    {
      name: "build.log",
      size: "456 KB",
      type: "log",
      job: "build",
      createdAt: "2024-01-15 10:32:00"
    },
    {
      name: "docker-image.tar",
      size: "156 MB",
      type: "image",
      job: "build",
      createdAt: "2024-01-15 10:33:00"
    },
    {
      name: "deployment-manifest.yaml",
      size: "8 KB",
      type: "config",
      job: "deploy",
      createdAt: "2024-01-15 10:36:00"
    }
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config, platform } = body;

    switch (action) {
      case "validate": {
        if (!config || typeof config !== "string") {
          return NextResponse.json(
            { error: "Configuration is required" },
            { status: 400 }
          );
        }

        const errors = validatePipelineConfig(config, platform || "gitlab");
        return NextResponse.json({ errors });
      }

      case "getRunHistory": {
        const runs = getMockRunHistory(platform || "gitlab");
        return NextResponse.json({ runs });
      }

      case "getArtifacts": {
        const artifacts = getMockArtifacts(platform || "gitlab");
        return NextResponse.json({ artifacts });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("CI/CD pipeline editor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
