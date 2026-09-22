/**
 * Pexels CDN URLs (verified 200) — Kenya / East & West Africa, free license.
 * @see https://www.pexels.com/license/
 */
export function pexelsPhoto(id: number, width = 800): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export const elmaPhotos = {
  /** Maasai community celebration — Kisumu/Mara region context */
  heroCommunity: pexelsPhoto(35034045, 1400),
  /** Traditional ceremony — collective response */
  heroRelief: pexelsPhoto(35034067, 1400),
  /** Nairobi street market — ward daily life */
  audienceResidents: pexelsPhoto(33730494, 700),
  /** Maasai members working together — disaster committee metaphor */
  audienceCommittee: pexelsPhoto(35034058, 700),
  /** African woman using phone — advocates & citizen reporters */
  audienceAdvocate: pexelsPhoto(7433210, 700),
  /** Accra — smartphone on the street (connectivity without fiber) */
  audienceLowConnect: pexelsPhoto(14210063, 700),
  /** Konza, Machakos — Kenyan infrastructure / drainage works */
  proofDrainageCrew: pexelsPhoto(10974981, 1000),
  /** Maasai mother & child — shelter & care */
  proofShelterCommunity: pexelsPhoto(37416875, 1000),
  /** African woman on mobile — emergency reporting */
  safetyReporting: pexelsPhoto(7433210, 1200),
  /** Konza construction — responder / field ops */
  responderField: pexelsPhoto(10974981, 1000),
  /** Second field proof — community gathering */
  proofCommunitySecond: pexelsPhoto(35034045, 1000),
} as const;

export const audiencePhotoById: Record<string, string> = {
  residents: elmaPhotos.audienceResidents,
  committees: elmaPhotos.audienceCommittee,
  advocates: elmaPhotos.audienceAdvocate,
  "low-connectivity": elmaPhotos.audienceLowConnect,
};
