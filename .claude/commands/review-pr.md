# /review-pr

Reviews PR comments and applies feedback.

## Usage

```text
/review-pr <PR_NUMBER_OR_URL>
```

## Examples

```text
/review-pr 1
/review-pr https://github.com/crossplatformkorea/cpk-ui/pull/1
```

## Arguments

- `$ARGUMENTS` - PR number (e.g., `1`) or PR URL

## Instructions

When this command is executed, perform the following:

### 1. Gather PR Information

```bash
# Get PR details
gh pr view $ARGUMENTS --json number,title,body,state,headRefName,baseRefName

# Get review comments
gh pr view $ARGUMENTS --json reviews,comments

# Get list of changed files
gh pr diff $ARGUMENTS --name-only

# Get diff content
gh pr diff $ARGUMENTS
```

### 2. Analyze Comments

Analyze review comments and classify them as:

- **Code Change Request**: Code that needs modification
- **Question**: Content that needs an answer
- **Suggestion**: Optional improvements
- **Approval**: No changes needed

### 3. Pre-commit Validation

Run the following validation before commit:

```bash
bun run lint          # ESLint
bun run test          # Unit tests
bun run tsc           # TypeScript check
```

All three must pass before committing.

### 4. Perform Code Modifications

For each comment:

1. Understand the request
2. Read related code
3. Perform modification

### 5. Verify and Commit

1. Run all pre-commit validation
2. Confirm all checks pass
3. Commit in meaningful units
4. Follow commit message format (`feat:`, `fix:`, `chore:`, etc.)

### 6. Reply to PR Comments and Resolve Threads

After completing modifications, automatically reply to each comment and resolve threads.

#### 6.1 Get Inline Review Comments

```bash
# Get inline review comments with their IDs
gh api repos/crossplatformkorea/cpk-ui/pulls/$PR_NUMBER/comments \
  --jq '.[] | {id: .id, path: .path, line: .line, body: .body[:100]}'
```

#### 6.2 Reply to Comments

```bash
# Reply to a specific comment
gh api repos/crossplatformkorea/cpk-ui/pulls/$PR_NUMBER/comments/$COMMENT_ID/replies \
  -X POST -f body="Fixed in $COMMIT_HASH. $DESCRIPTION"
```

**Reply Format Rules:**

- **Commit hash reference**: Write in plain text without code blocks
  - Correct: `Fixed in f3b5fec.`
  - Wrong: `` Fixed in `f3b5fec`. ``
  - GitHub automatically creates commit links

#### 6.3 Resolve Threads

After replying, resolve the thread using GraphQL:

```bash
# Get unresolved thread IDs
gh api graphql -f query='
query {
  repository(owner: "crossplatformkorea", name: "cpk-ui") {
    pullRequest(number: $PR_NUMBER) {
      reviewThreads(first: 50) {
        nodes {
          id
          isResolved
          path
          comments(first: 1) {
            nodes { databaseId }
          }
        }
      }
    }
  }
}'

# Resolve a specific thread
gh api graphql -f query='
mutation {
  resolveReviewThread(input: {threadId: "$THREAD_ID"}) {
    thread { id isResolved }
  }
}'
```

**Thread Resolution Rules:**

- Only resolve threads where code changes have been made and pushed
- Do not resolve threads that are just suggestions for future improvement
- Do not resolve threads awaiting user clarification

## Auto Workflow

When user runs `/review-pr 123`:

1. **Gather**: Get all review comments for PR #123
2. **Analyze**: Understand and classify comment content
3. **Execute**:
   - Code change request -> Perform modification
   - Question -> Ask user for clarification
4. **Verify**: Run `bun run lint && bun run tsc && bun run test`
5. **Commit**: Commit modifications
6. **Push**: Push commits to remote
7. **Reply**: Reply to each fixed comment via GitHub API
8. **Resolve**: Resolve threads for fixed issues via GraphQL
9. **Report**: Summarize completed work
