export function getGithubOrgFromUrl(url: string) {
  const regex = /\/\/github.com\/([^/]+)\/([^/]+)/g;
  const matches = regex.exec(url);
  if (matches) {
    return matches[1];
  }
  return null;
}
