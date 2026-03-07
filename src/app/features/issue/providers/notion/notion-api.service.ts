import { Injectable, inject } from '@angular/core';
import { SnackService } from '../../../../core/snack/snack.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotionCfg } from './notion.model';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { throwHandledError } from '../../../../util/throw-handled-error';
import { T } from '../../../../t.const';
import { NOTION_TYPE, ISSUE_PROVIDER_HUMANIZED } from '../../issue.const';
import { NotionIssue } from './notion-issue.model';
import { mapNotionIssueToSearchResult } from './notion-issue-map.util';
import { NOTION_API_BASE_URL, NOTION_API_VERSION } from './notion.const';
import { SearchResultItem } from '../../issue.model';
import { handleIssueProviderHttpError$ } from '../../handle-issue-provider-http-error';

@Injectable({
  providedIn: 'root',
})
export class NotionApiService {
  private _snackService = inject(SnackService);
  private _http = inject(HttpClient);

  searchIssues$(searchText: string, cfg: NotionCfg): Observable<SearchResultItem[]> {
    return this._queryDatabase$(cfg, searchText).pipe(
      map((issues: NotionIssue[]) =>
        issues.map((issue) => mapNotionIssueToSearchResult(issue)),
      ),
    );
  }

  getIssues$(cfg: NotionCfg): Observable<NotionIssue[]> {
    return this._queryDatabase$(cfg);
  }

  getById$(issueId: string, cfg: NotionCfg): Observable<NotionIssue> {
    this._checkSettings(cfg);
    const headers = this._getHeaders(cfg);
    return this._http
      .get<any>(`${NOTION_API_BASE_URL}/pages/${issueId}`, { headers })
      .pipe(
        map((page: any) => this._mapPageToIssue(page, cfg)),
        catchError((err) =>
          handleIssueProviderHttpError$<NotionIssue>(
            NOTION_TYPE,
            this._snackService,
            err,
          ),
        ),
      );
  }

  updateIssueStatus$(
    issueId: string,
    statusName: string,
    cfg: NotionCfg,
  ): Observable<any> {
    this._checkSettings(cfg);
    const headers = this._getHeaders(cfg);
    const propertyName = cfg.statusPropertyName || 'Status';
    const body = {
      properties: {
        [propertyName]: {
          status: {
            name: statusName,
          },
        },
      },
    };
    return this._http
      .patch<any>(`${NOTION_API_BASE_URL}/pages/${issueId}`, body, { headers })
      .pipe(
        catchError((err) =>
          handleIssueProviderHttpError$(NOTION_TYPE, this._snackService, err),
        ),
      );
  }

  private _queryDatabase$(
    cfg: NotionCfg,
    searchText?: string,
  ): Observable<NotionIssue[]> {
    this._checkSettings(cfg);
    const headers = this._getHeaders(cfg);
    const body: any = {};
    if (searchText) {
      const titleProp = cfg.titlePropertyName || 'Name';
      body.filter = {
        property: titleProp,
        title: {
          contains: searchText,
        },
      };
    }
    return this._http
      .post<any>(`${NOTION_API_BASE_URL}/databases/${cfg.databaseId}/query`, body, {
        headers,
      })
      .pipe(
        map((response: any) =>
          (response.results || []).map((page: any) => this._mapPageToIssue(page, cfg)),
        ),
        catchError((err) =>
          handleIssueProviderHttpError$<NotionIssue[]>(
            NOTION_TYPE,
            this._snackService,
            err,
          ),
        ),
      );
  }

  private _mapPageToIssue(page: any, cfg: NotionCfg): NotionIssue {
    const titleProp = cfg.titlePropertyName || 'Name';
    const statusProp = cfg.statusPropertyName || 'Status';
    const assigneeProp = cfg.assigneePropertyName || 'Assign';
    const properties = page.properties || {};

    const titleArray = properties[titleProp]?.title || [];
    const title = titleArray.map((t: any) => t.plain_text || '').join('');

    const status = properties[statusProp]?.status?.name ?? null;

    const assignees: { id: string; name: string; avatar_url: string | null }[] = [];
    if (properties[assigneeProp]?.people) {
      for (const person of properties[assigneeProp].people) {
        assignees.push({
          id: person.id,
          name: person.name || '',
          avatar_url: person.avatar_url || null,
        });
      }
    }

    return {
      id: page.id,
      url: page.url || '',
      title,
      status,
      assignees,
      // TODO: extract labels from Notion multi-select properties if needed
      labels: [],
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      // TODO: retrieve page content via the Notion blocks API
      body: null,
    };
  }

  private _getHeaders(cfg: NotionCfg): HttpHeaders {
    return new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${cfg.apiToken}`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Notion-Version': NOTION_API_VERSION,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    });
  }

  private _checkSettings(cfg: NotionCfg): void {
    if (!this._isValidSettings(cfg)) {
      this._snackService.open({
        type: 'ERROR',
        msg: T.F.ISSUE.S.ERR_NOT_CONFIGURED,
        translateParams: {
          issueProviderName: ISSUE_PROVIDER_HUMANIZED[NOTION_TYPE],
        },
      });
      throwHandledError('Notion: Not enough settings');
    }
  }

  private _isValidSettings(cfg: NotionCfg): boolean {
    return (
      !!cfg &&
      !!cfg.apiToken &&
      cfg.apiToken.length > 0 &&
      !!cfg.databaseId &&
      cfg.databaseId.length > 0
    );
  }
}
