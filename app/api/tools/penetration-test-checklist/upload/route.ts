import { NextResponse } from 'next/server';

// Simple streaming upload handler for penetration test checklist files.
// Accepts multipart/form-data with a single 'file' field. Streams back
// newline-delimited JSON messages for real-time updates.

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create a readable stream that will emit JSON lines as processing happens
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const send = (obj: any) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

        send({ type: 'progress', message: 'Received file, starting processing', timestamp: Date.now() });

        try {
          const name = String((file as any).name || 'uploaded-file');
          const text = await file.text();

          // Try parsing JSON first - maybe it's an exported assessment
          let parsed: any = null;
          try {
            parsed = JSON.parse(text);
          } catch (e) {
            parsed = null;
          }

          if (parsed && parsed.checklist) {
            // Looks like a serialized Assessment - return it
            send({ type: 'progress', message: 'Recognized assessment JSON', timestamp: Date.now() });
            // Normalize minimal assessment object
            const assessment = {
              id: parsed.id || `import-${Date.now()}`,
              name: parsed.name || name,
              description: parsed.description || '',
              target: parsed.target || '',
              startDate: parsed.startDate || new Date().toISOString(),
              endDate: parsed.endDate || '',
              status: parsed.status || 'planning',
              checklist: Array.isArray(parsed.checklist) ? parsed.checklist.map((it: any, idx: number) => ({
                id: it.id || `cl-${idx}-${Date.now()}`,
                phase: it.phase || 'Scanning',
                category: it.category || 'Imported',
                title: it.title || it.name || `Imported Item ${idx+1}`,
                description: it.description || '',
                completed: !!it.completed,
                notes: it.notes || '',
                severity: it.severity || 'info',
              })) : [],
              issues: Array.isArray(parsed.issues) ? parsed.issues.map((is: any, idx: number) => ({
                id: is.id || `iss-${idx}-${Date.now()}`,
                title: is.title || `Imported Issue ${idx+1}`,
                description: is.description || '',
                severity: is.severity || 'medium',
                status: is.status || 'open',
                assignee: is.assignee || '',
                dueDate: is.dueDate || '',
                tags: is.tags || [],
                evidence: is.evidence || [],
              })) : [],
              progress: parsed.progress || 0,
            };

            send({ type: 'assessment', assessment });
            send({ type: 'done', message: 'Import complete' });
            controller.close();
            return;
          }

          // If not JSON assessment, do a lightweight content scan for findings
          send({ type: 'progress', message: 'Performing heuristic scan', timestamp: Date.now() });

          const findings: any[] = [];
          const lines = text.split(/\r?\n/);
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            const lowered = line.toLowerCase();
            if (lowered.includes('password') || lowered.includes('passwd') || lowered.includes('secret') || lowered.includes('api_key') || lowered.includes('apikey') || lowered.includes('token')) {
              const issue = {
                id: `f-${i}-${Date.now()}`,
                title: 'Potential secret found',
                description: `Possible secret on line ${i+1}: ${line.slice(0, 200)}`,
                severity: 'high',
                status: 'open',
                assignee: '',
                dueDate: '',
                tags: ['sensitive', 'secrets'],
                evidence: [line.trim()],
              };
              findings.push(issue);
              send({ type: 'issue', issue });
            }
            // Emit periodic progress
            if (i % 100 === 0) {
              send({ type: 'progress', message: `Scanned ${i}/${lines.length} lines`, timestamp: Date.now() });
            }
          }

          // If findings empty, send a benign message
          if (findings.length === 0) {
            send({ type: 'progress', message: 'No obvious secrets found; returning lightweight summary', timestamp: Date.now() });
            const assessment = {
              id: `import-${Date.now()}`,
              name: name,
              description: 'Imported file summary',
              target: '',
              startDate: new Date().toISOString(),
              endDate: '',
              status: 'planning',
              checklist: [],
              issues: [],
              progress: 0,
            };
            send({ type: 'assessment', assessment });
          } else {
            // Build minimal assessment with findings
            const assessment = {
              id: `import-${Date.now()}`,
              name: name,
              description: 'Imported file scan results',
              target: '',
              startDate: new Date().toISOString(),
              endDate: '',
              status: 'planning',
              checklist: [],
              issues: findings,
              progress: 0,
            };
            send({ type: 'assessment', assessment });
          }

          send({ type: 'done', message: 'Processing finished' });
          controller.close();
        } catch (err: any) {
          controller.enqueue(new TextEncoder().encode(JSON.stringify({ type: 'error', message: String(err) }) + '\n'));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
