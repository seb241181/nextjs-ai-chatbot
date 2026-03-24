export type LumiaSummary = {
  blocage_principal: string;
  origine_probable: string;
  croyance_associee: string;
  action_recommandee: string;
  intensite: number;
  tags: string[];
};

export type LumiaApiResponse = {
  sessionId: string;
  outputMarkdown: string;
  summary: LumiaSummary;
};
