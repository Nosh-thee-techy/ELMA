/** Official & open data sources ELMA is designed to ingest (Track 2 & 3). */

export type DataSourceId =
  | "ppip"
  | "cob"
  | "county_portal"
  | "ndma"
  | "kmd"
  | "wra"
  | "krcs_ndoc"
  | "osm_hot";

export type DataSourceCatalogEntry = {
  id: DataSourceId;
  track: 2 | 3;
  name: string;
  portal: string;
  dataProvided: string[];
  ingestion: string;
};

export const track2Sources: DataSourceCatalogEntry[] = [
  {
    id: "ppip",
    track: 2,
    name: "Public Procurement Information Portal (PPIP)",
    portal: "tenders.go.ke",
    dataProvided: [
      "Ward-level drainage tenders",
      "Emergency road repair contracts",
      "Awarded contractors and contract values",
      "Bidding status",
    ],
    ingestion: "HTML scraping or structured JSON via e-GP backend endpoints",
  },
  {
    id: "cob",
    track: 2,
    name: "Office of the Controller of Budget (COB)",
    portal: "cob.go.ke",
    dataProvided: [
      "Quarterly County Budget Implementation Review Reports (CBIRR)",
      "Emergency fund allocation vs actual expenditure per county",
    ],
    ingestion: "PDF reports (pdfplumber, pypdf, etc.)",
  },
  {
    id: "county_portal",
    track: 2,
    name: "County government portals",
    portal: "Nairobi, Kisumu, Garissa, Kilifi, …",
    dataProvided: [
      "Annual Development Plans (ADPs)",
      "County Integrated Development Plans (CIDPs)",
      "Designated public evacuation sites",
    ],
    ingestion: "PDF/CSV budget documents",
  },
  {
    id: "ndma",
    track: 2,
    name: "National Disaster Management Authority (NDMA)",
    portal: "ndma.go.ke",
    dataProvided: [
      "Monthly county drought/flood bulletins",
      "HSNP cash transfer disbursements",
      "County hazard classifications (Normal → Emergency)",
    ],
    ingestion: "Monthly PDF updates and situation briefs",
  },
];

export const track3Sources: DataSourceCatalogEntry[] = [
  {
    id: "kmd",
    track: 3,
    name: "Kenya Meteorological Department (KMD)",
    portal: "meteo.go.ke",
    dataProvided: [
      "Daily and 5-day county forecasts",
      "Severe rainfall advisories",
      "El Niño / La Niña outlooks",
    ],
    ingestion: "Web tables, PDF press releases, RSS",
  },
  {
    id: "wra",
    track: 3,
    name: "Water Resources Authority (WRA)",
    portal: "wra.go.ke",
    dataProvided: [
      "River gauging levels (Tana, Nyando, Nzoia, …)",
      "Threshold alerts and flood hazard zones",
    ],
    ingestion: "Hydrological bulletins and station telemetry",
  },
  {
    id: "krcs_ndoc",
    track: 3,
    name: "KRCS & National Disaster Operations Centre",
    portal: "1199 / NDOC situational reports",
    dataProvided: [
      "Emergency hotlines",
      "Displacement statistics",
      "Active response hub locations",
    ],
    ingestion: "API/RSS feeds and situational reports",
  },
  {
    id: "osm_hot",
    track: 3,
    name: "OpenStreetMap / HOT Kenya",
    portal: "Overpass API",
    dataProvided: [
      "Ward boundary GeoJSON",
      "Schools, health centers, road networks for evacuation maps",
    ],
    ingestion: "Overpass API or GeoJSON / shapefiles",
  },
];

export const allDataSources = [...track2Sources, ...track3Sources];

export function sourceLabel(id: DataSourceId): string {
  return allDataSources.find((s) => s.id === id)?.name ?? id;
}
