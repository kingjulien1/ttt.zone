import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://small-dust.eu-west-1.aws.cloud.dgraph.io/graphql";
const headers = {
  "Content-Type": "application/json",
  "X-Auth-Token": process.env.NEXT_PUBLIC_DGRPAH_API_KEY,
};

// connection to remote db
const client = new GraphQLClient(endpoint, { headers });

/**
 * connection-wrapper function that sends query/mutation db
 */
const request = (...args) => client.request(...args);

export { gql, request, client };
