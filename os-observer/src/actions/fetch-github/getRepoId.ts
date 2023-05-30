import { gql } from "graphql-request";
import { GithubRepo } from "../../github.js";
import { graphQLClient } from "./graphQLClient.js";

const query = gql`
  query getRepoId($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
    }
  }
`;

interface Data {
  repository: { id: string };
}

export async function getRepoId(repo: GithubRepo): Promise<string> {
  const variables = {
    owner: repo.owner,
    name: repo.name,
  };

  const data = await graphQLClient.request<Data>(query, variables);
  console.log(data);

  return data.repository.id;
}
