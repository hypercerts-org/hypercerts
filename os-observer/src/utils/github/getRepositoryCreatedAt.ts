import { gql } from "graphql-request";
import { graphQLClient } from "./graphQLClient.js";

const query = gql`
  query getRepositoryCreatedAt($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      createdAt
    }
  }
`;

interface Data {
  repository: {
    createdAt: string;
  };
}

export async function getRepositoryCreatedAt(
  owner: string,
  name: string,
): Promise<string> {
  const data = await graphQLClient.request<Data>(query, {
    owner,
    name,
  });

  return data.repository.createdAt;
}
