import { Match } from '../types';

export type RootStackParamList = {
  Main: undefined;
  ProximityPing: { match: Match };
};

export type MainTabParamList = {
  Profile: undefined;
  Swipe: undefined;
  Matches: undefined;
};
