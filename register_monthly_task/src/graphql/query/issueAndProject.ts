import { gql } from 'graphql-tag'

export type ResIssueAndProject = {
  repository: {
    issue: {
      id: string
    }
    projectV2: {
      id: string
    }
  }
}

export const issueAndProject = gql`
  query ($ownerName: String!, $repoName: String!, $issueNumber: Int!, $projectNumber: Int!) {
    repository(owner: $ownerName, name: $repoName) {
      issue(number: $issueNumber) {
        id
      }
      projectV2(number: $projectNumber) {
        id
      }
    }
  }
`
