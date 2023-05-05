# GraphQL Query Strings


def query_commits(org, first, after, since, until):
    return f'''
        {{
            repository(
                org: "{org}"
            ) {{
            defaultBranchRef {{
              target {{
                ... on Commit {{
                    history(
                        first: {first}
                        after: {after}
                        since: "{since}"
                        until: "{until}"
                    ) {{
                    pageInfo {{
                        hasNextPage
                        endCursor
                    }}
                    node {{
                      committedDate
                      author {{
                        user {{
                          login
                        }}
                      }}  
                      additions
                      deletions
                      message
                      repository {{
                        name
                      }}                        
                      url
                    }}                    
                  }}
                }}
              }}
            }}
          }}
        }}
    '''


def query_merged_prs(org, first, after, since, until):
    return f'''
        {{
          search(
            query: "org:{org} is:pr is:merged merged:{since}..{until}" 
            first: {first}
            after: {after}
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
        }}
    '''


def query_created_prs(org, first, after, since, until):
    return f'''
        {{
          search(
            query: "org:{org} is:pr created:{since}..{until}" 
            first: {first}
            after: {after}
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
        }}
    '''


def query_issues(org, first, after, since, until):
    return f'''
        {{
          search(
            query: "org:{org} is:issue -reason:NOT_PLANNED created:{since}..{until}" 
            first: {first}
            after: {after}
            type: ISSUE
          ) {{
            pageInfo {{
              hasNextPage
              endCursor
            }}
            nodes {{
              ... on Issue {{
                createdAt
                closedAt
                author {{
                  login
                }}
                title
                repository {{
                  name
                }}
                url
                state
                stateReason                
              }}
            }}
          }}
        }}
    '''    


QUERIES = [
    # {
    #     "name": "commits",
    #     "func": query_commits,
    #     "timestamp": "committedDate",
    #     "contributor": "author.user.login"
    # }, 
    {
        "name": "merged PR",
        "func": query_merged_prs,
        "timestamp": "mergedAt",
        "contributor": "mergedBy.login" 
    },
    {
        "name": "issue",
        "func": query_issues,
        "timestamp": "createdAt",
        "contributor": "author.login" 
    },
    {
        "name": "created PR",
        "func": query_created_prs,
        "timestamp": "createdAt",
        "contributor": "author.login" 
    }
]