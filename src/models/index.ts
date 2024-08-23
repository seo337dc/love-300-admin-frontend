export class PageInfoDto<T = any> {
  content?: T;
  number?: number;
  size?: number;
  first?: boolean;
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
}
