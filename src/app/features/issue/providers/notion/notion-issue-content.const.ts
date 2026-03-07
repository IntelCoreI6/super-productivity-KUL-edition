import { T } from '../../../../t.const';
import {
  IssueContentConfig,
  IssueFieldType,
} from '../../issue-content/issue-content.model';
import { NotionIssue } from './notion-issue.model';

export const NOTION_ISSUE_CONTENT_CONFIG: IssueContentConfig<NotionIssue> = {
  issueType: 'NOTION' as const,
  fields: [
    {
      label: T.F.ISSUE.ISSUE_CONTENT.SUMMARY,
      type: IssueFieldType.LINK,
      value: (issue: NotionIssue) => issue.title,
      getLink: (issue: NotionIssue) => issue.url,
    },
    {
      label: T.F.ISSUE.ISSUE_CONTENT.STATUS,
      value: (issue: NotionIssue) => issue.status ?? '',
      type: IssueFieldType.TEXT,
      isVisible: (issue: NotionIssue) => !!issue.status,
    },
    {
      label: T.F.ISSUE.ISSUE_CONTENT.ASSIGNEE,
      type: IssueFieldType.TEXT,
      value: (issue: NotionIssue) => issue.assignees?.map((a) => a.name).join(', '),
      isVisible: (issue: NotionIssue) => (issue.assignees?.length ?? 0) > 0,
    },
    {
      label: T.F.ISSUE.ISSUE_CONTENT.DESCRIPTION,
      value: 'body',
      type: IssueFieldType.MARKDOWN,
      isVisible: (issue: NotionIssue) => !!issue.body,
    },
  ],
  getIssueUrl: (issue: NotionIssue) => issue.url,
};
