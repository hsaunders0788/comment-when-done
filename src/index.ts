import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

const matcher = /^<whendone>(.*?)<\/whendone>$/m

export = (app: Application) => {
  app.on(['issues.closed', 'pull_request.closed'], async (context: Context) => {
    const { issue, pull_request: pr } = context.payload

    if (pr && pr.merged !== 'true') {
      return
    }

    const matches = (issue || pr).body.match(matcher)
    if (matches && matches[1]) {
      const newComment = context.issue({ body: matches[1] })
      await context.github.issues.createComment(newComment)
    }
  })
}