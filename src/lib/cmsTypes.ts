/** Collections pre-rendered into pages so visitors see live CMS content on first paint. */
export type PublicCmsCollectionName =
  | 'settings'
  | 'members'
  | 'dramas'
  | 'programs'
  | 'events'
  | 'gallery'
  | 'gallery_categories'
  | 'videos'
  | 'seo'
  | 'privacy_policy';

export type CmsSnapshot = Partial<
  Record<PublicCmsCollectionName, Array<{ id: string } & Record<string, unknown>>>
>;
