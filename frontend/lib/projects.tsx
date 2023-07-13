import {
  Collection,
  NullSortingState,
  RawCollection,
  SortState,
} from "./data-table";
import { generate } from "random-words";

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
    _filters: ProjectFilters,
    _dateRange: Date[],
    _sorting: SortState,
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
    _filters: Array<IProjectFilter>,
    _dateRange: Date[],
    _sorting: SortState,
  ): Promise<ProjectViewsCollection> {
    return ProjectViewsCollection.loadFromRaw({
      items: [],
      meta: {
        sorting: NullSortingState,
      },
    });
  }
}

export class RandomTestProjectsClient implements IProjectsClient {
  filters: ProjectFilters;
  projects: ProjectViewsCollection;
  size: number;

  public static loadFromRaw(
    size: number,
    filters?: ProjectFilters,
    projectsRaw?: RawCollection,
  ) {
    let projects: ProjectViewsCollection = ProjectViewsCollection.empty();
    if (projectsRaw !== undefined) {
      projects = ProjectViewsCollection.loadFromRaw(projectsRaw);
    }
    return new RandomTestProjectsClient(size, filters, projects);
  }

  // For testing purposes simply returns current known values.
  constructor(
    size: number,
    filters?: ProjectFilters,
    projects?: ProjectViewsCollection,
  ) {
    this.size = size;
    this.filters = filters ?? [];
    this.projects = projects ?? ProjectViewsCollection.empty();
  }

  async listFilters(): Promise<Array<IProjectFilter>> {
    return this.filters;
  }

  randomProjects(count: number): Array<ProjectView> {
    const projects = [];
    for (let i = 0; i < count; i++) {
      projects.push(this.randomProject());
    }
    return projects;
  }

  randomInt(max: number): number {
    return Math.round(Math.random() * max);
  }

  randomGrowth() {
    const negative = Math.random() > 0.5 ? -1 : 1;
    return {
      current: this.randomInt(100000),
      growth: (negative * Math.round(Math.random() * 100)) / 100,
    };
  }

  randomProjectField() {
    const name = generate(1 + this.randomInt(2)).join(" ");
    const repo = generate(2).join("/");
    return {
      name: name,
      repo: repo,
    };
  }

  randomProject(): ProjectView {
    const statusMap: { [num: number]: string } = {
      0: "Verified",
      1: "Incomplete",
      2: "Unknown",
    };
    return new ProjectView({
      _id: `${Math.round(Math.random() * 100000)}`,
      project: this.randomProjectField(),
      status: statusMap[this.randomInt(2)],
      dependencies: this.randomInt(1000000),
      activeDevs: this.randomGrowth(),
      devReach: this.randomGrowth(),
      opMaus: this.randomGrowth(),
      opMausReach: this.randomGrowth(),
    });
  }

  async listProjects(
    filters: Array<IProjectFilter>,
    dateRange: Date[],
    sorting: SortState,
  ): Promise<ProjectViewsCollection> {
    const items = this.projects.items;
    items.push(...this.randomProjects(this.size));
    console.log(items);
    const raw = {
      meta: {
        sorting: sorting,
      },
      items: items,
    };
    return ProjectViewsCollection.loadFromRaw(raw);
  }
}
