import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LexiconEntry } from '../../graphql/graphql';
import { LexiconSearchGQL } from '../../graphql/lex/lex.generated';
import {firstValueFrom} from 'rxjs';

export interface TagSearchResult {
  code: string;
  englishTag: string;
  videoURL: string;
}

@Injectable({ providedIn: 'root' })
export class AslLexService {
  constructor(private httpClient: HttpClient, private lexiconSearchGQL: LexiconSearchGQL) {}

  /**
   * Get list of ASL-LEX signs that match the given search result. This
   * will produce an array of `TagSearchResult`s which contains the information
   * needed to display and identify the sign.
   *
   * This method makes a call to `Knack` which holds the ASL-LEX sign data.
   * Knack provides public endpoints that allow users to gain access to
   * "Views". The "Views" produce data as JSON with ofuscated property
   * names (thus the row.field_51 non-sense). For more information on Knack's
   * view API, see
   * [this link]{@link https://docs.knack.com/docs/view-based-requests}
   *
   * @param search The search string to use to find matching tags.
   * @return List of `TagSearchResult`s with the info need to display and
   *         identify ASL-LEX tags.
   */
  async getAslLexView(search: string): Promise<TagSearchResult[]> {
    const searchResult = await firstValueFrom(this.lexiconSearchGQL.fetch({ lexicon: '64b15233e535bc69dc95b92f', search }));
    if (searchResult.data) {
      return searchResult.data.lexiconSearch.map(lexiconEntry => ({
        code: lexiconEntry.key,
        englishTag: lexiconEntry.primary,
        videoURL: lexiconEntry.video
      }));
    }
    return [];
  }
}
