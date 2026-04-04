# Trello Integration for Promethean

Seamlessly sync kanban tasks from the internal Promethean kanban system to Trello boards with full automation.

## 🚀 Quick Start

### Prerequisites

1. **Trello API Key & Token:**
   ```bash
   # Add to your .env file
   TRELLO_API_KEY=your_trello_api_key_here
   TRELLO_API_TOKEN=your_trello_api_token_here
   ```

   **Get your API key:** https://trello.com/app-key

   **Generate a token:** https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Promethean%20Sync&key=YOUR_API_KEY

### Installation

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build
```

### Usage

#### Test Connection
```bash
# Test your API credentials
pnpm run test:trello

# Or run directly
node packages/trello/src/test-trello-connection.ts
```

#### Sync Kanban to Trello
```bash
# Basic sync (creates board if needed)
pnpm run sync:trello

# Sync to specific board
pnpm run sync:trello -- --board "My Kanban Board"

# Dry run to see what would happen
pnpm run sync:trello -- --dry-run

# Sync only 10 tasks
pnpm run sync:trello -- --max-tasks 10

# Development mode (no build needed)
pnpm run sync:trello:dev
```

#### Manual CLI Usage
```bash
# Full sync with options
node packages/trello/dist/cli/sync-kanban-to-trello.js --board "generated" --max-tasks 20

# Show help
node packages/trello/dist/cli/sync-kanban-to-trello.js --help
```

## 📋 What It Does

### ✅ **Full Automation**

1. **Board Management:**
   - Automatically creates Trello boards
   - Configurable board names (default: "generated")
   - Supports existing boards
   - Optional archive of existing lists

2. **Column Setup:**
   - Creates standard kanban columns:
     - Icebox, Incoming, Accepted, Breakdown, Blocked
     - Ready, Todo, In Progress, Review, Document, Done, Rejected
   - Customizable column mapping

3. **Card Creation:**
   - Extracts tasks from internal kanban system
   - Creates detailed Trello cards with full metadata
   - Preserves UUIDs for tracking
   - Adds priority labels (P1=red, P2=orange, P3=green)

4. **Smart Organization:**
   - Automatically places cards in correct columns
   - Priority-based color coding
   - Maintains status consistency
   - Full task descriptions with sync metadata

### 🎯 **Target Tasks**

The sync searches for kanban-related tasks:
- **Exact matches:** Tasks with "kanban" in title or labels
- **Similar matches:** Related development tasks
- **Priority sorting:** P1 → P2 → P3 ordering

## 🔧 **Configuration**

### Environment Variables
```bash
# Required
TRELLO_API_KEY=your_trello_api_key
TRELLO_API_TOKEN=your_trello_api_token

# Optional
BOARD_NAME=custom_board_name
MAX_TASKS=20
DRY_RUN=false
```

### CLI Options
```bash
Options:
  -b, --board <name>     Board name (default: "generated")
  -m, --max-tasks <num>  Maximum number of tasks to sync (default: 20)
  -d, --dry-run         Show what would be done without making changes
  --archive             Archive existing lists before creating new ones
  --no-create           Don't create board if it doesn't exist
  -h, --help            Show help message
```

## 📁 **Package Structure**

```
packages/trello/
├── src/
│   ├── lib/
│   │   ├── types.ts              # TypeScript definitions
│   │   ├── trello-client.ts      # Trello API client
│   │   └── kanban-to-trello-sync.ts # Core sync functionality
│   ├── cli/
│   │   └── sync-kanban-to-trello.ts # CLI interface
│   ├── test-trello-connection.ts  # Connection tester
│   └── index.ts                   # Main exports
├── dist/                         # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 **Example Usage**

```typescript
import { KanbanToTrelloSync } from '@promethean-os/trello';

const sync = new KanbanToTrelloSync(
  {
    apiKey: 'your_api_key',
    apiToken: 'your_token'
  },
  {
    boardName: 'My Kanban Board',
    maxTasks: 15,
    dryRun: false
  }
);

const result = await sync.sync();
await sync.printSummary(result);
```

## 📊 **Example Output**

```
🚀 Starting kanban to Trello sync
📋 Board: My Kanban Board
🔄 Mode: LIVE SYNC

📋 Searching for kanban tasks...
✅ Found 24 exact kanban matches
✅ Found 15 similar kanban matches

🔍 Looking for Trello board: "My Kanban Board"
✅ Found existing board: https://trello.com/b/abc123/my-kanban-board

📝 Setting up kanban columns...
   ✅ Created list: Icebox
   ✅ Created list: Todo
   ✅ Created list: In Progress
   ✅ Created list: Done

🏷️  Setting up priority labels...
   ✅ Created label: P1 (red)
   ✅ Created label: P2 (orange)
   ✅ Created label: P3 (green)

🔄 Syncing 15 tasks to Trello cards...

[1/15] Implement kanban dev command with real-time sync
   UUID: 6397a3b3-5365-4893-a0e2-8f2f7ac678cc
   Status: todo → Todo
   Priority: P1
   🃏 Creating card: "Implement kanban dev command..."
   ✅ Created: https://trello.com/c/def456

======================================================================
✅ Kanban to Trello sync completed!
======================================================================
📋 Board: My Kanban Board
🔗 URL: https://trello.com/b/abc123/my-kanban-board

📊 Summary:
   📝 Total tasks: 39
   🃏 Synced cards: 15
   ❌ Failed cards: 0
   📝 Created lists: 4
   🏷️  Created labels: 3

🎉 Your Trello board is ready!
🔗 View it at: https://trello.com/b/abc123/my-kanban-board
```

## 🔍 **Troubleshooting**

### "Missing required environment variables"
- **Cause:** TRELLO_API_KEY or TRELLO_API_TOKEN not set
- **Fix:** Add both variables to your .env file

### "Connection failed"
- **Cause:** Invalid API key or token
- **Fix:** Verify your credentials and regenerate token if needed

### "Board not found"
- **Cause:** Board doesn't exist and --no-create flag used
- **Fix:** Remove --no-create flag or create board manually first

### "No kanban tasks found"
- **Cause:** Kanban board is empty or not accessible
- **Fix:** Run `pnpm kanban count` to verify board has tasks

## 🚀 **Features vs GitHub Projects**

| Feature | Trello | GitHub Projects |
|---------|--------|-----------------|
| ✅ Full API automation | ✅ | ❌ Limited |
| ✅ Easy board creation | ✅ | ⚠️ Complex |
| ✅ Drag & drop organization | ✅ | ✅ |
| ✅ Rich card metadata | ✅ | ✅ |
| ✅ Priority labels | ✅ | ✅ |
| ✅ Custom workflows | ✅ | ⚠️ Limited |
| ✅ Real-time sync | ✅ | ❌ Manual |
| ✅ Webhooks support | ✅ | ✅ |
| ✅ Mobile app | ✅ | ✅ |

## 🎯 **Why Trello?**

Unlike GitHub Projects v2, Trello provides:
- **Full API access** for complete automation
- **No manual organization required** - cards go to right columns automatically
- **Rich customization** with labels, checklists, and attachments
- **Reliable sync** with proven API stability
- **Team collaboration** features built-in

## 🔮 **Future Enhancements**

- [ ] Bidirectional sync (Trello → Internal kanban)
- [ ] Real-time webhook updates
- [ ] Multiple board support
- [ ] Custom field mapping
- [ ] Checklist synchronization
- [ ] Attachment handling
- [ ] Label color customization

<!-- READMEFLOW:BEGIN -->
# @promethean-os/trello

Trello integration for Promethean kanban board synchronization

[TOC]


## Install

```bash
pnpm -w add -D @promethean-os/trello
```

## Quickstart

```ts
// usage example
```

## Commands

- `build`
- `test`
- `dev`
- `clean`
- `sync:trello`
- `sync:trello:dev`

## License

GPL-3.0-only


### Package graph

```mermaid
flowchart LR
  _promethean_os_trello["@promethean-os/trello\n0.1.0"]
  _promethean_os_kanban["@promethean-os/kanban\n0.2.0"]
  _promethean_os_utils["@promethean-os/utils\n0.0.1"]
  _promethean_os_trello --> _promethean_os_kanban
  _promethean_os_trello --> _promethean_os_utils
  classDef focal fill:#fdf6b2,stroke:#222,stroke-width:2px;
  class _promethean_os_trello focal;
```


<!-- READMEFLOW:END -->
