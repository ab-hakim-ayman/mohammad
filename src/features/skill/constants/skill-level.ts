export const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];
export const DEFAULT_SKILL_LEVEL: SkillLevel = "INTERMEDIATE";
export const skillLevelLabelKeys: Record<SkillLevel, Lowercase<SkillLevel>> = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
};
export const skillLevelBadgeClasses: Record<SkillLevel, string> = {
  BEGINNER: "bg-warning/10 text-warning",
  INTERMEDIATE: "bg-primary/10 text-primary",
  ADVANCED: "bg-success/10 text-success",
  EXPERT: "bg-violet-500/10 text-violet-500",
};
export const getSkillLevelLabelKey = (level: SkillLevel) => skillLevelLabelKeys[level];
export const getSkillLevelBadgeClass = (level: SkillLevel) => skillLevelBadgeClasses[level];
