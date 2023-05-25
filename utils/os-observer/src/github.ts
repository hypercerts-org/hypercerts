import { gql } from "graphql-request"

const query = gql`
        {{
          search(
            query: "org:{org} is:pr is:merged merged:{since}..{until}" 
            first: $first
            after: $after
            type: ISSUE
          ) {{
            pageInfo {{
              hasNextPage
              endCursor
            }}
            nodes {{
              ... on PullRequest {{
                createdAt
                mergedAt
                mergedBy {{
                  login
                }}
                author {{
                  login                  
                }}  
                title
                repository {{
                  name
                }}
                url
              }}
            }}
          }}
        }}`


// startDate == since
// endDate == until
const variables = {
  first: 100,
  after: "null",
  org: "truffle-box",
}

// from python:
// test = execute_org_query(0, "truffle-box", "2022-01-01T00:00:00Z", "2023-04-22T00:00:00Z")  

// Date strings are first run through this function
// date_fmt = "%Y-%m-%dT%H:%M:%SZ"
// def to_date(date):
// return date.strftime(date_fmt)