export interface CreateProjectInput {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  role?: string;
  status?: string;
  techStack: string[];
  features?: string[];
  architectureNotes?: string;
  githubUrl?: string;
  demoUrl?: string;
  screenshots?: string[];
  aiContext?: string;
  featured?: boolean;
  isHidden?: boolean;
  displayOrder?: number;
  buyMeCoffeeUrl?: string;
  // Partner fields — optional, only for collaborative projects
  partnerName?: string;
  partnerGithubUrl?: string;
  partnerPortfolioUrl?: string;
}

export type UpdateProjectInput = Partial<CreateProjectInput>;
