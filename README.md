# n8n-nodes-sunbird-dctrack

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

This is an n8n community node for [Sunbird dcTrack](https://www.sunbirddcim.com/dctrack), a leading Data Center Infrastructure Management (DCIM) platform.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform that allows you to connect anything to everything via a visual workflow editor.

[Sunbird dcTrack](https://www.sunbirddcim.com/) provides comprehensive asset management, capacity planning, and change management for modern data centers.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-sunbird-dctrack`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-sunbird-dctrack
```

## Authentication

### ✅ Basic Authentication
Username and password authentication using n8n's standard Basic Auth credentials.

**Setup:**
1. Add Credential → **Basic Auth**
2. Enter your dcTrack username and password
3. Set allowed domain to your dcTrack instance

### ✅ OAuth 2.0 (Client Credentials)
Token-based authentication using Client ID and Client Secret.

**Setup:**
1. In dcTrack: Generate Client ID and Client Secret (Administration → User Management)
2. In n8n: Add Credential → **dcTrack OAuth2 API**
3. Enter:
   - Base URL: Your dcTrack instance URL
   - Client ID: From dcTrack
   - Client Secret: From dcTrack
   - Scope: `user_permissions`

**Note:** Ensure your OAuth2 user has appropriate permissions (Create, Read, Update, Delete) for the operations you want to perform.

**Token Management:** Access tokens are automatically generated and refreshed (valid for 1 hour).
## Operations

### Items (Equipment & Assets)

| Operation | Status | Description |
|-----------|--------|-------------|
| **Create** | ✅ Production | Create a new item in dcTrack |
| **Get** | ✅ Production | Retrieve an item by name or ID |
| **Update** | ✅ Production | Update item properties |
| **Move** | ✅ Production | Move item to new location/cabinet |
| **Search** | ✅ Production | Advanced search with filters |
| **Delete** | ✅ Production | Delete an item |

### Connections

| Operation | Status | Description |
|-----------|--------|-------------|
| **Create Data Connection** | ✅ Production | Create network/data connections between ports |

### 🚧 Planned Operations

- Power connections
- Bulk operations
- Custom reports
- Webhooks integration

## Compatibility

- **n8n version**: 0.180.0 or higher
- **dcTrack API**: v2
- **Tested on**: dcTrack 6.x, 7.x

## Configuration

### Prerequisites

1. A dcTrack instance (on-premises or cloud)
2. Valid user credentials with API access
3. Network access to your dcTrack API endpoint

### Setup

1. **Add Credentials**:
   - Go to **Credentials** in n8n
   - Select **Basic Auth**
   - Fill in:
     - **User**: Your dcTrack username
     - **Password**: Your dcTrack password
     - **Allowed HTTP Request Domain**: Your dcTrack domain (e.g., `dctrack.yourcompany.com`)

2. **Add dcTrack Node**:
   - In your workflow, add the **dcTrack** node
   - Set **Base URL**: `https://your-dctrack-instance.com` (without trailing slash)
   - Select your Basic Auth credentials
   - Choose your operation

## Usage Examples

### Example 1: Create a Server

```
Node: dcTrack
├─ Resource: Item
├─ Operation: Create
├─ Item Name: server-web-01
├─ Make: Dell
├─ Model: PowerEdge R750
├─ Location: SITE A
├─ Cabinet: Rack-42
└─ Additional Fields:
   ├─ U Position: 20
   └─ Status: Active
```

### Example 2: Search Equipment

```
Node: dcTrack
├─ Resource: Item
├─ Operation: Search
├─ Search Filters:
│  ├─ Location: SITE A
│  ├─ Make: Dell
│  └─ Status: Active
├─ Return Fields:
│  ├─ ☑ Item Name
│  ├─ ☑ Cabinet
│  ├─ ☑ U Position
│  └─ ☑ Model
└─ Page Size: 100
```

### Example 3: Automated Workflow

```
Trigger: Telegram
   ↓
OpenAI (voice transcription)
   ↓
AI Agent (interpret command)
   ↓
dcTrack (create/update item)
   ↓
Telegram (send confirmation)
```

## Field Mapping

### dcTrack API ↔ Node Parameters

| n8n Node Field | dcTrack API Field | Description |
|----------------|-------------------|-------------|
| Item Name | `tiName` | Name of the equipment |
| Make | `cmbMake` | Manufacturer |
| Model | `cmbModel` | Model number |
| Location | `cmbLocation` | Site/location |
| Cabinet | `cmbCabinet` | Cabinet/rack name |
| U Position | `cmbUPosition` | Rack unit position |
| Status | `cmbStatus` | Planned/Active/Decommissioned/Storage |
| Serial Number | `tiSerialNumber` | Serial number |
| Asset Tag | `tiAssetTag` | Asset tag identifier |

## Search Filters

The Search operation supports filtering by:

- **Item Name** - Supports wildcards (`server*`)
- **Location** - Exact match
- **Cabinet** - Exact match
- **Make** - Manufacturer
- **Model** - Model name/number
- **Status** - Dropdown selection
- **Class** - Equipment class

You can select which fields to return in the results.

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid credentials | Check username/password |
| 400 Bad Request | Invalid parameters | Verify required fields are filled |
| 404 Not Found | Item doesn't exist | Check item name/ID |
| 422 Unprocessable Entity | Validation error | Check field values (e.g., cabinet exists) |
| 500 Internal Server Error | dcTrack API error | Check dcTrack logs or contact support |

## Troubleshooting

### Node doesn't appear in n8n

1. Restart n8n
2. Clear browser cache
3. Check installation: `npm list n8n-nodes-sunbird-dctrack`

### Authentication fails

1. Verify credentials work in dcTrack web interface
2. Check **Allowed HTTP Request Domain** includes your dcTrack domain
3. Ensure user has API access permissions

### API requests fail

1. Verify **Base URL** is correct (no trailing slash)
2. Check network connectivity to dcTrack
3. Verify dcTrack API is enabled

## Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/m3sh311/n8n-nodes-sunbird-dctrack.git
cd n8n-nodes-sunbird-dctrack

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link
```

### Project Structure

```
n8n-nodes-sunbird-dctrack/
├── nodes/
│   └── DcTrack/
│       ├── DcTrack.node.ts          # Main node implementation
│       └── dctrack.svg              # Node icon
├── package.json
├── tsconfig.json
└── README.md
```

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Sunbird dcTrack Documentation](https://www.sunbirddcim.com/help)
- [dcTrack API Reference](https://www.sunbirddcim.com/api-docs)
- [Report Issues](https://github.com/m3sh11/n8n-nodes-sunbird-dctrack/issues)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Roadmap

- [ ] Token-based authentication
- [ ] OAuth 2.0 authentication
- [ ] Power connection operations
- [ ] Bulk operations (create/update/delete multiple items)
- [ ] Custom field support improvements
- [ ] Webhook triggers
- [ ] Asset lifecycle workflows
- [ ] Capacity planning operations

## Version History

### 0.3.2 (Current)
- ✅ OAuth2 Client Credentials authentication support
- ✅ Automatic token generation and management
- ✅ Single authentication method selector
- ✅ Tested with both Basic Auth and OAuth2

### 0.3.0
- 🔧 OAuth2 implementation (initial)

### 0.2.3 (Current)
- ✅ Basic Authentication support
- ✅ Item operations: Create, Get, Update, Move, Search, Delete
- ✅ Connection operations: Create data connections
- ✅ User-friendly search filters (no JSON required)
- ✅ Multi-select return fields

### 0.2.0
- ✅ Initial release with basic operations
- ✅ JSON-based search filters

### 0.1.0
- 🧪 Beta version

## License

[MIT](LICENSE.md)

## Support

For issues, questions, or contributions:
- 🐛 [GitHub Issues](https://github.com/m3sh11/n8n-nodes-sunbird-dctrack/issues)
- 📧 Email: michel.daviller@sunbirddcim.com
- 💬 [n8n Community Forum](https://community.n8n.io/)

## Disclaimer

This is a community-created node and is not officially supported by Sunbird Software or n8n.io. Use at your own risk.

---

Made with ❤️ for the n8n and dcTrack communities
