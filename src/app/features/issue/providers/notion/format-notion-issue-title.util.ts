import { NotionIssue } from './notion-issue.model';
import { truncate } from '../../../../util/truncate';

export const formatNotionIssueTitle = ({ title }: NotionIssue): string => {
  return title;
};

export const formatNotionIssueTitleForSnack = (issue: NotionIssue): string => {
  return `${truncate(formatNotionIssueTitle(issue))}`;
};
