import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://small-dust.eu-west-1.aws.cloud.dgraph.io/graphql";
const headers = { "Content-Type": "application/json" };

// connection to remote db
const server = new GraphQLClient(endpoint, {
  headers: { ...headers, "X-Auth-Token": process.env.NEXT_PUBLIC_DGRPAH_ADMIN_API_KEY },
});

const client = new GraphQLClient(endpoint, {
  headers: { ...headers, "X-Auth-Token": process.env.NEXT_PUBLIC_DGRPAH_CLIENT_API_KEY },
});

/**
 * connection-wrapper function that sends query/mutation db
 */
const request = (...args) => client.request(...args);

export { gql, request, client, server };
