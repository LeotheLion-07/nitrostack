# HealthBridge MCP — NitroStack Edition

> Cross-hospital patient safety intelligence — built on **NitroStack**, deployed on **NitroCloud**.

---

## What It Does

HealthBridge exposes 4 MCP tools and 1 resource that detect safety issues across a patient's full multi-hospital history:

| Tool | Purpose |
|---|---|
| `log_patient_visit` | Record a new encounter into the shared patient history |
| `cross_hospital_safety_check` | Detect drug interactions, allergy conflicts, and duplicate tests |
| `medicine_availability_check` | Check stock → reroute → replenish |
| `followup_scheduler` | Assign urgency tier with contextual escalation |

**Resource:** `healthbridge://patients/{patientId}` — full cross-hospital timeline.

---

## Project Structure

```
HealthBridge/
├── src/                              # TypeScript source (NitroStack)
│   ├── index.ts                      # NitroStack bootstrap entry point
│   ├── app.module.ts                 # Root module
│   └── modules/
│       └── healthbridge/
│           ├── healthbridge.module.ts    # Feature module
│           ├── healthbridge.service.ts  # Shared state & data loading
│           ├── healthbridge.tools.ts    # All 4 MCP tools (@Tool)
│           └── healthbridge.resources.ts # MCP resource (@Resource)
├── data/
│   ├── patients.json                 # 10 synthetic patients (planted scenarios)
│   ├── drug_interactions.json        # Drug-drug pairs + allergy mappings
│   └── facility_stock.json           # 4-hospital stock table
├── widget/                           # Standalone browser widget (HTML/CSS/JS)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── tests/                            # Python pytest suites (46 tests)
├── Dockerfile                        # Multi-stage build for NitroCloud
├── .env.example                      # Environment template
├── package.json                      # NitroStack / Node.js deps
├── tsconfig.json                     # TypeScript config
├── server.py                         # (legacy) Python FastMCP reference
├── SPEC.md                           # Frozen tool schema specification
└── README.md
```

---

## Quick Start — NitroStack (TypeScript)

### 1. Install dependencies

```powershell
npm install
```

### 2. Run locally (dev server)

```powershell
npm run dev
# MCP server on http://localhost:3000
```

### 3. Open the widget

```powershell
start widget/index.html
# In app.js, set CONFIG.USE_MCP_API = true and CONFIG.MCP_BASE_URL = 'http://localhost:3000'
```

### 4. Build for production

```powershell
npm run build
# Output: dist/
```

---

## NitroCloud Deployment

```powershell
# Install NitroStack CLI globally
npm install -g @nitrostack/cli

# Deploy directly to NitroCloud
nitrostack deploy
```

NitroCloud provides:
- **HTTPS endpoint** (Streamable HTTP / SSE) with auto-cert
- **Auto-scaling** via Knative
- **Built-in auth** (API Key / OAuth 2.1)
- **NitroStudio integration** for visual testing

### Docker (self-hosted alternative)

```powershell
docker build -t healthbridge-mcp .
docker run -p 3000:3000 healthbridge-mcp
```

---

## Testing (NitroStudio)

Open the project folder in **NitroStudio** for visual tool testing:
- Invoke all 4 tools with the planted demo inputs
- Inspect request/response pairs in real time
- Use the built-in AI chat to orchestrate multi-tool workflows

### Python test suites (schema validation)

```powershell
python -m pytest tests/ -v   # 46/46 tests
```

---

## Planted Demo Scenarios

| Scenario | Patient | Trigger | Expected |
|---|---|---|---|
| **Buried drug conflict** | PAT-001 Anil Sharma | Prescribe `aspirin 100mg` | ⚠️ HIGH RISK — warfarin/aspirin conflict from HOSP-A |
| **Duplicate test** | PAT-003 Priya Nair | View history | 🔁 Lipid Panel at 2 hospitals within 8 days |
| **Missed allergy** | PAT-005 Ravi Patel | Prescribe `amoxicillin` | 🚨 Allergy Alert — penicillin cross-reactivity |
| **Stock reroute** | Any at HOSP-B | Prescribe `metformin` | 🔀 Rerouted to Green Valley Clinic |
| **Replenish fallback** | Any | Prescribe `atorvastatin` | 🔴 Out of Stock — Replenishment Requested |
| **Urgent follow-up** | PAT-007 Meena Iyer | `severe` AMI | 🔴 Urgent — 3 days, doctor notified |
| **Routine follow-up** | PAT-002 Fatima Khan | `mild` rhinitis | 🟢 Routine — 30 days |

> Cross-hospital patient safety intelligence — local MCP server + browser widget.

---

## What It Does

HealthBridge exposes 4 MCP tools and 1 resource that detect safety issues across a patient's full multi-hospital history:

| Tool | Purpose |
|---|---|
| `log_patient_visit` | Record a new encounter into the shared patient history |
| `cross_hospital_safety_check` | Detect drug interactions, allergy conflicts, and duplicate tests |
| `medicine_availability_check` | Check stock → reroute → replenish |
| `followup_scheduler` | Assign urgency tier with contextual escalation |

**Resource:** `healthbridge://patients/{patient_id}` — full cross-hospital timeline.

---

## Project Structure

```
HealthBridge/
├── SPEC.md                          # Frozen schema spec (source of truth)
├── data/
│   ├── patients.json                # 10 synthetic patients with planted scenarios
│   ├── drug_interactions.json       # 7 drug-drug pairs + 6 allergy-drug mappings
│   └── facility_stock.json          # 4-hospital stock table
├── tools/
│   ├── log_patient_visit.py
│   ├── cross_hospital_safety_check.py
│   ├── medicine_availability_check.py
│   └── followup_scheduler.py
├── widget/
│   ├── index.html                   # Patient Timeline Widget
│   ├── styles.css                   # Dark-mode design system
│   └── app.js                       # Full tool orchestration
├── server.py                        # FastMCP entry point
├── tests/                           # pytest test suites (40+ tests)
├── requirements.txt
└── pyproject.toml
```

---

## Quick Start

### 1. Install dependencies

```powershell
cd d:\NitroStack\Project
pip install -r requirements.txt
```

### 2. Run the MCP server

```powershell
# stdio mode (for MCP clients / Claude Desktop)
python server.py

# HTTP/SSE mode (for browser widget live wiring)
python server.py --http
```

### 3. Open the widget

Open `widget/index.html` directly in a browser (works standalone against static JSON):

```powershell
start widget/index.html
```

Or serve it alongside the HTTP server and set `CONFIG.USE_MCP_API = true` in `app.js`.

### 4. Run tests

```powershell
python -m pytest tests/ -v
```

---

## Planted Demo Scenarios

| Scenario | Patient | Trigger |
|---|---|---|
| **Buried drug conflict** | PAT-001 Anil Sharma | New prescription of `aspirin` — detects warfarin interaction from HOSP-A 3 months ago |
| **Duplicate test** | PAT-003 Priya Nair | Lipid Panel ordered at HOSP-B (2025-06-10) and HOSP-D (2025-06-18) — 8 days apart |
| **Missed allergy** | PAT-005 Ravi Patel | New prescription of `amoxicillin` — flags penicillin allergy recorded at HOSP-A in 2024 |
| **Stock reroute** | Any patient | `metformin` at HOSP-B → rerouted to HOSP-C (Green Valley Clinic, 200 units) |
| **Replenish fallback** | Any patient | `atorvastatin` at any hospital → all 4 facilities have 0 stock |
| **Urgent follow-up** | PAT-007 Meena Iyer | Acute Myocardial Infarction + severe → Urgent tier, ≤3 days |
| **Mild / routine** | PAT-002 Fatima Khan | Seasonal Allergic Rhinitis + mild → Routine, 30 days |

---

## MCP Tool Schemas

See [`SPEC.md`](SPEC.md) for the full frozen schema specification.

---

## Configuration

The widget (`widget/app.js`) has two modes:

| `CONFIG.USE_MCP_API` | Behaviour |
|---|---|
| `false` (default) | Loads static `data/patients.json` and simulates all 4 tools in-browser |
| `true` | Calls live MCP server at `CONFIG.MCP_BASE_URL` (requires `python server.py --http`) |

Switch to `true` for the full live demo after starting the HTTP server.
