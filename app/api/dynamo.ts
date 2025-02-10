import {
  AttributeValue,
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import Matches from "~/routes/$league.matches";
import {
  Dynamo_League,
  Dynamo_Match,
  Dynamo_Team,
  League,
  Match,
  Points,
  Team,
} from "~/types";

const client = new DynamoDBClient({ region: "eu-central-1" });

export async function insertLeague(league: League) {
  const input = {
    Item: {
      name: {
        S: league.name,
      },
      numberOfTeams: {
        N: league.numberOfTeams.toString(),
      },
      numberOfGamedays: {
        N: league.numberOfGamedays.toString(),
      },
      numberOfCourts: {
        N: league.numberOfCourts.toString(),
      },
      adress: {
        S: league.adress,
      },
      createdAt: {
        S: league.createdAt,
      },
    },
    TableName: "Leagues",
  };
  const command = new PutItemCommand(input);
  const response = await client.send(command);
}

export async function getLeagues() {
  const params = {
    TableName: "Leagues",
  };
  try {
    const command = new ScanCommand(params);
    const data = await client.send(command);

    if (data.Items == undefined) {
      return [];
    }
    const dynamoLeagues = data.Items as unknown as Dynamo_League[];
    const leagues: League[] = dynamoLeagues.map((dynamoLeague) => {
      return {
        name: dynamoLeague.name.S,
        numberOfTeams: Number(dynamoLeague.numberOfTeams.N),
        numberOfGamedays: Number(dynamoLeague.numberOfGamedays.N),
        numberOfCourts: Number(dynamoLeague.numberOfCourts.N),
        adress: dynamoLeague.adress.S,
        createdAt: dynamoLeague.createdAt.S,
      };
    });
    return leagues;
  } catch (err) {
    console.error("Error:", err);
  }
}
export async function deleteLeague(name: string) {
  const input = {
    Key: {
      name: {
        S: name,
      },
    },
    TableName: "Leagues",
  };
  const command = new DeleteItemCommand(input);
  const response = await client.send(command);
}

export async function updateLeague(league: League) {
  const input = {
    Key: {
      name: {
        S: league.name,
      },
    },
    TableName: "Leagues",
    UpdateExpression:
      "SET #numberOfTeams = :numberOfTeams, #numberOfGamedays = :numberOfGamedays, #numberOfCourts = :numberOfCourts, #adress = :adress",
    ExpressionAttributeNames: {
      "#numberOfTeams": "numberOfTeams",
      "#numberOfGamedays": "numberOfGamedays",
      "#numberOfCourts": "numberOfCourts",
      "#adress": "adress",
    },
    ExpressionAttributeValues: {
      ":numberOfTeams": { N: league.numberOfTeams.toString() },
      ":numberOfGamedays": { N: league.numberOfGamedays.toString() },
      ":numberOfCourts": { N: league.numberOfCourts.toString() },
      ":adress": { S: league.adress },
    },
  };
  const command = new UpdateItemCommand(input);
  const response = await client.send(command);
}

export async function getLeagueNames() {
  try {
    const command = new ScanCommand({
      TableName: "Leagues",
      ProjectionExpression: "#n",
      ExpressionAttributeNames: { "#n": "name" },
    });

    const response = await client.send(command);

    const leagues = response.Items?.map((item) => {
      const name = item["name"]?.S;
      return name ? { name } : null;
    }).filter((league) => league !== null);

    return leagues;
  } catch (error) {
    console.error("Error fetching leagues:", error);
    throw error;
  }
}
export async function getMatches() {
  const params = {
    TableName: "Matches",
  };
  try {
    const command = new ScanCommand(params);
    const data = await client.send(command);

    if (data.Items == undefined) {
      return [];
    }
    const dynamoMatches = data.Items as unknown as Dynamo_Match[];
    const matches: Match[] = dynamoMatches.map((dynamoMatches) => {
      return {
        league_name: dynamoMatches.league_name.S,
        match_number: Number(dynamoMatches.match_number.N),
        court: Number(dynamoMatches.court?.N) || -1,
        date: dynamoMatches.date?.S || "tba.",
        referee: dynamoMatches.referee?.S || "tba.",
        team1: dynamoMatches.team1?.S || "tba.",
        team2: dynamoMatches.team2?.S || "tba",
        set1_team1_points: Number(dynamoMatches.set1_team1_points?.N) || 0,
        set1_team2_points: Number(dynamoMatches.set1_team2_points?.N) || 0,
        set2_team1_points: Number(dynamoMatches.set2_team1_points?.N) || 0,
        set2_team2_points: Number(dynamoMatches.set2_team2_points?.N) || 0,
        set3_team1_points: Number(dynamoMatches.set3_team1_points?.N) || 0,
        set3_team2_points: Number(dynamoMatches.set3_team2_points?.N) || 0,
      };
    });
    return matches;
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function updateMatch(
  leagueName: string,
  matchNumber: number,
  points: Points
) {
  const input = {
    Key: {
      league_name: {
        S: leagueName,
      },
      match_number: {
        N: matchNumber.toString(),
      },
    },
    TableName: "Matches",
    UpdateExpression:
      "SET #set1_team1_points = :set1_team1_points, #set1_team2_points = :set1_team2_points, #set2_team1_points = :set2_team1_points, #set2_team2_points = :set2_team2_points, #set3_team1_points = :set3_team1_points, #set3_team2_points = :set3_team2_points",
    ExpressionAttributeNames: {
      "#set1_team1_points": "set1_team1_points",
      "#set1_team2_points": "set1_team2_points",
      "#set2_team1_points": "set2_team1_points",
      "#set2_team2_points": "set2_team2_points",
      "#set3_team1_points": "set3_team1_points",
      "#set3_team2_points": "set3_team2_points",
    },
    ExpressionAttributeValues: {
      ":set1_team1_points": { N: points.set1_team1_points?.toString() },
      ":set1_team2_points": { N: points.set1_team2_points?.toString() },
      ":set2_team1_points": { N: points.set2_team1_points?.toString() },
      ":set2_team2_points": { N: points.set2_team2_points?.toString() },
      ":set3_team1_points": { N: points.set3_team1_points?.toString() },
      ":set3_team2_points": { N: points.set3_team2_points?.toString() },
    },
  };
  const command = new UpdateItemCommand(input);
  const response = await client.send(command);
}

export async function insertMatch(match: Match) {
  const input = {
    Item: {
      league_name: {
        S: match.league_name,
      },
      match_number: {
        N: match.match_number.toString(),
      },
      court: {
        N: match.court.toString(),
      },
      date: {
        S: match.date,
      },
      referee: {
        S: match.referee,
      },
      set1_team1_points: {
        N: match.set1_team1_points.toString(),
      },
      set1_team2_points: {
        N: match.set1_team2_points.toString(),
      },
      set2_team1_points: {
        N: match.set2_team1_points.toString(),
      },
      set2_team2_points: {
        N: match.set2_team2_points.toString(),
      },
      set3_team1_points: {
        N: match.set3_team1_points.toString(),
      },
      set3_team2_points: {
        N: match.set3_team2_points.toString(),
      },
      team1: {
        S: match.team1,
      },
      team2: {
        S: match.team2,
      },
    },
    TableName: "Matches",
  };
  const command = new PutItemCommand(input);
  const response = await client.send(command);
}

export async function getTeams() {
  const params = {
    TableName: "Teams",
  };
  try {
    const command = new ScanCommand(params);
    const data = await client.send(command);

    if (data.Items == undefined) {
      return [];
    }
    const dynamoTeams = data.Items as unknown as Dynamo_Team[];
    const teams: Team[] = dynamoTeams.map((dynamoTeams) => {
      return {
        league_name: dynamoTeams.league_name.S,
        team_name: dynamoTeams.team_name.S,
        createdAt: dynamoTeams.createdAt.S,
      };
    });
    return teams;
  } catch (err) {
    console.error("Error:", err);
  }
}
export async function insertTeam(team: Team) {
  const input = {
    Item: {
      league_name: {
        S: team.league_name,
      },
      team_name: {
        S: team.team_name,
      },
      createdAt: {
        S: team.createdAt,
      },
    },
    TableName: "Teams",
  };
  const command = new PutItemCommand(input);
  const response = await client.send(command);
}

function toDynamoDBFormat(match: Match): Record<string, AttributeValue> {
  return {
    league_name: { S: match.league_name },
    match_number: { N: match.match_number.toString() },
    court: { N: match.court.toString() },
    date: { S: match.date },
    referee: { S: match.referee },
    set1_team1_points: { N: match.set1_team1_points.toString() },
    set1_team2_points: { N: match.set1_team2_points.toString() },
    set2_team1_points: { N: match.set2_team1_points.toString() },
    set2_team2_points: { N: match.set2_team2_points.toString() },
    set3_team1_points: { N: match.set3_team1_points.toString() },
    set3_team2_points: { N: match.set3_team2_points.toString() },
    team1: { S: match.team1 },
    team2: { S: match.team2 },
  };
}

export async function batchWriteMatches(matches: Match[]) {
  const batches = [];

  // Erstelle Batches von je 25 Einträgen
  for (let i = 0; i < matches.length; i += 25) {
    batches.push(matches.slice(i, i + 25));
  }

  for (const batch of batches) {
    const requestItems = batch.map((match) => ({
      PutRequest: {
        Item: toDynamoDBFormat(match),
      },
    }));

    try {
      await client.send(
        new BatchWriteItemCommand({
          RequestItems: {
            Matches: requestItems,
          },
        })
      );
    } catch (error) {
      console.error("Batch write failed:", error);
      // Optional: Fehlerhafte Einträge erneut versuchen
    }
  }
}

export async function deleteTeam(leagueName: string, teamName: string) {
  const input = {
    Key: {
      league_name: { S: leagueName }, // Partition Key
      team_name: { S: teamName }, // Sort Key
    },
    TableName: "Teams",
  };

  const command = new DeleteItemCommand(input);
  const response = await client.send(command);
}
