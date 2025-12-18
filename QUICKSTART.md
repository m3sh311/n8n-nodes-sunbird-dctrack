# Quick Start Guide - dcTrack n8n Node Development

## Project Structure

```
n8n-nodes-sunbird-dctrack/
├── credentials/
│   └── DcTrackApi.credentials.ts    # API authentication
├── nodes/
│   └── DcTrack/
│       ├── DcTrack.node.ts          # Main node logic
│       └── dctrack.svg              # Node icon
├── package.json                      # Package configuration
├── tsconfig.json                     # TypeScript config
├── gulpfile.js                       # Build configuration
└── README.md                         # Documentation
```

## Development Setup

### 1. Install Dependencies

```bash
cd sunbird-dctrack-node
npm install
```

### 2. Build the Node

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript in the `dist/` folder
- Copy icons to the dist folder

### 3. Link for Local Testing

To test your node locally in n8n:

```bash
# In the node project directory
npm link

# In your n8n installation directory
npm link n8n-nodes-sunbird-dctrack
```

### 4. Restart n8n

```bash
# If running n8n locally
n8n start
```

Your dcTrack node should now appear in n8n's node list!

## Testing the Node

### Test Create Item Operation

1. Add a dcTrack node to your workflow
2. Select "Item" as resource
3. Select "Create" as operation
4. Fill in:
   - Item Name: TEST-SERVER-01
   - Model: Dell R740
   - Location: TEST-RACK-01
5. Execute the node

### Expected Response

```json
{
  "id": "12345",
  "name": "TEST-SERVER-01",
  "model": "Dell R740",
  "location": "TEST-RACK-01",
  "status": "active",
  "createdAt": "2024-12-17T10:00:00Z"
}
```

## Customizing for Your dcTrack API

### Update API Endpoints

The current implementation uses example endpoints. Update them in `DcTrack.node.ts`:

```typescript
// Current (example)
url: '/api/v2/items'

// Update to match your dcTrack API
url: '/api/v1/dcTrack/items'  // or whatever your actual endpoint is
```

### Add More Fields

To add custom fields specific to your dcTrack instance:

1. Open `nodes/DcTrack/DcTrack.node.ts`
2. Find the `additionalFields` section
3. Add new fields:

```typescript
{
  displayName: 'Power Rating (Watts)',
  name: 'powerRating',
  type: 'number',
  default: 0,
  description: 'Power consumption in watts',
},
```

### Add New Operations

To add operations like "Move Item" or "Get Power Usage":

1. Add the operation to the options list:

```typescript
{
  name: 'Move',
  value: 'move',
  description: 'Move item to a new location',
  action: 'Move an item',
},
```

2. Add the fields for that operation:

```typescript
{
  displayName: 'New Location',
  name: 'newLocation',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['move'],
    },
  },
  default: '',
  required: true,
},
```

3. Add the execution logic:

```typescript
if (operation === 'move') {
  const itemId = this.getNodeParameter('itemId', i) as string;
  const newLocation = this.getNodeParameter('newLocation', i) as string;
  
  const responseData = await this.helpers.httpRequestWithAuthentication.call(
    this,
    'dcTrackApi',
    {
      method: 'POST',
      url: `/api/v2/items/${itemId}/move`,
      body: { location: newLocation },
      json: true,
    },
  );
  
  returnData.push(responseData as IDataObject);
}
```

## Publishing to npm

### 1. Create npm Account

If you don't have one: https://www.npmjs.com/signup

### 2. Login to npm

```bash
npm login
```

### 3. Update package.json

- Change repository URLs
- Update author information
- Set correct version number

### 4. Publish

```bash
npm publish
```

Your node will be available for installation via:
```bash
npm install n8n-nodes-sunbird-dctrack
```

## Next Steps

1. **Test with Real dcTrack Instance**
   - Update API endpoints to match your dcTrack version
   - Test all operations with real data
   - Handle error cases

2. **Add More Resources**
   - Locations (cabinets, racks)
   - Connections (power, network)
   - Reports

3. **Add More Operations**
   - Bulk operations
   - Search/filter
   - Custom queries

4. **Improve Error Handling**
   - Better error messages
   - Validation before API calls
   - Retry logic

5. **Add Tests**
   - Unit tests for node logic
   - Integration tests with dcTrack API

## Troubleshooting

### Node doesn't appear in n8n

- Make sure you ran `npm run build`
- Check that files are in the `dist/` folder
- Restart n8n completely
- Check n8n logs for errors

### Authentication fails

- Verify Base URL is correct (no trailing slash)
- Check API key is valid
- Test API endpoint manually with curl:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-dctrack.com/api/v2/items?limit=1
```

### TypeScript errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Resources

- [n8n Node Development Docs](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
