# 📁 Structure du Projet n8n-nodes-sunbird-dctrack

```
n8n-nodes-sunbird-dctrack/
│
├── 📦 package.json                     # Configuration npm, dépendances, scripts
├── 📝 tsconfig.json                    # Configuration TypeScript
├── ⚙️ gulpfile.js                      # Build system (copie des icônes)
├── 🔍 .eslintrc.json                   # Règles de linting
├── 🚫 .gitignore                       # Fichiers à ignorer par Git
├── 📄 LICENSE.md                       # Licence MIT
│
├── 📚 Documentation/
│   ├── README.md                       # Documentation utilisateur principale
│   ├── QUICKSTART.md                   # Guide de démarrage développeur
│   └── PROJECT_SUMMARY.md              # Résumé du projet et roadmap
│
├── 🔐 credentials/
│   └── DcTrackApi.credentials.ts       # Gestion authentification API
│       ├── displayName: "dcTrack API"
│       ├── Champs: Base URL, API Key
│       ├── Authentication header
│       └── Test de connexion
│
├── 🎯 nodes/
│   └── DcTrack/
│       ├── DcTrack.node.ts             # LOGIQUE PRINCIPALE DU NODE
│       │   ├── Metadata (nom, version, description)
│       │   ├── Resources: ["Item"]
│       │   ├── Operations: [Create, Get, Update, Delete]
│       │   ├── Paramètres pour chaque opération
│       │   └── Logique d'exécution (appels API)
│       │
│       └── dctrack.svg                 # Icône du node (64x64px)
│           └── Design: Teal (#16A085) avec serveurs et "S"
│
└── 📋 examples/
    └── create-server-workflow.json     # Workflow exemple pour n8n
        ├── Manual Trigger
        ├── Create Server
        └── Get Server Details

```

## 🎨 Composants Clés Détaillés

### 1️⃣ DcTrackApi.credentials.ts
```typescript
Gère l'authentification avec dcTrack:
┌─────────────────────────────────────┐
│ Credentials Configuration           │
├─────────────────────────────────────┤
│ • Base URL: https://dctrack.com     │
│ • API Key: [password field]         │
├─────────────────────────────────────┤
│ Authentication Method:               │
│ ├─ Header: Authorization            │
│ └─ Value: Bearer {apiKey}           │
├─────────────────────────────────────┤
│ Connection Test:                     │
│ └─ GET /api/v2/items?limit=1        │
└─────────────────────────────────────┘
```

### 2️⃣ DcTrack.node.ts - Structure

```typescript
Node Configuration:
┌─────────────────────────────────────────────────┐
│ METADATA                                        │
├─────────────────────────────────────────────────┤
│ • displayName: "dcTrack"                        │
│ • version: 1                                    │
│ • icon: dctrack.svg                             │
│ • group: transform                              │
│ • inputs/outputs: ['main']                      │
└─────────────────────────────────────────────────┘
         │
         ├─→ Resource Selector
         │   └─→ Item (Equipment/Assets)
         │
         ├─→ Operation Selector
         │   ├─→ Create
         │   │   ├─ Item Name (required)
         │   │   ├─ Model (required)
         │   │   ├─ Location (required)
         │   │   └─ Additional Fields (optional)
         │   │       ├─ Serial Number
         │   │       ├─ Asset Tag
         │   │       ├─ U Position
         │   │       └─ Description
         │   │
         │   ├─→ Get
         │   │   └─ Item ID (required)
         │   │
         │   ├─→ Update
         │   │   ├─ Item ID (required)
         │   │   └─ Update Fields (optional)
         │   │       ├─ Item Name
         │   │       ├─ Location
         │   │       ├─ Serial Number
         │   │       └─ Description
         │   │
         │   └─→ Delete
         │       └─ Item ID (required)
         │
         └─→ Execute Function
             └─→ API Calls:
                 ├─ POST   /api/v2/items
                 ├─ GET    /api/v2/items/{id}
                 ├─ PUT    /api/v2/items/{id}
                 └─ DELETE /api/v2/items/{id}
```

## 🔄 Flux d'Exécution

```
┌─────────────────┐
│   User Action   │
│   in n8n UI     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  DcTrack.node.ts                    │
│  ├─ Get resource & operation        │
│  ├─ Get parameters from user        │
│  └─ Validate inputs                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  DcTrackApi.credentials.ts          │
│  ├─ Get Base URL                    │
│  ├─ Get API Key                     │
│  └─ Build Auth Header               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  HTTP Request                       │
│  ├─ Method: POST/GET/PUT/DELETE     │
│  ├─ URL: baseUrl + endpoint         │
│  ├─ Headers: Authorization          │
│  └─ Body: JSON data                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  dcTrack API Server                 │
│  ├─ Authenticate request            │
│  ├─ Process operation               │
│  └─ Return response                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Response Processing                │
│  ├─ Parse JSON                      │
│  ├─ Handle errors                   │
│  └─ Format for n8n                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Return to Workflow                 │
│  └─ Next node receives data         │
└─────────────────────────────────────┘
```

## 📦 Build Process

```
Source Files (.ts)
    │
    ├─→ TypeScript Compiler (tsc)
    │   └─→ dist/*.js
    │
    └─→ Gulp (icons)
        └─→ dist/nodes/**/*.svg

Final Output:
dist/
├── credentials/
│   └── DcTrackApi.credentials.js
└── nodes/
    └── DcTrack/
        ├── DcTrack.node.js
        └── dctrack.svg
```

## 🚀 Development Workflow

```
┌──────────────┐
│ 1. Code      │
│    Edit .ts  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 2. Build     │
│    npm run   │
│    build     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 3. Link      │
│    npm link  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 4. Test      │
│    in n8n    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 5. Iterate   │
│    or Publish│
└──────────────┘
```

## 📊 File Sizes

```
Total Project:        ~11 KB (compressed)
├── TypeScript:       ~8 KB
├── Config files:     ~2 KB
└── Documentation:    ~15 KB (uncompressed)
```

## 🎯 Quick Reference - Key Files

| Fichier | Purpose | Modifier Pour |
|---------|---------|--------------|
| `DcTrack.node.ts` | Logique principale | Ajouter opérations |
| `DcTrackApi.credentials.ts` | Auth | Changer méthode auth |
| `package.json` | Config npm | Dépendances, version |
| `dctrack.svg` | Icône | Changer design |
| `README.md` | Doc utilisateur | Guide d'utilisation |

## 🔧 Points d'Extension Courants

### Ajouter une Resource
Dans `DcTrack.node.ts`, section `properties`:
```typescript
{
  displayName: 'Resource',
  options: [
    { name: 'Item', value: 'item' },
    { name: 'Location', value: 'location' }, // ← NOUVEAU
  ]
}
```

### Ajouter une Operation
```typescript
{
  displayName: 'Operation',
  options: [
    { name: 'Create', value: 'create' },
    { name: 'Search', value: 'search' }, // ← NOUVEAU
  ]
}
```

### Ajouter un Champ
```typescript
{
  displayName: 'Power Rating',
  name: 'powerRating',
  type: 'number',
  default: 0,
}
```

---

**Note**: Cette structure est optimisée pour une extension facile. Commence simple, ajoute des fonctionnalités progressivement basées sur les retours utilisateurs.
