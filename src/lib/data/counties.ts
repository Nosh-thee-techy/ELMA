export type KenyaCounty = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  /** PoC has full fund + tender breakdown */
  hasDemoData: boolean;
};

export const KENYA_COUNTIES: KenyaCounty[] = [
  { slug: "nairobi", name: "Nairobi", lat: -1.2864, lng: 36.8172, hasDemoData: true },
  { slug: "kisumu", name: "Kisumu", lat: -0.102, lng: 34.762, hasDemoData: true },
  { slug: "garissa", name: "Garissa", lat: -0.453, lng: 39.646, hasDemoData: true },
  { slug: "kilifi", name: "Kilifi", lat: -3.51, lng: 39.909, hasDemoData: true },
  { slug: "mombasa", name: "Mombasa", lat: -4.043, lng: 39.668, hasDemoData: false },
  { slug: "turkana", name: "Turkana", lat: 3.119, lng: 35.597, hasDemoData: false },
  { slug: "mandera", name: "Mandera", lat: 3.937, lng: 41.857, hasDemoData: false },
  { slug: "wajir", name: "Wajir", lat: 1.747, lng: 40.057, hasDemoData: false },
  { slug: "marsabit", name: "Marsabit", lat: 2.328, lng: 37.99, hasDemoData: false },
  { slug: "isiolo", name: "Isiolo", lat: 0.355, lng: 37.583, hasDemoData: false },
  { slug: "meru", name: "Meru", lat: 0.047, lng: 37.655, hasDemoData: false },
  { slug: "nyeri", name: "Nyeri", lat: -0.417, lng: 36.951, hasDemoData: false },
  { slug: "nakuru", name: "Nakuru", lat: -0.303, lng: 36.08, hasDemoData: false },
  { slug: "uasin-gishu", name: "Uasin Gishu", lat: 0.514, lng: 35.27, hasDemoData: false },
  { slug: "kakamega", name: "Kakamega", lat: 0.282, lng: 34.754, hasDemoData: false },
  { slug: "bungoma", name: "Bungoma", lat: 0.563, lng: 34.561, hasDemoData: false },
  { slug: "siaya", name: "Siaya", lat: 0.062, lng: 34.288, hasDemoData: false },
  { slug: "homabay", name: "Homa Bay", lat: -0.527, lng: 34.457, hasDemoData: false },
  { slug: "migori", name: "Migori", lat: -1.063, lng: 34.473, hasDemoData: false },
  { slug: "kajiado", name: "Kajiado", lat: -1.852, lng: 36.776, hasDemoData: false },
];

export function countyBySlug(slug: string): KenyaCounty | undefined {
  return KENYA_COUNTIES.find((c) => c.slug === slug);
}

export function countyByName(name: string): KenyaCounty | undefined {
  return KENYA_COUNTIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function slugFromCountyName(name: string): string {
  return countyByName(name)?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
}
