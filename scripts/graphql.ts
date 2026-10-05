// GraphQL query for fetching repository data

export const QUERY = `
query FetchOrgPortfolioMetrics($org: String!, $cursor: String) {
  organization(login: $org) {
    repositories(first: 100, after: $cursor, isFork: false) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        description
        isArchived
        primaryLanguage {
          name
        }
        pushedAt
        stargazerCount
        repositoryTopics(first: 10) {
          nodes { topic { name } }
        }
        packageJson: object(expression: "HEAD:package.json") {
          ... on Blob { text }
        }
        dockerfile: object(expression: "HEAD:Dockerfile") {
          ... on Blob { text }
        }
        dockerCompose: object(expression: "HEAD:docker-compose.yml") {
          ... on Blob { text }
        }
        readme: object(expression: "HEAD:README.md") {
          ... on Blob { text }
        }
        license: object(expression: "HEAD:LICENSE") {
          ... on Blob { text }
        }
        contributing: object(expression: "HEAD:CONTRIBUTING.md") {
          ... on Blob { text }
        }
        changelog: object(expression: "HEAD:CHANGELOG.md") {
          ... on Blob { text }
        }
        workflows: object(expression: "HEAD:.github/workflows") {
          ... on Tree {
            entries {
              name
            }
          }
        }
        openIssues: issues(states: OPEN) { totalCount }
        closedIssues: issues(states: CLOSED) { totalCount }
        milestones(states: OPEN, first: 1) {
          nodes {
            title
            dueOn
            openIssues: issues(states: OPEN) { totalCount }
            closedIssues: issues(states: CLOSED) { totalCount }
          }
        }
        latestRelease { name tagName publishedAt }
        releases(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            name
            tagName
            isLatest
            isDraft
            publishedAt
          }
        }
        refs(refPrefix: "refs/tags/", first: 10) {
          nodes {
            name
            target {
              ... on Tag {
                message
              }
            }
          }
        }
      }
    }
  }
}
`;
