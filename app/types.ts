export type Dynamo_League = {
  name: {
    S: string;
  };
  numberOfTeams: {
    N: number;
  };
  numberOfGamedays: {
    N: number;
  };
  numberOfCourts: {
    N: number;
  };
  adress: {
    S: string;
  };
  createdAt: {
    S: string;
  };
};

export type League = {
  name: string;
  numberOfTeams: number;
  numberOfGamedays: number;
  numberOfCourts: number;
  adress: string;
  createdAt: string;
};

export type Dynamo_Match = {
  league_name: { S: string };
  match_number: { N: number };
  court: { N: number };
  date: { S: string };
  referee: { S: string };
  team1: { S: string };
  team2: { S: string };
  set1_team1_points: { N: number };
  set1_team2_points: { N: number };
  set2_team1_points: { N: number };
  set2_team2_points: { N: number };
  set3_team1_points: { N: number };
  set3_team2_points: { N: number };
};

export type Match = {
  league_name: string;
  match_number: number;
  court: number;
  date: string;
  referee: string;
  team1: string;
  team2: string;
  set1_team1_points: number;
  set1_team2_points: number;
  set2_team1_points: number;
  set2_team2_points: number;
  set3_team1_points: number;
  set3_team2_points: number;
};
export type Points = {
  set1_team1_points: number;
  set1_team2_points: number;
  set2_team1_points: number;
  set2_team2_points: number;
  set3_team1_points: number;
  set3_team2_points: number;
};

export type Team = {
  league_name: string;
  team_name: string;
  createdAt: string;
  short_team_name: string;
  first_name_player1: string;
  first_name_player2: string;
  surname_player1: string;
  surname_player2: string;
};

export type Dynamo_Team = {
  league_name: { S: string };
  team_name: { S: string };
  createdAt: { S: string };
  short_team_name: { S: string };
  first_name_player1: { S: string };
  first_name_player2: { S: string };
  surname_player1: { S: string };
  surname_player2: { S: string };
};

export type Credentials = {
  league_name: string;
  username: string;
  password: string;
};
export type Dynamo_Credentials = {
  league_name: { S: string };
  username: { S: string };
  password: { S: string };
};
