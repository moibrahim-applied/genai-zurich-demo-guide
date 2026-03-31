export interface Resource {
  label: string;
  url: string;
}

export interface Act {
  title: string;
  checklist: string[];
  prompt: string;
  promptLabel: string;
  talkTrack: string;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  acts: Act[];
  resources: Resource[];
}

const skillFilePrompt = `# OPUS Platform -- Complete API Skill File
# Drop this into any AI coding assistant to give it full OPUS knowledge.
# The AI can then connect any frontend to any OPUS workflow in one shot.

## Base URL & Authentication

Base URL: https://operator.opus.com

Every request requires this header:
  x-service-key: YOUR_SERVICE_KEY

## The Core Flow: How to Run a Workflow

Step 1 -- Get workflow details (to know what inputs it expects):
  GET /workflow/{workflowId}
  Response: { id, name, description, jobPayloadSchema }

  jobPayloadSchema tells you the expected input variables:
  {
    "variable_name": {
      "id": "uuid",
      "variable_name": "my_var",
      "display_name": "My Variable",
      "type": "str",        // str, float, bool, date, file, array, object
      "is_nullable": false
    }
  }

Step 2 -- Initiate a job (creates a job shell, no execution yet):
  POST /job/initiate
  Body: { "workflowId": "xxx", "title": "Job Title", "description": "" }
  Response: { "jobExecutionId": "12345" }

Step 3 -- Execute the job (starts the workflow with input data):
  POST /job/execute
  Body: {
    "jobExecutionId": "12345",
    "jobPayloadSchemaInstance": {
      "variable_name": { "value": "actual value", "type": "str" },
      "amount": { "value": 1500, "type": "float" },
      "document": { "value": "https://files.opus.com/...", "type": "file" }
    }
  }
  Response: { "success": true, "jobExecutionId": "12345" }

Step 4 -- Poll for completion:
  GET /job/{jobExecutionId}/status
  Response: { "status": "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "WAITING" | "CANCELLED" }

  Poll every 2 seconds until status is COMPLETED or FAILED.

Step 5 -- Get results:
  GET /job/{jobExecutionId}/results
  Response: { "jobResultsPayloadSchema": { ... output variables ... } }

Step 6 -- Get audit (optional, for node-level execution data):
  GET /job/{jobExecutionId}/audit
  Response: {
    "nb_nodes": 10,
    "nb_executed_nodes": 10,
    "executed_nodes": ["Node 1", "Node 2"],
    "failed_nodes": [],
    "running_node": null,
    "audit": {
      "nodes_execution_data": {
        "Node Name": {
          "execution_status": "completed",
          "execution_time": 1234  // milliseconds
        }
      }
    }
  }

## File Upload Flow (for workflows that accept file inputs)

Step 1 -- Get a presigned upload URL:
  POST /job/file/upload
  Body: { "fileExtension": ".pdf", "accessScope": "organization" }
  Response: { "presignedUrl": "https://s3-upload-url...", "fileUrl": "https://final-url..." }

Step 2 -- Upload the file to the presigned URL:
  PUT {presignedUrl}
  Body: raw file bytes

Step 3 -- Use the fileUrl as the value in the job payload:
  "document": { "value": "https://final-url...", "type": "file" }

## API Data Types

  str      -- String: "Hello"
  float    -- Number: 42.5
  bool     -- Boolean: true
  date     -- Date string: "2026-01-15"
  file     -- File URL: "https://files.opus.com/..."
  array    -- List: ["a", "b"]
  object   -- JSON object: {"key": "value"}

## Other Useful Endpoints

Search jobs:
  GET /job/search?workflowId={id}&status={status}&offset=0&maxResults=25

Archive/unarchive:
  POST /job/{jobId}/archive
  DELETE /job/{jobId}/archive

Delete job:
  DELETE /job/{jobId}/delete

Get workflow list:
  GET /workflow/private?offset=0&maxResults=25

## Complete Integration Example (React + OPUS)

// 1. Create an API service file
const OPUS_BASE = "https://operator.opus.com";
const API_KEY = process.env.OPUS_API_KEY;

const headers = {
  "x-service-key": API_KEY,
  "Content-Type": "application/json",
};

// 2. Run a workflow from the frontend
async function runWorkflow(workflowId, inputs) {
  // Initiate
  const initRes = await fetch(OPUS_BASE + "/job/initiate", {
    method: "POST",
    headers,
    body: JSON.stringify({
      workflowId,
      title: "UI Job",
      description: "",
    }),
  });
  const { jobExecutionId } = await initRes.json();

  // Execute
  await fetch(OPUS_BASE + "/job/execute", {
    method: "POST",
    headers,
    body: JSON.stringify({
      jobExecutionId,
      jobPayloadSchemaInstance: inputs,
    }),
  });

  // Poll until complete
  let status = "PENDING";
  while (!["COMPLETED", "FAILED", "CANCELLED"].includes(status)) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(
      OPUS_BASE + "/job/" + jobExecutionId + "/status",
      { headers }
    );
    const data = await statusRes.json();
    status = data.status;
  }

  // Get results
  if (status === "COMPLETED") {
    const resultsRes = await fetch(
      OPUS_BASE + "/job/" + jobExecutionId + "/results",
      { headers }
    );
    return await resultsRes.json();
  }

  throw new Error("Workflow " + status);
}

// 3. Call it from any React component
const result = await runWorkflow("your-workflow-id", {
  query: { value: "Analyze this", type: "str" },
  amount: { value: 1500, type: "float" },
});

## What This Enables

With this skill file, an AI coding assistant can:
- Read any OPUS workflow's expected inputs from jobPayloadSchema
- Build a typed form that matches those inputs
- Handle file uploads through the presigned URL flow
- Execute the workflow and poll for results
- Display outputs in the UI as they complete
- Show node-by-node progress using the audit endpoint
- Handle errors and retry on failures

Give this file to your AI assistant with a prompt like:
"Connect this React frontend to the OPUS workflow {id}.
 When the user submits the form, run the workflow, show
 polling progress, and display the results."

The AI has everything it needs to build the integration in one pass.`;

const procurementResources: Resource[] = [
  { label: "WF 1: Supplier Screening & Selection", url: "https://workflow.opus.com/workflow/KSaSaSZiaUhkpo2V" },
  { label: "WF 2: Supplier Onboarding", url: "https://workflow.opus.com/workflow/zGwuRF7FUDJKalu1" },
  { label: "WF 3: Cost Optimization & Negotiation", url: "https://workflow.opus.com/workflow/yqDU9B7mSv3YKgfM" },
  { label: "WF 4: Contract Compliance & Risk Management", url: "https://workflow.opus.com/workflow/lpnn8qbI9CrBIz1P" },
  { label: "Live UI: Procurement Dashboard", url: "https://proc-demo.vercel.app/" },
];

const bankingResources: Resource[] = [
  { label: "WF: Swiss Mortgage Application Processor", url: "https://workflow.opus.com/workflow/WYdlc81aLV62XBOc" },
  { label: "Live UI: Swiss Bank Mortgage", url: "https://swiss-bank-demo.vercel.app" },
];

const hikingResources: Resource[] = [
  { label: "WF: Swiss Alpine Trail Architect", url: "https://workflow.opus.com/workflow/J1WRnK73G4NJ0d2F" },
  { label: "Live UI: TrailForge", url: "https://alpine-trail-forge.com" },
];

export const categories: Category[] = [
  {
    id: "procurement",
    name: "Procurement",
    subtitle: "Source-to-Contract",
    icon: "📦",
    acts: [
      {
        title: "Act 1: Generate Workflow",
        checklist: [
          "Open OPUS platform",
          "Paste workflow prompt",
          "Wait for generation",
        ],
        promptLabel: "Workflow Prompt",
        prompt: `Build an end-to-end manufacturing procurement workflow for sourcing a hydraulic actuator component.

The workflow should have 5 stages:

1. INTAKE: Collect purchase request details (component specs, quantity, budget, timeline, requester info). Validate the request is complete using an AI agent. If incomplete, route to a human task to gather missing information.

2. SUPPLIER SCREENING: Take the component requirements and search/evaluate potential suppliers. Score each supplier on price competitiveness, delivery reliability, quality certifications (ISO 9001, AS9100), and geographic risk. Rank the top 3 suppliers. Present results to a human decision agent for final supplier selection.

3. SUPPLIER ONBOARDING: For the selected supplier, collect and verify trade license, insurance certificates, bank details, and compliance documents using text extraction. Run parallel document verification checks. Flag any compliance gaps and route to human review if issues found.

4. COST OPTIMIZATION: Analyze the quoted price against market benchmarks. Run a negotiation strategy agent that suggests counter-offer points, volume discount opportunities, and payment term optimizations. Calculate projected savings. Present the negotiation brief to a human approver.

5. CONTRACT & COMPLIANCE: Generate a draft contract from the approved terms. Run a compliance check agent that validates against company procurement policies. Route the final contract to a human decision agent for sign-off. On approval, send notification emails to the supplier and internal stakeholders.

Include human checkpoints between each major stage. Use decision agents for routing. Each stage should have clear input/output variables.`,
        talkTrack:
          "OPUS is reading this natural language description and translating it into a structured workflow with AI agents, human checkpoints, decision logic, and integrations -- all wired together automatically.",
      },
      {
        title: "Act 2: Generate UI",
        checklist: [
          "Open UI generator",
          "Paste UI prompt",
          "Wait for generation",
        ],
        promptLabel: "UI Prompt",
        prompt: `Build a procurement operations dashboard in Next.js 14 with TypeScript and Tailwind CSS. Dark theme with slate backgrounds.

The dashboard should have:

1. A top KPI bar showing: Open Requests (count), Active Suppliers (count), Total Spend (currency), Cost Savings (percentage with green indicator)

2. A main section with tabs for each procurement stage:
   - Intake Queue: table of incoming purchase requests with status badges (pending, in review, approved)
   - Supplier Screening: radar chart comparing top 3 suppliers across price, quality, delivery, compliance dimensions. Ranking table below.
   - Onboarding Tracker: document checklist with upload status (verified, pending, flagged) and a readiness gauge
   - Cost Analysis: bar chart showing quoted price vs market benchmark. Savings calculator with projected annual savings.
   - Contract Status: timeline view showing contract stages (draft, review, approved, signed) with current stage highlighted

3. A sidebar with recent activity feed showing workflow events in real-time

4. Use Recharts for visualizations. Framer Motion for transitions. Mock realistic procurement data for a hydraulic actuator sourcing scenario.`,
        talkTrack:
          "While the workflow generates, we're simultaneously creating the frontend that will consume it.",
      },
      {
        title: "Act 3: Connect with OPUS API Skill File",
        checklist: [
          "Open the OPUS API skill file (scroll through to show the audience)",
          "Highlight: base URL, auth, the 6-step core flow",
          "Highlight: the complete React integration example at the bottom",
          "Show: paste this into any AI coding assistant and ask it to wire the UI to the workflow",
          "Key point: the AI gets full API knowledge -- endpoints, data types, file upload flow, polling pattern",
        ],
        promptLabel: "OPUS API Skill File (paste into AI coding assistant)",
        prompt: skillFilePrompt,
        talkTrack:
          "This is the OPUS API skill file. It contains every endpoint, every data type, the complete integration pattern with working code. You paste this into any AI coding assistant -- Claude, Cursor, Copilot -- and tell it to connect your UI to the workflow. The AI has everything it needs: authentication, the initiate-execute-poll-results flow, file uploads via presigned URLs, even a complete React integration example. One paste, one prompt, the integration is done.",
      },
    ],
    resources: procurementResources,
  },
  {
    id: "banking",
    name: "Banking",
    subtitle: "Loan Underwriting",
    icon: "🏦",
    acts: [
      {
        title: "Act 1: Generate Workflow",
        checklist: [
          "Open OPUS platform",
          "Paste workflow prompt",
          "Wait for generation",
        ],
        promptLabel: "Workflow Prompt",
        prompt: `Build a Swiss mortgage loan underwriting workflow.

The workflow should process a mortgage application end-to-end:

1. DOCUMENT INTAKE: Accept applicant documents (ID, salary certificates, tax returns, property appraisal, bank statements, Pillar 2 statement, Pillar 3a statement). Use text extraction agents to parse each document type and extract structured data (applicant name, income, employment details, property value, existing liabilities, asset breakdown by type).

2. VERIFICATION: Run parallel verification checks -- identity verification agent, employment verification agent, and property valuation agent. Each agent validates the extracted data against known patterns and flags inconsistencies. Collect all verification results.

3. AFFORDABILITY & FINMA EQUITY ANALYSIS: Calculate affordability per FINMA-recognized Swiss Banking Association (SBVg) self-regulation rules (Richtlinien fuer Hypothekarfinanzierungen, Section 3.2) and FINMA Circular 2019/2, Section 4.2:

   - Theoretical interest rate: Use 5% (not the current market rate) to ensure long-term affordability against rising interest rates.
   - Annual costs: Calculate theoretical interest (5% of mortgage amount) + amortization + maintenance costs (1% of property value per year).
   - Affordability threshold: Total annual housing costs must not exceed one-third (33.3%) of gross income.
   - Second income: Only count a co-applicant's income if joint and several liability (Solidarschuldnerschaft) is established.
   - Amortization: The mortgage must be amortized to two-thirds (66.7%) of the lending value within 15 years.
   - Equity requirements (FINMA-supervised): Minimum 20% equity required. Of this, at least 10% must be "hard" equity (cash savings, securities, Pillar 3a withdrawals). Pillar 2 (pension fund) assets may NOT count toward this first 10%. The remaining 10% may come from Pillar 2 pledging or withdrawal.
   - If the hard equity requirement is not met, flag the application for manual review.

4. LTV & RISK SCORING: Calculate loan-to-value ratio using the lower of purchase price and bank valuation. Run a risk scoring agent that evaluates credit risk based on income stability, debt-to-income ratio, property location (canton risk factors), and applicant profile. Assign a risk grade (A through E).

5. DECISION ROUTING: If risk grade A or B and affordability passes and FINMA equity check passes -- auto-approve with standard rate. If affordability marginally fails (within 2% of threshold) or risk grade C -- route to human underwriter for exception review with full case file. If risk grade D or E or hard equity not met -- auto-decline with explanation letter.

6. COMMUNICATION: Generate a personalized decision letter (approval with rate offer, conditional approval with requirements, or decline with specific reasons referencing the failed checks). Send notification to the applicant and to the relationship manager.

Include human review checkpoints at verification and decision stages. All monetary values in CHF.`,
        talkTrack:
          "This workflow encodes actual FINMA regulations and Swiss Banking Association rules -- the 33.3% affordability threshold at 5% theoretical rate, the hard equity requirement where Pillar 2 cannot count toward the first 10%, joint liability checks for second income, and amortization to two-thirds within 15 years. Every check references the specific regulatory section.",
      },
      {
        title: "Act 2: Generate UI",
        checklist: [
          "Open UI generator",
          "Paste UI prompt",
          "Wait for generation",
        ],
        promptLabel: "UI Prompt",
        prompt: `Build a Swiss mortgage loan processing application in Next.js 14 with TypeScript and Tailwind CSS. Premium dark theme.

The application should have these phases that the user progresses through:

1. Property Discovery: Clean form to enter property details (address, canton, asking price, property type, living area, construction year). Show a Mapbox map that pins the property location.

2. Applicant Profile: Form for applicant and co-applicant details -- name, income, employer, employment date. A toggle for "Joint and Several Liability (Solidarschuldnerschaft)" that enables/disables the co-applicant income inclusion. Asset entry section split into: hard equity (savings, securities, Pillar 3a) and soft equity (Pillar 2). Show a live equity summary bar that visualizes the 10% hard / 10% soft split with color coding (green = met, red = not met).

3. Document Upload: A drag-and-drop zone for uploading mortgage documents (ID, salary slips, tax returns, property appraisal, Pillar 2 statement, Pillar 3a statement, bank statements). Show upload progress and document type auto-detection badges.

4. Processing View: An animated multi-step processing screen showing 10 stages (Document Extraction, Identity Verification, Employment Verification, Property Valuation, Income Assessment, FINMA Equity Check, Affordability Calculation, LTV Calculation, Compliance Check, Risk Scoring). Each stage shows a progress spinner, then a green checkmark or red X when complete. Display extracted data and check results in real-time as each stage completes.

5. FINMA Compliance Dashboard: A dedicated section showing:
   - Affordability ratio gauge (threshold line at 33.3%, theoretical rate at 5%)
   - Equity breakdown chart: hard equity vs Pillar 2 with the 10%/10% split clearly visualized
   - Amortization schedule showing path to 66.7% LTV within 15 years
   - Joint liability status indicator
   - Overall FINMA compliance status (pass/fail with specific rule references)

6. Decision Screen: Show the mortgage offer with: LTV ratio gauge, affordability ratio gauge, FINMA equity status badge, risk grade badge (A-E), and three rate options (SARON variable, 5-year fixed, 10-year fixed) as selectable cards with monthly payment calculations in CHF. If marginally failing, show "Referred for Exception Review" with the specific threshold gap.

7. Case File: A complete summary page with all extracted data, verification results, FINMA compliance checks, and the decision rationale in a printable format. Include regulatory references (SBVg Section 3.2, FINMA Circular 2019/2 Section 4.2).

Use Framer Motion for smooth transitions between phases. Recharts for gauges and charts. All currency in CHF. Mock realistic Swiss mortgage data: Kilchberg ZH property at CHF 1,280,000, dual-income couple with CHF 210,000 combined gross, CHF 260,000 hard equity -- this scenario should marginally fail affordability at 34.7% to demonstrate the exception routing.`,
        talkTrack:
          "The UI now has a dedicated FINMA compliance dashboard -- it visualizes the hard equity split, the affordability ratio against the 33.3% threshold, and the amortization schedule. The mock data intentionally fails affordability by 1.4% to show how the system routes edge cases to human review.",
      },
      {
        title: "Act 3: Connect with OPUS Skill File",
        checklist: [
          "Show OPUS API skill file",
          "Explain how it gives AI full API knowledge",
          "Show how any AI coding assistant can hook UI to workflow",
        ],
        promptLabel: "OPUS API Skill File",
        prompt: skillFilePrompt,
        talkTrack:
          "With the OPUS skill file, any AI coding assistant knows how to trigger workflows, upload documents, poll for results, and handle human review steps -- the full integration pattern.",
      },
    ],
    resources: bankingResources,
  },
  {
    id: "hiking",
    name: "Hiking",
    subtitle: "Trip Planner",
    icon: "🥾",
    acts: [
      {
        title: "Act 1: Generate Workflow",
        checklist: [
          "Open OPUS platform",
          "Paste workflow prompt",
          "Wait for generation",
        ],
        promptLabel: "Workflow Prompt",
        prompt: `Build an AI-powered Swiss hiking trip planning workflow.

The workflow should create a complete, personalized hiking itinerary:

1. PROFILE INTAKE: Accept trip parameters -- group size, fitness level (family/casual/athletic/mountaineer), preferred Swiss region (Bernese Oberland, Valais, Graubunden, Ticino, Central Switzerland, Jura), travel dates, trip duration (1-7 days), interests (alpine lakes, waterfalls, wildlife, glacier views, ridge walks, photography, historic paths), accommodation preference (mountain hut, hotel, glamping, bivouac), dietary restrictions, budget in CHF, starting city.

2. TRAIL DISCOVERY: An AI agent that takes the profile and searches for matching Swiss trails. It should evaluate SAC difficulty grade (T1-T6), elevation gain, distance, scenic value, seasonal conditions, and crowd levels. Score each trail on profile match. Return top 3 trail recommendations with detailed specs and a compelling description of why each trail matches the profile.

3. ROUTE PLANNING: For the top-recommended trail, plan the detailed day-by-day itinerary. Include exact waypoints with GPS coordinates, estimated hiking times between waypoints, elevation profile, water sources, rest stops, cable car connections, and SBB train transfers. Factor in the group's fitness level for realistic timing.

4. EXPERIENCE CURATION: Run parallel agents for:
   - Logistics: Plan SBB train connections, cable car schedules, and transfer timing from the starting city to the trailhead and back.
   - Nature & Culture: Identify wildlife viewing opportunities, photography spots, botanical highlights, historical points of interest, and local cultural experiences along the route.
   - Safety: Generate a gear checklist based on the trail difficulty and season, fitness preparation recommendations, emergency contacts (REGA rescue, local mountain guides), weather considerations.

5. PACKAGE ASSEMBLY: Compile everything into a complete trip package. Calculate detailed budget breakdown (transport, accommodation, meals, activities, gear rental) per person. Plan meals considering dietary restrictions and local cuisine (cheese farms, mountain hut half-board, summit picnics). Book accommodation recommendations with contact details and altitude.

6. REVIEW & DELIVERY: Present the complete plan to a human review agent for quality check. On approval, format the final itinerary and send to the requester.

Use parallel execution where possible (the three curation agents should run simultaneously). Include human checkpoints at trail selection and final review.`,
        talkTrack:
          "Notice how this breaks down into specialized AI agents -- one discovers trails, another plans logistics, another handles safety -- and they run in parallel, just like a real travel planning team would work.",
      },
      {
        title: "Act 2: Generate UI",
        checklist: [
          "Open UI generator",
          "Paste UI prompt",
          "Wait for generation",
        ],
        promptLabel: "UI Prompt",
        prompt: `Build a premium Swiss hiking trip planner called "TrailForge" in Next.js 14 with TypeScript, Tailwind CSS, Framer Motion, and Mapbox GL JS. Dark cinematic theme (deep navy #0F172A, emerald #10B981 accent).

The application should have three phases:

Phase 1 - Input Wizard: A 6-step animated wizard with smooth horizontal transitions.
- Step 1: Group size selector with animated hiker silhouettes (1-12), fitness level as visual cards (family, casual, athletic, mountaineer)
- Step 2: Interactive map of Switzerland divided into regions (Bernese Oberland, Valais, Graubunden, Ticino, Central, Jura). Regions highlight on hover and select with ripple effect.
- Step 3: Date picker and duration slider (1-7 days) where dragging reveals a growing trail illustration
- Step 4: Interest bubbles that float with gentle physics ("Alpine Lakes", "Waterfalls", "Wildlife", "Glacier Views", "Ridge Walks", "Photography"). Tap to select, they drift to a selected cluster.
- Step 5: Accommodation cards with background images (mountain hut, glamping, hotel, bivouac) that flip on hover. Budget slider styled as an altimeter gauge.
- Step 6: Starting city selector as a Swiss rail map (Zurich, Geneva, Bern, Basel, Lugano). Cities glow when selected.
Progress bar styled as a mountain ridge with a tiny animated hiker walking across peaks.

Phase 2 - Generation Experience: Full-viewport cinematic loading with dark background and star particles. Five animated stages:
- "Discovering Trails" -- topographic map draws itself with glowing contour lines, trail pins drop in
- "Planning Route" -- route line draws on map with glowing particle trail, waypoint icons pop up
- "Curating Experience" -- three agent cards slide in (Logistics, Nature, Safety) with parallel progress rings
- "Crafting Package" -- cards merge into glowing orb, budget numbers tick like a stock counter
- "Adventure Ready" -- orb bursts into light revealing results with confetti
Smooth progress bar across the top throughout all stages.

Phase 3 - Results:
- Hero card with trail recommendation, match score gauge, key stats (distance, elevation, duration)
- Full Mapbox 3D terrain map with animated route line that draws itself, custom waypoint markers, elevation flyover button, day segment colors
- Day-by-day itinerary as a vertical timeline with alternating cards
- Transport section as animated rail journey visualization
- Budget donut chart with itemized breakdown in CHF
- Interactive gear checklist with check animations

Mock data for 3 real Swiss trails: Eiger Trail (Grindelwald), Oeschinensee Loop (Kandersteg), 5-Seen-Wanderung (Pizol). Use real coordinates and elevations.`,
        talkTrack:
          "The TrailForge UI is a cinematic experience -- from adventure profiling to 3D trail maps.",
      },
      {
        title: "Act 3: Connect with OPUS Skill File",
        checklist: [
          "Show OPUS API skill file",
          "Explain how it gives AI full API knowledge",
          "Show how any AI coding assistant can hook UI to workflow",
        ],
        promptLabel: "OPUS API Skill File",
        prompt: skillFilePrompt,
        talkTrack:
          "The skill file contains every OPUS API endpoint, every data type, every workflow pattern. Any AI assistant that reads it can build the integration layer between this UI and the workflow engine.",
      },
    ],
    resources: hikingResources,
  },
];
