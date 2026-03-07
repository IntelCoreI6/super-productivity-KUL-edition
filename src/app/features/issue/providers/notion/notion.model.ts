import { BaseIssueProviderCfg } from '../../issue.model';

export interface NotionCfg extends BaseIssueProviderCfg {
  apiToken: string | null;
  databaseId: string | null;
  titlePropertyName: string | null;
  statusPropertyName: string | null;
  doneStatusName: string | null;
  assigneePropertyName: string | null;
}
