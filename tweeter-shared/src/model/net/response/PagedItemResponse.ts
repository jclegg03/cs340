// AI-assisted: see AI-ATTRIBUTION.md

// Body the paged endpoints send back: one page of items, and whether there are more
// after it. T is the item's DTO type, e.g. UserDto or StatusDto. Those lambdas must
// return this type, and the frontend reads the response as this type.
export interface PagedItemResponse<T> {
  readonly items: T[];
  readonly hasMore: boolean;
}
