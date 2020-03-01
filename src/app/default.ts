import { IFilter } from './interface';

export const FILTER: IFilter = {
  per: 10,
  page: 1,
  tab: 0,
  searchText: ''
} as const;

export const TAB_GROUP = {
  0: '所有口罩',
  1: '成人口罩',
  2: '兒童口罩'
} as const;

export const TAB_OPTION = {
  0: 'all',
  1: 'mask_adult',
  2: 'mask_child'
} as const;
