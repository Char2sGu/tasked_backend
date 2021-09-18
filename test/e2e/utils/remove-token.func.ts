import { GraphQLClient } from 'graphql-request';

export function removeToken(client: GraphQLClient) {
  client.setHeader('Authorization', '');
}
