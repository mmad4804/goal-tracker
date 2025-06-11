export type RootStackParamList = {
  Tabs: { screen?: keyof TabParamList };
  PlanDetails: { planId: string };
};

export type TabParamList = {
  Home: undefined;
  Add: undefined;
  Settings: undefined;
};
