import { Property } from "csstype";

export type DataTableField = {
  type: string;
  name: string;
  label: string;
  sortable: boolean;
  expandable: boolean;
  minWidth?: number;
  textAlign?: Property.TextAlign;
};

export enum SortingDirection {
  None,
  Ascending,
  Descending,
}

export interface SortState {
  direction: SortingDirection;
  field: string;
}

export const NullSortingState = { direction: SortingDirection.None, field: "" };

export type DataTableConfig = {
  fields: {
    [name: string]: DataTableField;
  };
  types: {
    [name: string]: DataTableTypeConfig;
  };
  fieldOrder: Array<string>;
};

export interface DataTableHeaderComponentProps {
  field: DataTableField;
}

export interface DataTableCellComponentProps {
  value: any;
  field: DataTableField;
  data: any;
  isExpanded: boolean;
  onExpand: (data: any, field: DataTableField) => void;
}

export type DataTableCellComponent = (
  props: DataTableCellComponentProps,
) => JSX.Element;
export type DataTableHeaderComponent = (
  props: DataTableHeaderComponentProps,
) => JSX.Element;

export type DataTableTypeConfig = {
  cellComponent?: DataTableCellComponent;
  headerComponent?: DataTableHeaderComponent;
};

export interface ViewType {
  id: string;
  [name: string]: any;
}

export interface Collection<T extends ViewType> {
  meta: {
    sorting: SortState;
  };
  items: Array<T>;
}

export type RawCollection = Collection<any>;

export function emptyCollection(): RawCollection {
  return {
    meta: {
      sorting: NullSortingState,
    },
    items: [],
  };
}

export type DataTableExpandedComponentProps = {
  value: any;
};
