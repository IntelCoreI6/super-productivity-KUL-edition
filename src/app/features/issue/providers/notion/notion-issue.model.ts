export type NotionUser = Readonly<{
  id: string;
  name: string;
  avatar_url: string | null;
}>;

export type NotionIssue = Readonly<{
  id: string;
  url: string;
  title: string;
  status: string | null;
  assignees: NotionUser[];
  labels: string[];
  created_time: string;
  last_edited_time: string;
  body: string | null;
}>;
