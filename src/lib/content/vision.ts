/** Product vision: information asymmetry → Part 1 (before) + Part 2 (during). */

export const informationGapBullets = [
  "What was actually allocated for their ward or neighborhood",
  "Where physical resources are stored (boats, water tanks, food, medical supplies)",
  "Which public facilities are official evacuation centers (schools, social halls)",
] as const;

export const part1Vision = {
  title: "Part 1 · Pre-disaster — transparency & public preparedness",
  tagline: "Track 2",
  summary:
    "Before floods, people should see how resources are allocated and how they are moving — not only after scandal hits the news.",
  features: [
    {
      heading: "Ward resource & budget visibility",
      body: "Turn county budgets, tender disclosures (PPIP), and ADP/CIDP lines into a simple ward view: desilting projects, contractors, deadlines, and designated shelters.",
    },
    {
      heading: "Integrity layer (blockchain-ready)",
      body: "Store allocation records, tender document hashes, and release logs on an immutable ledger or hash chain so completion status and spend cannot be quietly altered without a public discrepancy alert.",
    },
    {
      heading: "Personal & community readiness",
      body: 'Clear answers to: “What has been set aside for us, and what should we do before the rain starts?”',
    },
  ],
} as const;

export const part2Vision = {
  title: "Part 2 · During disaster — multi-channel dispatch",
  tagline: "Track 3",
  summary:
    "When data networks fail and rumors spread, reach people on the channels that still work: USSD, SMS, voice, and WhatsApp.",
  channels: [
    {
      id: "ussd",
      name: "USSD (*XXX#)",
      why: "Works on feature phones (Kabambe) with no internet — locate nearest high-ground shelter or send a distress ping.",
    },
    {
      id: "sms",
      name: "SMS & ward broadcasts",
      why: "Location-based text when river gauges or KMD/WRA thresholds are exceeded (M-Salama-style alerts).",
    },
    {
      id: "voice",
      name: "Voice / IVR",
      why: "Hands-free and low-literacy friendly during active evacuations.",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      why: "Urban areas with data: pin GPS, share photos of rising water, receive verified ward updates.",
    },
  ],
} as const;

export const coreProblem =
  "During El Niño, the gap is not only missing money — it is information asymmetry. National and county budgets are announced, but an ordinary resident in a flood-prone ward often has no visibility into ward-level allocation, stored resources, or official evacuation sites.";
