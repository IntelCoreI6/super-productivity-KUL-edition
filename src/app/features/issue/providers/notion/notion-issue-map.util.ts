import { IssueProviderKey, SearchResultItem } from '../../issue.model';
import { NotionIssue } from './notion-issue.model';
import { formatNotionIssueTitle } from './format-notion-issue-title.util';

export const mapNotionIssueToSearchResult = (issue: NotionIssue): SearchResultItem => {
  return {
    title: formatNotionIssueTitle(issue),
    titleHighlighted: formatNotionIssueTitle(issue),
    issueType: 'NOTION' as IssueProviderKey,
    issueData: issue,
  };
};
