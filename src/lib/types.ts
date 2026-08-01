export type Skill =
  | "PLUMBER"
  | "ELECTRICIAN"
  | "CLEANER"
  | "PAINTER"
  | "MASON"
  | "DRIVER"
  | "IT_SUPPORT"
  | "SOFTWARE_ENGINEER"
  | "WEDDING_PLANNER"
  | "CHEF"
  | "HOME_WORKER"
  | "FITNESS_TRAINER"
  | "EVENT_SERVICES";

export type MomoProvider = "MTN_MOMO" | "AIRTEL_MONEY";

export type Language = "en" | "rw" | "fr";

export type RateUnit = "hour" | "day";

export interface Worker {
  id: string;
  name: string;
  skill: Skill;
  secondarySkills?: Skill[];
  neighborhood: string;
  city: string;
  nidVerified: boolean;
  rating: number;
  ratingCount: number;
  rateRwf: number;
  rateUnit: RateUnit;
  photoUrl: string;
  jobsCompleted: number;
  yearsActive: number;
  momoProvider: MomoProvider;
  momoNumber: string;
  bio: string;
  available: boolean;
}

export interface JobPosting {
  id: string;
  workerId: string;
  clientName: string;
  clientPhone: string;
  taskDescription: string;
  scheduledFor: string; // ISO date string
  status: "PENDING_DEPOSIT" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  depositRwf: number;
  createdAt: string;
}

export interface SkillMeta {
  key: Skill;
  labelKey: string;
  color: string;
  bg: string;
}
