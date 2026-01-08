
export interface AttackStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  mitreTechnique: string;
  visualPrompt: string;
  imageUrl?: string;
  isLoadingImage?: boolean;
}

export interface AttackScenario {
  id: string;
  attackVector: string;
  threatActor: string;
  summary: string;
  steps: AttackStep[];
  timestamp: number;
  sampleLogs: string;
  attackFlowDiagram: string;
  mitigationLessons: string;
}

export enum Complexity {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}
