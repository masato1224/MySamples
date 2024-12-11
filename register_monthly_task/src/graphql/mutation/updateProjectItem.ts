import { gql } from 'graphql-tag'

export type ResUpdateProjectItem = {
  updateSprint: {
    clientMutationId: string
  }
  updateCategory: {
    clientMutationId: string
  }
}

export const updateProjectItem = gql`
  mutation (
    $project_id: ID!
    $itemId: ID!
    $sprintFieldId: ID!
    $iterationId: String
    $categoryFieldId: ID!
    $singleSelectOptionId: String
  ) {
    updateSprint: updateProjectV2ItemFieldValue(
      input: { projectId: $project_id, itemId: $itemId, fieldId: $sprintFieldId, value: { iterationId: $iterationId } }
    ) {
      clientMutationId
    }
    updateCategory: updateProjectV2ItemFieldValue(
      input: {
        projectId: $project_id
        itemId: $itemId
        fieldId: $categoryFieldId
        value: { singleSelectOptionId: $singleSelectOptionId }
      }
    ) {
      clientMutationId
    }
  }
`
