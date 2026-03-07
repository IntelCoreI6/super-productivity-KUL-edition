import { T } from '../../../../t.const';
import {
  ConfigFormSection,
  LimitedFormlyFieldConfig,
} from '../../../config/global-config.model';
import { IssueProviderNotion } from '../../issue.model';
import { ISSUE_PROVIDER_COMMON_FORM_FIELDS } from '../../common-issue-form-stuff.const';
import { NotionCfg } from './notion.model';

export const DEFAULT_NOTION_CFG: NotionCfg = {
  isEnabled: false,
  apiToken: null,
  databaseId: null,
  titlePropertyName: 'Name',
  statusPropertyName: 'Status',
  doneStatusName: 'Done',
  assigneePropertyName: 'Assign',
};

export const NOTION_CONFIG_FORM: LimitedFormlyFieldConfig<IssueProviderNotion>[] = [
  {
    key: 'apiToken',
    type: 'input',
    templateOptions: {
      label: T.F.NOTION.FORM.API_TOKEN,
      required: true,
      type: 'password',
    },
  },
  {
    type: 'link',
    templateOptions: {
      url: 'https://www.notion.so/profile/integrations',
      txt: T.F.ISSUE.HOW_TO_GET_A_TOKEN,
    },
  },
  {
    key: 'databaseId',
    type: 'input',
    templateOptions: {
      label: T.F.NOTION.FORM.DATABASE_ID,
      type: 'text',
      required: true,
      description: T.F.NOTION.FORM.DATABASE_ID_DESCRIPTION,
    },
  },
  {
    key: 'titlePropertyName',
    type: 'input',
    templateOptions: {
      label: T.F.NOTION.FORM.TITLE_PROPERTY_NAME,
      type: 'text',
    },
  },
  {
    key: 'statusPropertyName',
    type: 'input',
    templateOptions: {
      label: T.F.NOTION.FORM.STATUS_PROPERTY_NAME,
      type: 'text',
    },
  },
  {
    key: 'doneStatusName',
    type: 'input',
    templateOptions: {
      label: T.F.NOTION.FORM.DONE_STATUS_NAME,
      type: 'text',
    },
  },
  {
    key: 'assigneePropertyName',
    type: 'input',
    templateOptions: {
      label: T.F.NOTION.FORM.ASSIGNEE_PROPERTY_NAME,
      type: 'text',
    },
  },
  {
    type: 'collapsible',
    props: { label: 'Advanced Config' },
    fieldGroup: [...ISSUE_PROVIDER_COMMON_FORM_FIELDS],
  },
];

export const NOTION_CONFIG_FORM_SECTION: ConfigFormSection<IssueProviderNotion> = {
  title: 'Notion',
  key: 'NOTION',
  items: NOTION_CONFIG_FORM,
  help: T.F.NOTION.FORM_SECTION.HELP,
};
