import { NotImplementedError } from "./errors";
import {
  Collection,
  NullSortingState,
  RawCollection,
  SortState,
} from "./data-table";

export class ProjectView {
  public readonly _id: string;
  [name: string]: any;

  constructor(raw: { _id: string; [name: string]: any }) {
    this._id = raw._id;
    Object.keys(raw).forEach((x) => {
      this[x] = raw[x];
    });
  }

  get id() {
    return this._id;
  }
}

export enum ProjectStatus {
  Verified,
  Incomplete,
  Unknown,
}

export class ProjectViewsCollection implements Collection<ProjectView> {
  private raw: RawCollection;

  public readonly meta: {
    readonly sorting: SortState;
  };

  public static empty() {
    return new ProjectViewsCollection({
      meta: { sorting: NullSortingState },
      items: [],
    });
  }

  public static loadFromRaw(raw: RawCollection) {
    return new ProjectViewsCollection(raw);
  }

  private constructor(raw: RawCollection) {
    this.raw = raw;
    this.meta = raw.meta;
  }

  get items(): Array<ProjectView> {
    return this.raw.items.map((raw) => {
      return new ProjectView(raw);
    });
  }
}

export interface IProjectFilter {
  label: string;
}

export type ProjectFilters = Array<IProjectFilter>;

// currently a fake client for projects
export interface IProjectsClient {
  listFilters(): Promise<ProjectFilters>;
  listProjects(
    filters: Array<IProjectFilter>,
    dateRange: Date[],
    sorting: SortState,
  ): Promise<ProjectViewsCollection>;
}

export class NullProjectsClient implements IProjectsClient {
  async listFilters(): Promise<ProjectFilters> {
    console.log(
      "Null client in use. This should only happen during initialization.",
    );
    return [];
  }

  async listProjects(
    filters: ProjectFilters,
    dateRange: Date[],
    sorting: SortState,
  ): Promise<ProjectViewsCollection> {
    console.log(
      "Null client in use. This should only happen during initialization.",
    );
    return ProjectViewsCollection.loadFromRaw({
      items: [],
      meta: {
        sorting: NullSortingState,
      },
    });
  }
}

export class ProjectsClient implements IProjectsClient {
  async listFilters(): Promise<Array<IProjectFilter>> {
    return [
      { label: "Optimism" },
      { label: "Retro PGF Eligible" },
      { label: "Developer Ecosystem" },
    ];
  }

  async listProjects(
    filters: Array<IProjectFilter>,
    dateRange: Date[],
    sorting: SortState,
  ): Promise<ProjectViewsCollection> {
    return ProjectViewsCollection.loadFromRaw({
      items: [],
      meta: {
        sorting: NullSortingState,
      },
    });
  }
}

export class StaticProjectsClient implements IProjectsClient {
  filters: ProjectFilters;
  projects: ProjectViewsCollection;

  public static loadFromRaw(
    filters: ProjectFilters,
    projectsRaw: RawCollection,
  ) {
    return new StaticProjectsClient(
      filters,
      ProjectViewsCollection.loadFromRaw(projectsRaw),
    );
  }

  // For testing purposes simply returns current known values.
  constructor(filters: ProjectFilters, projects: ProjectViewsCollection) {
    this.filters = filters;
    this.projects = projects;
  }

  async listFilters(): Promise<Array<IProjectFilter>> {
    return this.filters;
  }

  async listProjects(
    filters: Array<IProjectFilter>,
    dateRange: Date[],
    sorting: SortState,
  ): Promise<ProjectViewsCollection> {
    return this.projects;
  }
}
