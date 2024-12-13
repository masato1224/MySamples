import { gql } from 'graphql-tag'

export type ResIssueAndProject = {
  repository: {
    issue: {
      id: string
    }
    projectV2: {
      id: string
      sprint_field: {
        id: string
        name: string
        dataType: string
        configuration: {
          iterations: {
            id: string
            title: string
            startDate: string
          }[]
        }
      }
      category_field: {
        id: string
        name: string
        options: {
          id: string
          name: string
        }[]
      }
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
        sprint_field: field(name: "Sprint") {
          ... on ProjectV2IterationField {
            id
            name
            dataType
            configuration {
              iterations {
                id
                title
                startDate
              }
            }
          }
        }
        category_field: field(name: "Category") {
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
        }
      }
    }
  }
`
