import { Octokit } from '@octokit/action'
import { print } from 'graphql'
import { issueAndProject, ResIssueAndProject } from './graphql/query/issueAndProject.js'
import { linkIssueToProject, ResLinkIssueToProject } from './graphql/mutation/linkIssueToProject.js'
import { ResUpdateProjectItem, updateProjectItem } from './graphql/mutation/updateProjectItem.js'

const main = async () => {
  if (!process.env.GITHUB_REPOSITORY) {
    throw new Error('GITHUB_REPOSITORY environment variable is not defined')
  }

  if (!process.env.ISSUE_NUMBER) {
    throw new Error('ISSUE_NUMBER environment variable is not defined')
  }

  if (!process.env.PROJECT_NUMBER) {
    throw new Error('PROJECT_NUMBER environment variable is not defined')
  }

  const [ownerName, repoName] = process.env.GITHUB_REPOSITORY.split('/')
  const issueNumber = Number(process.env.ISSUE_NUMBER)
  const projectNumber = Number(process.env.PROJECT_NUMBER)

  const octokit = new Octokit()

  const issueAndProjectData = await fetchIssueAndProject(octokit, ownerName, repoName, issueNumber, projectNumber)
  const projectItem = await AddProjectItem(octokit, issueAndProjectData)
  await updateIssueAttribute(octokit, issueAndProjectData, projectItem)
}

const fetchIssueAndProject = async (
  octokit: Octokit,
  ownerName: string,
  repoName: string,
  issueNumber: number,
  projectNumber: number
) => {
  const response = await octokit.graphql<ResIssueAndProject>(print(issueAndProject), {
    ownerName,
    repoName,
    issueNumber,
    projectNumber
  })
  return response
}

const AddProjectItem = async (octokit: Octokit, issueAndProjectData: ResIssueAndProject) => {
  const item = await octokit.graphql<ResLinkIssueToProject>(print(linkIssueToProject), {
    projectId: issueAndProjectData.repository.projectV2.id,
    issueId: issueAndProjectData.repository.issue.id
  })
  return item
}

const updateIssueAttribute = async (
  octokit: Octokit,
  issueAndProjectData: ResIssueAndProject,
  projectItem: ResLinkIssueToProject
) => {
  const optionsId = issueAndProjectData.repository.projectV2.category_field.options.find(
    field => field.name === 'チーム運営'
  )?.id
  await octokit.graphql<ResUpdateProjectItem>(print(updateProjectItem), {
    project_id: issueAndProjectData.repository.projectV2.id,
    itemId: projectItem.addProjectV2ItemById.item.id,
    sprintFieldId: issueAndProjectData.repository.projectV2.sprint_field.id,
    iterationId: issueAndProjectData.repository.projectV2.sprint_field.configuration.iterations[0].id,
    categoryFieldId: issueAndProjectData.repository.projectV2.category_field.id,
    singleSelectOptionId: optionsId
  })
}


await main()
