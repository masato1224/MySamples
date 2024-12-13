import { gql } from 'graphql-tag'

export type ResLinkIssueToProject = {
  addProjectV2ItemById: {
    item: {
      id: string
      type: string
    }
  }
}

export const linkIssueToProject = gql`
  mutation ($projectId: ID!, $issueId: ID!) {
    addProjectV2ItemById(input: { projectId: $projectId, contentId: $issueId }) {
      item {
        id
        type
      }
    }
  }
`
