export type HazardId =
  | "flooding"
  | "trapped"
  | "medical"
  | "landslide"
  | "infrastructure"
  | "other";

export type HazardGuide = {
  id: HazardId;
  label: string;
  doNow: string[];
  doNot: string[];
  after: string[];
};

export const hazardGuides: HazardGuide[] = [
  {
    id: "flooding",
    label: "Flooding / water rising",
    doNow: [
      "Move to higher ground — roof, upper floor, or stable high ground.",
      "Switch off electricity at the main breaker if water is not yet inside.",
      "Keep your phone charged; share ward and nearest landmark in any report.",
    ],
    doNot: [
      "Do not walk or drive through moving water.",
      "Do not touch wet electrical fittings.",
    ],
    after: [
      "Boil or treat drinking water until officials clear the supply.",
      "Photograph damage for ward relief lists; keep your report reference.",
    ],
  },
  {
    id: "trapped",
    label: "Trapped / need rescue",
    doNow: [
      "Make noise at regular intervals so searchers can locate you.",
      "Conserve phone battery — SMS or USSD if data fails.",
      "If safe, note exact location: estate, stage, school, or church name.",
    ],
    doNot: [
      "Do not light fires in enclosed spaces with unknown gas leaks.",
      "Do not move heavy debris alone.",
    ],
    after: [
      "Seek medical check even if injuries seem minor.",
      "Register with ward shelter desk if you cannot return home.",
    ],
  },
  {
    id: "medical",
    label: "Medical emergency",
    doNow: [
      "Call emergency services or ask someone nearby to call for you.",
      "Keep the person warm, still, and breathing if possible.",
      "Send a report with ward + callback number if ambulances are delayed.",
    ],
    doNot: [
      "Do not give food or drink to someone who may need surgery.",
      "Do not move someone with a possible spine injury unless immediate danger.",
    ],
    after: [
      "Keep hospital papers for relief and insurance follow-up.",
      "Note medicine and allergies for shelter health desk.",
    ],
  },
  {
    id: "landslide",
    label: "Landslide / mudslide",
    doNow: [
      "Leave the slope; move sideways across the hill if escape route is blocked.",
      "Watch for new cracks, leaning trees, or sudden muddy flows.",
    ],
    doNot: [
      "Do not return for belongings while ground is still moving.",
      "Do not shelter at the base of steep banks.",
    ],
    after: [
      "Stay away until county engineers clear the area.",
      "Report blocked roads so responders can reroute aid.",
    ],
  },
  {
    id: "infrastructure",
    label: "Bridge / road failure",
    doNow: [
      "Keep people away from the edge; rope off if you can do so safely.",
      "Report exact structure name and whether vehicles are involved.",
    ],
    doNot: [
      "Do not test weak bridges or culverts with vehicle weight.",
    ],
    after: [
      "Use official detours; share photos with ward disaster desk only when safe.",
    ],
  },
  {
    id: "other",
    label: "Other hazard",
    doNow: [
      "Get to the safest nearby place and describe what you see clearly.",
      "Use USSD *384*253# option 1 if the app will not load.",
    ],
    doNot: [
      "Do not spread unverified evacuation orders — wait for ward or county SMS.",
    ],
    after: [
      "Check /explore on the website when online for county updates.",
    ],
  },
];

export const preparednessChecklist = [
  { id: "water", label: "3 days drinking water stored" },
  { id: "contacts", label: "Family meet-up point agreed" },
  { id: "documents", label: "IDs and insurance copies in waterproof bag" },
  { id: "torch", label: "Torch, radio, or power bank charged" },
  { id: "meds", label: "Essential medicines packed" },
  { id: "ussd", label: "Know USSD *384*253# by heart" },
] as const;

export const USSD_SHORT_CODE = "*384*253#";
