export interface SiteRecipe {
  viewport?: { width: number; height: number };
  userAgent?: string;
  waitCondition?: string;
  clickSelectors?: string[];
  removeSelectors?: string[];
  maxScrolls?: number;
  name?: string;
}
