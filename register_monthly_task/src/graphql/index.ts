import { Octokit } from '@octokit/action'
import { print } from 'graphql'
import { issueAndProject, ResIssueAndProject } from './graphql/query/issueAndProject.js'

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

await main()
