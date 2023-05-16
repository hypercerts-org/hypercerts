# Github Event Tracking

## User Story

As a contributor or analyst, I'd like to see documentation that shows the current set of queries that are being tracked as GitHub events as well as a GraphQL sandbox for testing out the queries.

## Query Tracking

The following queries are currently being tracked as events for a given Github organization:

- Created PR
- Merged PR
- Created Issue

## Creating New Queries

New queries should have the following fields:

- `id` (auto-generated)
- `name` (see examples above)
- `source` (set to "github")
- `units` (most queries return an array of event nodes, so this can be set to "nodes")
- `query_function` (see below)

### Example `query_function`: Merged PR

**Parameters:**

- `$org`: the Github organization name (eg, `hypercerts-org`)
- `$since`: a Github compatible timestamp, eg, `2022-01-01T00:00:00Z`
- `$until`: a Github compatible timestamp, eg, `2023-04-22T00:00:00Z`

**Query:**

```graphql
{
  search(
    query: "org:$org is:pr is:merged merged:$since..$until"
    first: 100
    type: ISSUE
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ... on PullRequest {
        title
        url
        createdAt
        mergedAt
        mergedBy {
          login
        }
        author {
          login
        }
      }
    }
  }
}
```
## Normalizing Query Results

The result should then be normalized as follows:

 - `id` (auto-generated)
 - `project_id` (the name of the Github organization being queried)
 - `observer_id` (the name of the query)
 - `timestamp` (when the event occured on Github)
 - `amount` (always set to 1.0)
 - `details` (a flattened JSON of all the other information returned by the query)


## Testing Queries

To test out the queries, you can use GitHub's GraphQL API Explorer.

1. Login to GitHub and go to the [Explorer](https://docs.github.com/en/graphql/overview/explorer). Once there, you will see an interactive GraphQL environment where you can enter queries.

2. Enter your desired query in the provided input field.

3. Click the "Play" button to execute the query. The results of the query will be displayed in the response panel below.

4. Analyze the results and iterate on your query as needed.

### Query Variables

If your query requires variables, you can provide them in the "Query Variables" section of the GraphQL Explorer. This allows you to pass dynamic values to your queries.

### Rate Limiting

The GitHub API limits each request to 100 records and 10 pages. This means you can't extract more than 1000 records from a single query. You can break the query up into smaller pieces by reducing the date range, or providing other filtering parameters.
