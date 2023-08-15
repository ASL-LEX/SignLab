import { Injectable } from '@angular/core';
import { LexiconSearchGQL } from '../../graphql/lex/lex.generated';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TagSearchResult {
  code: string;
  englishTag: string;
  videoURL: string;
}

@Injectable({ providedIn: 'root' })
export class AslLexService {
  constructor(private lexiconSearchGQL: LexiconSearchGQL) {}

  /**
   * Get list of ASL-LEX signs that match the given search result. This
   * will produce an array of `TagSearchResult`s which contains the information
   * needed to display and identify the sign.
   *
   *
   * @param search The search string to use to find matching tags.
   * @return List of `TagSearchResult`s with the info need to display and
   *         identify ASL-LEX tags.
   */
  async getAslLexView(search: string): Promise<TagSearchResult[]> {
    const searchResult = await firstValueFrom(this.lexiconSearchGQL.fetch({ lexicon: environment.aslLexID, search }));
    if (searchResult.data) {
      return searchResult.data.lexiconSearch.map(lexiconEntry => ({
        code: lexiconEntry.key,
        englishTag: lexiconEntry.primary,
        videoURL: lexiconEntry.video
      }));
    }
    if (searchResult.error) {
      console.error(searchResult.error);
    }
    return [];
  }
}
