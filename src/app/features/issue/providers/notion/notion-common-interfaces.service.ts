import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskCopy } from '../../../tasks/task.model';
import { BaseIssueProviderService } from '../../base/base-issue-provider.service';
import { IssueData, IssueDataReduced, SearchResultItem } from '../../issue.model';
import { NOTION_POLL_INTERVAL } from './notion.const';
import {
  formatNotionIssueTitle,
  formatNotionIssueTitleForSnack,
} from './format-notion-issue-title.util';
import { NotionCfg } from './notion.model';
import { NotionApiService } from './notion-api.service';
import { NotionIssue } from './notion-issue.model';

@Injectable({
  providedIn: 'root',
})
export class NotionCommonInterfacesService extends BaseIssueProviderService<NotionCfg> {
  private readonly _notionApiService = inject(NotionApiService);

  readonly providerKey = 'NOTION' as const;
  readonly pollInterval: number = NOTION_POLL_INTERVAL;

  isEnabled(cfg: NotionCfg): boolean {
    return !!cfg && cfg.isEnabled && !!cfg.apiToken && !!cfg.databaseId;
  }

  testConnection(cfg: NotionCfg): Promise<boolean> {
    return firstValueFrom(
      this._notionApiService
        .searchIssues$('', cfg)
        .pipe(map((res) => Array.isArray(res))),
    ).then((result) => result ?? false);
  }

  issueLink(issueId: string | number, issueProviderId: string): Promise<string> {
    return firstValueFrom(
      this._getCfgOnce$(issueProviderId).pipe(
        map(
          (cfg) =>
            `https://www.notion.so/${(cfg.databaseId || '').replace(/-/g, '')}?p=${String(issueId).replace(/-/g, '')}`,
        ),
      ),
    ).then((result) => result ?? '');
  }

  getAddTaskData(issue: NotionIssue): Partial<Readonly<TaskCopy>> & { title: string } {
    return {
      title: formatNotionIssueTitle(issue),
      issueWasUpdated: false,
      issueLastUpdated: new Date(issue.last_edited_time).getTime(),
    };
  }

  async getNewIssuesToAddToBacklog(
    issueProviderId: string,
    _allExistingIssueIds: number[] | string[],
  ): Promise<IssueDataReduced[]> {
    const cfg = await firstValueFrom(this._getCfgOnce$(issueProviderId));
    return await firstValueFrom(this._notionApiService.getIssues$(cfg));
  }

  protected _apiGetById$(
    id: string | number,
    cfg: NotionCfg,
  ): Observable<IssueData | null> {
    return this._notionApiService.getById$(String(id), cfg);
  }

  protected _apiSearchIssues$(
    searchTerm: string,
    cfg: NotionCfg,
  ): Observable<SearchResultItem[]> {
    return this._notionApiService.searchIssues$(searchTerm, cfg);
  }

  protected _formatIssueTitleForSnack(issue: IssueData): string {
    return formatNotionIssueTitleForSnack(issue as NotionIssue);
  }

  protected _getIssueLastUpdated(issue: IssueData): number {
    return new Date((issue as NotionIssue).last_edited_time).getTime();
  }
}
