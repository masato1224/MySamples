import { Octokit } from '@octokit/action'

const main = async () => {
  if (!process.env.GITHUB_REPOSITORY) {
    throw new Error('GITHUB_REPOSITORY environment variable is not defined')
  }
  if (!process.env.ISSUE_NUMBER) {
    throw new Error('ISSUE_NUMBER environment variable is not defined')
  }

  const [ownerName, repoName] = process.env.GITHUB_REPOSITORY.split('/')
  const issueNumber = Number(process.env.ISSUE_NUMBER)

  console.log('ownerName:', ownerName)
  console.log('repoName:', repoName)
  console.log('issueNumber:', issueNumber)

  const octokit = new Octokit()
  const response: { viewer: { login: string } } = await octokit.graphql(`{
    viewer {
      login
    }
  }`)
  const {
    viewer: { login }
  } = response

  console.log(`Hello, ${login}!`)
}

await main()
