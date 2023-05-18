# Contributing Guidelines

Thank you for your interest in contributing to Hypercerts! There are many ways to contribute, and this document should not be considered encompassing.

If you have a general question on how to use and deploy our software, please read our [Documentation](https://hypercerts.org/docs/) or join our [Hypercerts community server on Discord](https://testnet.hypercerts.org/discord).

For concrete feature requests and/or bug reports, please file an issue in this
repository as described below.

<!-- markdownlint-disable heading-increment -->

#### Table of Contents

<!-- markdownlint-enable heading-increment -->

[Feature Requests](#feature-requests)

[Bug Reports](#bug-reports)

[Development](#development)

- [Building](#building)
- [Contributing Code](#contributing-code)
- [Contributing Documentation](#contributing-documentation)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [Code Style Guide](#code-style-guide)

## Feature Requests

To request new functionality, there are two primary approaches that will be most effective at receiving input and making progress.

If the feature is **small** - a change to a single piece of functionality, or an addition that can be expressed clearly and succinctly in a few sentences, then the most appropriate place to propose it is as a [new Feature request] in this repository.

If the feature is **more complicated**, involves protocol changes, or has potential safety or performance implications, then consider writing a proposal in [GitHub discussions]. This will allow a structured review and commenting of the proposed changes. You should aim to get the proposal approved by maintainers before starting on implementation.

_Note that the project's committers still have the final word on what is accepted into the project._

<!-- markdownlint-disable line-length -->

[new Feature request]: https://github.com/hypercerts-org/hypercerts/issues/new?assignees=&labels=type%3Afeaturerequest&projects=&template=2.feature_request.yml
[GitHub discussions]: https://github.com/hypercerts-org/hypercerts/discussions

<!-- markdownlint-enable line-length -->

## Bug Reports

Bugs are a reality for any software project. We can't fix what we don't know about.

If you believe a bug report presents a security risk, please follow [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) and report it directly to security@hypercerts.org instead of filing a public issue or posting it to a public forum. We will get back to you promptly.

Otherwise, please, first search between [existing issues in our repository] and if the issue is not reported yet, [file a new one].

<!-- markdownlint-disable line-length -->

[existing issues in our repository]: https://github.com/hypercerts-org/hypercerts/issues
[file a new one]: https://github.com/hypercerts-org/hypercerts/issues/new?assignees=&labels=type%3Abug&projects=&template=1.bug_report.yml

<!-- markdownlint-enable line-length -->

## Development

### Building

Our development environment is documented in our [README](https://github.com/hypercerts-org/hypercerts/blob/main/README.md).

### Contributing Code

- **File issues:** Please make sure to first file an issue (i.e. feature request, bug report) before you actually start work on something.

- **Create branches:** If you have write permissions to the repository, you can create user-id prefixed branches (e.g. user/feature/foobar) in the main repository. Otherwise, fork the main repository and create your branches there.

  - Good habit: regularly rebase to the `HEAD` of `main` branch of the main repository to make sure you prevent nasty conflicts:

    ```bash
    git rebase <main-repo>/main
    ```

  - Push your branch to GitHub regularly so others can see what you are working
    on:

    ```bash
    git push -u <main-repo-or-your-fork> <branch-name>
    ```

    _Note that you are allowed to force push into your development branches._

- **Use draft pull requests for work-in-progress:**

  - The draft state signals that the code is not ready for review, but still gives a nice URL to track the ongoing work.

- _main_ branch is protected and will require at least 1 code review approval from a code owner before it can be merged.

- When coding, please follow these standard practices:

  - **Write tests:** Especially when fixing bugs, make a test so we know that we’ve fixed the bug and prevent it from reappearing in the future.
  - **Logging:** Please follow the logging conventions in the rest of the code base.
  - **Instrumentation:** Please following the instrumentation conventions in the rest of the code.
    - Try to instrument anything that would be relevant to an operational protocol.

- **Change Log:** Please write a change log fragment (e.g. in [SDK](sdk/RELEASE.md)) in the project if a `RELEASE.md` file exists.

- **Documentation:** Please write documentation in the code as you go. If possible, also consider updating/augmenting the [developer documentation].

- **Check CI:** Don’t break the build!

  - Make sure all tests pass before submitting your pull request for review.

- **Signal PR review:**

  - Mark the draft pull request as _Ready for review_.
  - Please include good high-level descriptions of what the pull request does.
  - The description should include references to all GitHub issues addressed by the pull request. Include the status ("done", "partially done", etc).
  - Provide some details on how the code was tested.
  - After you are nearing review (and definitely before merge) **squash commits into logical parts** (avoid squashing over merged commits, use rebase first!). Use proper commit messages which explain what was changed in the given commit and why.

- **Get a code review:**

  - Code owners will be automatically assigned to review based on the files that were changed.
  - You can generally look up the last few people to edit the file to get the best person to review.
  - When addressing the review: Make sure to address all comments, and respond to them so that the reviewer knows what has happened (e.g. "done" or "acknowledged" or "I don't think so because ...").

- **Merge:** Once approved, the creator of the pull request should merge the branch, close the pull request, and delete the branch. If the creator does not have write access to the repository, one of the committers should do so instead.

- **Signal to close issues:** Let the person who filed the issue close it. Ping them in a comment (e.g. @user) making sure you’ve commented how an issue was addressed.
  - Anyone else with write permissions should be able to close the issue if not addressed within a week.

[developer documentation]: https://github.com/hypercerts-org/hypercerts/tree/main/docs/docs

### Contributing Documentation

Documentation is always welcome! Documentation comes in several forms:

- Code-level documentation, following language specifications.
- Developer and user documentation, which lives in `docs/`.

### Style Guides

#### Git Commit Messages

We use [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

For example:

```
feat(api)!: send an email to the customer when a product is shipped

* I did this
* and that
```

#### Code Style Guide

We check for styles in 2 ways:

1. For any code that can be automatically rewritten (e.g. prettier), we use pre-commit hooks with husky.
2. For anything else, we'll incorporate it into the CI build.

Please use best practices and automated linting tools to keep the code fresh.
