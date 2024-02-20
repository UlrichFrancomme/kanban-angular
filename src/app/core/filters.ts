import { Priority } from './task';

export type Filters = {
  title?: string;
  priorities?: Priority[];
  authors?: string[];
};

export function filtersAreEmpty(filters: Filters): boolean {
  return (
    !filters.title?.length &&
    !filters.priorities?.length &&
    !filters.authors?.length
  );
}
