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
