# 🔗 Quick Access URLs

## Tool Pages (Frontend)

Navigate to these URLs to access each tool:

1. **OpenAPI/Swagger Editor**
   ```
   http://localhost:3000/tools/openapi-editor
   ```

2. **Mock Server Generator**
   ```
   http://localhost:3000/tools/mock-server
   ```

3. **Contract Testing Runner**
   ```
   http://localhost:3000/tools/contract-testing
   ```

4. **Webhook Tester & Replay**
   ```
   http://localhost:3000/tools/webhook-tester
   ```

5. **API Key & Quota Manager**
   ```
   http://localhost:3000/tools/api-key-manager
   ```

6. **GraphQL Playground**
   ```
   http://localhost:3000/tools/graphql-playground
   ```

---

## API Endpoints (Backend)

### OpenAPI Editor API
- **Endpoint:** `/api/tools/openapi`
- **Methods:** POST
- **Actions:** 
  - `validate` - Validate OpenAPI spec
  - `preview` - Generate endpoint preview
  - `generateExamples` - Create example responses
  - `convert` - Convert between YAML/JSON

### Mock Server API
- **Endpoint:** `/api/tools/mock-server`
- **Methods:** GET, POST, DELETE
- **Actions:**
  - GET - Retrieve mock servers
  - POST `action: "create"` - Create mock server
  - POST `action: "request"` - Handle mock request
  - DELETE - Remove mock server

### Contract Testing API
- **Endpoint:** `/api/tools/contract-testing`
- **Methods:** POST
- **Actions:**
  - `runTests` - Execute contract tests

### Webhook Tester API
- **Endpoint:** `/api/tools/webhook-tester`
- **Methods:** GET, POST
- **Actions:**
  - POST `action: "create"` - Generate webhook URL
  - POST `action: "send"` - Send test webhook
  - POST `action: "replay"` - Replay webhook
  - GET - Fetch webhook requests

### API Key Manager API
- **Endpoint:** `/api/tools/api-key-manager`
- **Methods:** GET, POST, DELETE
- **Actions:**
  - POST `action: "create"` - Generate API key
  - POST `action: "validate"` - Validate API key
  - GET - List all API keys
  - DELETE - Revoke API key

### GraphQL Playground API
- **Endpoint:** `/api/tools/graphql-playground`
- **Methods:** POST
- **Actions:**
  - `introspect` - Fetch GraphQL schema
  - `execute` - Execute GraphQL query

---

## Testing Commands

Start development server:
```bash
npm run dev
```

Then navigate to any tool URL above in your browser.

---

## Sample API Requests

### Validate OpenAPI Spec
```bash
curl -X POST http://localhost:3000/api/tools/openapi \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "spec": {
      "openapi": "3.0.0",
      "info": { "title": "Test API", "version": "1.0.0" },
      "paths": {}
    }
  }'
```

### Create Mock Server
```bash
curl -X POST http://localhost:3000/api/tools/mock-server \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "name": "Test Server",
    "endpoints": [{
      "method": "GET",
      "path": "/test",
      "statusCode": 200,
      "responseBody": { "message": "Hello" }
    }]
  }'
```

### Generate Webhook URL
```bash
curl -X POST http://localhost:3000/api/tools/webhook-tester \
  -H "Content-Type: application/json" \
  -d '{ "action": "create" }'
```

### Generate API Key
```bash
curl -X POST http://localhost:3000/api/tools/api-key-manager \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "name": "Test Key",
    "quotaLimit": 1000,
    "quotaPeriod": "daily"
  }'
```

### Execute GraphQL Query
```bash
curl -X POST http://localhost:3000/api/tools/graphql-playground \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "endpoint": "https://api.spacex.land/graphql/",
    "query": "{ company { name } }"
  }'
```

---

## Browser Testing Checklist

✅ OpenAPI Editor
- [ ] Load sample OpenAPI spec
- [ ] Validate spec
- [ ] Generate preview
- [ ] Create examples
- [ ] Convert YAML to JSON

✅ Mock Server
- [ ] Upload OpenAPI file
- [ ] Create endpoints manually
- [ ] Generate mock server
- [ ] Copy server URL
- [ ] Test mock endpoint

✅ Contract Testing
- [ ] Load sample contract
- [ ] Configure provider URL
- [ ] Run tests
- [ ] View results
- [ ] Check differences

✅ Webhook Tester
- [ ] Generate webhook URL
- [ ] Send test webhook
- [ ] View request history
- [ ] Replay webhook

✅ API Key Manager
- [ ] Generate API key
- [ ] Copy key (only shown once!)
- [ ] View all keys
- [ ] Revoke key
- [ ] Check usage analytics

✅ GraphQL Playground
- [ ] Connect to endpoint
- [ ] Fetch schema
- [ ] Load sample query
- [ ] Execute query
- [ ] View response
- [ ] Browse schema

---

Happy testing! 🚀
