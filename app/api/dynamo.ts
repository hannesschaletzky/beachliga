import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Dynamo_League, League } from "~/types";

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
