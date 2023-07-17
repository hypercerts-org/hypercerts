import {
  Collection,
  NullSortingState,
  RawCollection,
  SortingDirection,
  SortState,
} from "./data-table";
import { generate } from "random-words";
import { uuid4 } from "@sentry/utils";
import * as _ from "lodash";

export type GrowthMetric = {
  current: number;
  growth: number;
};

export type ProjectReference = {
  name: string;
  repo: string;
};

export interface ProjectBase {
  _id: string;
  project: ProjectReference;
  status: ProjectStatus;
  dependencies: number;
  activeDevs: GrowthMetric;
  devReach: GrowthMetric;
  opMaus: GrowthMetric;
  opMausReach: GrowthMetric;
  contracts?: number;
  factories?: number;
  releases?: number;
  stars?: number;
  tags?: string[];
  dependsOn?: string[];
  [name: string]: any;
}

export interface IProjectView extends ProjectBase {
  dependents(): Promise<IProjectView[]>;
  id: string;
}

export class EmptyProjectView implements IProjectView {
  _id = "empty";
  id = "empty";
  project = { name: "", repo: "" };
  status = ProjectStatus.Unknown;
  dependencies = 0;
  activeDevs = { current: 0, growth: 0 };
  devReach = { current: 0, growth: 0 };
  opMaus = { current: 0, growth: 0 };
  opMausReach = { current: 0, growth: 0 };
  contracts = 0;
  factories = 0;
  stars = 0;
  tags = [];
  dependsOn = [];
  [name: string]: any;

  async dependents(): Promise<IProjectView[]> {
    return [];
  }
}

export class ProjectView implements IProjectView {
  public readonly _id: string;
  private client?: IProjectsClient;

  project: {
    name: string;
    repo: string;
  };
  status: ProjectStatus;
  dependencies: number;
  activeDevs: GrowthMetric;
  devReach: GrowthMetric;
  opMaus: GrowthMetric;
  opMausReach: GrowthMetric;
  contracts?: number;
  factories?: number;
  stars?: number;
  tags?: string[];
  dependsOn?: string[];
  releases?: number;
  [name: string]: any;

  constructor(raw: ProjectBase, client?: IProjectsClient) {
    this._id = raw._id;
    this.client = client;
    this.project = raw.project;
    this.status = raw.status;
    this.dependencies = raw.dependencies;
    this.activeDevs = raw.activeDevs;
    this.devReach = raw.devReach;
    this.opMaus = raw.opMaus;
    this.opMausReach = raw.opMausReach;
    this.contracts = raw.contracts || 0;
    this.factories = raw.factories || 0;
    this.stars = raw.stars || 0;
    this.tags = raw.tags || [];
    this.dependsOn = raw.dependsOn || [];

    Object.keys(raw).forEach((name) => {
      this[name] = raw[name];
    });
  }

  get id() {
    return this._id;
  }

  async dependents(): Promise<IProjectView[]> {
    const client = this.client;
    if (client === undefined) {
      return [];
    }
    return client.dependents(this.project.repo);
  }
}

export enum ProjectStatus {
  Verified,
  Incomplete,
  Unknown,
}

function randomInt(max: number): number {
  return Math.round(Math.random() * max);
}

function randomIntRange(min: number, max: number): number {
  const delta = max - min;
  return Math.round(Math.random() * delta) + min;
}

export class ProjectViewsCollection implements Collection<ProjectView> {
  private raw: Collection<IProjectView>;
  private client?: IProjectsClient;

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

  public static fromArray(views: IProjectView[]) {
    return ProjectViewsCollection.loadFromRaw({
      meta: {
        sorting: NullSortingState,
      },
      items: views,
    });
  }

  private constructor(raw: RawCollection) {
    this.raw = raw;
    this.meta = raw.meta;
  }

  get items(): Array<ProjectView> {
    return this.raw.items.map((raw) => {
      return new ProjectView(raw, this.client);
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
  ): Promise<Collection<ProjectView>>;
  byRepo(repo: string): Promise<ProjectView>;
  byName(name: string): Promise<ProjectView>;
  dependents(repo: string): Promise<IProjectView[]>;
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

  async byRepo(_repo: string): Promise<ProjectView> {
    return new EmptyProjectView();
  }

  async byName(_name: string): Promise<ProjectView> {
    return new EmptyProjectView();
  }

  async dependents(_repo: string): Promise<IProjectView[]> {
    return [];
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

  async byRepo(_repo: string): Promise<ProjectView> {
    return new EmptyProjectView();
  }

  async byName(_name: string): Promise<ProjectView> {
    return new EmptyProjectView();
  }

  async dependents(_repo: string): Promise<IProjectView[]> {
    return [];
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

  randomGrowth() {
    const negative = Math.random() > 0.5 ? -1 : 1;
    return {
      current: randomInt(100000),
      growth: (negative * Math.round(Math.random() * 100)) / 100,
    };
  }

  randomProjectField() {
    const name = generate(1 + randomInt(2)).join(" ");
    const repo = generate(2).join("/");
    return {
      name: name,
      repo: repo,
    };
  }

  randomProject(): ProjectView {
    const statusMap: { [num: number]: ProjectStatus } = {
      0: ProjectStatus.Verified,
      1: ProjectStatus.Incomplete,
      2: ProjectStatus.Unknown,
    };
    return new ProjectView(
      {
        _id: `${Math.round(Math.random() * 100000)}`,
        project: this.randomProjectField(),
        status: statusMap[randomInt(2)],
        releases: 0,
        dependencies: randomInt(1000000),
        activeDevs: this.randomGrowth(),
        devReach: this.randomGrowth(),
        opMaus: this.randomGrowth(),
        opMausReach: this.randomGrowth(),
      },
      this,
    );
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

  async byRepo(_repo: string): Promise<ProjectView> {
    return new EmptyProjectView();
  }

  async byName(_name: string): Promise<ProjectView> {
    return new EmptyProjectView();
  }

  async dependents(_repo: string): Promise<IProjectView[]> {
    return [];
  }
}

export type FakeDataRandomRange = [number, number];

export interface FakeProjectConfig {
  project: {
    name: string;
    repo: string;
  };
  status: ProjectStatus;
  dependencies: number;
  activeDevs: FakeDataRandomRange;
  devReach: FakeDataRandomRange;
  opMaus: FakeDataRandomRange;
  opMausReach: FakeDataRandomRange;
  contracts: number;
  factories: number;
  stars: FakeDataRandomRange;
  tags: string[];
  dependsOn: string[];
  releases: FakeDataRandomRange;
}

export interface FakeDataConfig {
  filters: ProjectFilters;
  projects: Array<FakeProjectConfig>;
}

export type SortFunc = (a: any, b: any) => number;

function growthMetricSort(a: GrowthMetric, b: GrowthMetric) {
  return a.current - b.current;
}

function numberSort(a: number, b: number) {
  return a - b;
}

function statusSort(a: ProjectStatus, b: ProjectStatus) {
  return a - b;
}

export class FakeProjectsClient implements IProjectsClient {
  private config: FakeDataConfig;
  private projects: ProjectView[];
  private byRepoMap: { [name: string]: ProjectView };
  private byNameMap: { [name: string]: ProjectView };
  private dependentsMap: { [name: string]: ProjectView[] };

  public static fromFakeConfig(config: FakeDataConfig) {
    // Create the projects
    const client = new FakeProjectsClient(config);
    client.loadConfig();
    return client;
  }

  constructor(config: FakeDataConfig) {
    this.config = config;
    this.byNameMap = {};
    this.byRepoMap = {};
    this.projects = [];
    this.dependentsMap = {};
  }

  private loadConfig() {
    this.projects = this.config.projects.map((project) => {
      return new ProjectView(
        {
          _id: uuid4(),
          project: project.project,
          status: project.status,
          dependencies: project.dependencies,
          activeDevs: {
            current: randomIntRange(...project.activeDevs),
            growth: Math.random(),
          },
          devReach: {
            current: randomIntRange(...project.devReach),
            growth: Math.random(),
          },
          opMaus: {
            current: randomIntRange(...project.opMaus),
            growth: Math.random(),
          },
          opMausReach: {
            current: randomIntRange(...project.opMausReach),
            growth: Math.random(),
          },
          contracts: project.contracts,
          factories: project.factories,
          stars: randomIntRange(...project.stars),
          tags: project.tags,
          dependsOn: project.dependsOn,
          releases: randomIntRange(...project.releases),
        },
        this,
      );
    });

    this.projects.forEach((project) => {
      this.byNameMap[project.project.name] = project;
      this.byRepoMap[project.project.repo] = project;
      this.dependentsMap[project.project.repo] = [];
    });

    this.projects.forEach((project) => {
      const dependsOn = project.dependsOn || [];
      dependsOn.forEach((repo) => {
        this.dependentsMap[repo].push(project);
      });
    });
    console.log("dep map");
    console.log(this.dependentsMap);
  }

  async listFilters(): Promise<ProjectFilters> {
    return this.config.filters;
  }

  async listProjects(
    filters: Array<IProjectFilter>,
    dateRange: Date[],
    sorting: SortState,
  ): Promise<Collection<ProjectView>> {
    const sortStrategies: { [name: string]: SortFunc } = {
      opMaus: growthMetricSort,
      opMausReach: growthMetricSort,
      project: (a: ProjectReference, b: ProjectReference) => {
        return a.name.localeCompare(b.name);
      },
      status: statusSort,
      dependencies: numberSort,
      activeDevs: growthMetricSort,
      devReach: growthMetricSort,
    };

    let items = [...this.projects];
    if (filters.length !== 0) {
      const filterLabels = filters.map((filter) => {
        return filter.label;
      });
      items = items.filter((project) => {
        return _.intersection(filterLabels, project.tags).length !== 0;
      });
    }

    // Handle sorting
    const strategy = sortStrategies[sorting.field];
    console.log(sorting.field);
    if (strategy !== undefined) {
      console.log(`applying sort for ${sorting.field}`);
      items = items.sort((a, b) => {
        return strategy(a[sorting.field], b[sorting.field]);
      });
      if (sorting.direction == SortingDirection.Descending) {
        items.reverse();
      }
    }

    return {
      meta: {
        sorting: sorting,
      },
      items: items,
    };
  }

  async byRepo(repo: string): Promise<ProjectView> {
    return this.byRepoMap[repo];
  }

  async byName(name: string): Promise<ProjectView> {
    return this.byNameMap[name];
  }

  async dependents(repo: string): Promise<IProjectView[]> {
    return this.dependentsMap[repo];
  }
}

// Fake data mapper
export function fakeDataGenerator(): FakeDataConfig {
  // Frontpage tags
  const frontPageTags = [
    "Optimism",
    "Retro PGF Eligible",
    "Developer Ecosystem",
  ];
  const fakeData: FakeDataConfig = {
    filters: [
      { label: "Optimism" },
      { label: "Retro PGF Eligible" },
      { label: "Developer Ecosystem" },
    ],
    projects: [
      // Ethers
      {
        project: {
          name: "ethers",
          repo: "ethers-io/ethers.js",
        },
        status: ProjectStatus.Verified,
        dependencies: 15150,
        activeDevs: [1, 2],
        devReach: [20000, 30000],
        opMaus: [0, 0],
        opMausReach: [1000000, 2000000],
        contracts: 0,
        factories: 0,
        stars: [6900, 7000],
        releases: [10, 100],
        tags: frontPageTags,
        dependsOn: [],
      },
      // Wagmi
      {
        project: { name: "wagmi", repo: "wagmi-dev" },
        status: ProjectStatus.Verified,
        dependencies: 4522,
        activeDevs: [2, 3],
        devReach: [20000, 30000],
        opMaus: [0, 0],
        opMausReach: [1000000, 2000000],
        contracts: 0,
        factories: 0,
        stars: [5000, 7000],
        releases: [10, 100],
        tags: frontPageTags,
        dependsOn: [],
      },
      {
        project: { name: "OpenZepplin", repo: "openzepplin" },
        status: ProjectStatus.Verified,
        dependencies: 2450,
        activeDevs: [80, 100],
        devReach: [2000, 6000],
        opMaus: [0, 0],
        opMausReach: [100000, 300000],
        contracts: 0,
        factories: 0,
        stars: [5000, 7000],
        releases: [10, 100],
        tags: frontPageTags,
        dependsOn: [],
      },
      {
        project: { name: "hardhat-deploy", repo: "wighawag/hardhat-deploy" },
        status: ProjectStatus.Incomplete,
        dependencies: 3670,
        activeDevs: [1, 1],
        devReach: [5000, 10000],
        opMaus: [0, 0],
        opMausReach: [50000, 80000],
        contracts: 0,
        factories: 0,
        stars: [5000, 7000],
        releases: [10, 100],
        tags: frontPageTags,
        dependsOn: [],
      },
      // Mirror (depends on ethers)
      {
        project: {
          name: "mirror",
          repo: "mirror-xyz/degen",
        },
        status: ProjectStatus.Unknown,
        dependencies: 100,
        activeDevs: [5, 15],
        devReach: [1000, 2000],
        opMaus: [100000, 400000],
        opMausReach: [100000, 400000],
        contracts: 28087,
        factories: 9,
        stars: [400, 500],
        tags: [],
        releases: [10, 100],
        dependsOn: ["ethers-io/ethers.js"],
      },
      {
        project: {
          name: "holograph",
          repo: "holographxyz",
        },
        status: ProjectStatus.Unknown,
        dependencies: 100,
        activeDevs: [5, 15],
        devReach: [1000, 2000],
        opMaus: [100000, 400000],
        opMausReach: [100000, 400000],
        contracts: 18300,
        factories: 9,
        stars: [400, 500],
        tags: [],
        releases: [10, 100],
        dependsOn: ["ethers-io/ethers.js"],
      },
    ],
  };

  // Randomly Generate some projects
  const currentProjectRepos = fakeData.projects.map((p) => p.project.repo);
  for (let i = 0; i < 10; i++) {
    let dependsOn = [];
    const randomDepLen = randomInt(currentProjectRepos.length);
    for (let j = 0; j < randomDepLen; j++) {
      dependsOn.push(
        currentProjectRepos[
          randomInt(currentProjectRepos.length) % currentProjectRepos.length
        ],
      );
    }
    dependsOn = _.uniq(dependsOn);
    const fakeProject: FakeProjectConfig = {
      project: {
        name: generate(1).join("/"),
        repo: generate(1 + randomInt(1)).join("/"),
      },
      status: ProjectStatus.Unknown,
      dependencies: 100,
      activeDevs: [5, 15],
      devReach: [10, 20],
      opMaus: [1000, 4000],
      opMausReach: [1000, 4000],
      contracts: randomInt(10),
      factories: randomIntRange(1, 10),
      stars: [1, 10],
      tags: [],
      releases: [5, 20],
      dependsOn: dependsOn,
    };
    fakeData.projects.push(fakeProject);
  }

  return fakeData;
}
