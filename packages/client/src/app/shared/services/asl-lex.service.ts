import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface TagSearchResult {
  code: string;
  englishTag: string;
  videoURL: string;
}

@Injectable({ providedIn: 'root' })
export class AslLexService {
  constructor(private httpClient: HttpClient) {}

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
    const baseURL = 'https://api.knack.com/v1/pages/scene_139/views/view_203/records';

    // Build the request.
    //
    // `page`: The page number, only want the top results so use 1
    // `rows_per_page`: Number of results per page, 10 is a good number
    // `sort_field`: How to search, `field_2` is the English identifier
    // `sort_order`: How the search results should be orderd
    // `search`: The actual search query
    // `X-Knack-Application-Id`: The ID for the Knack application, in this
    //                           case, hard coded for the ASL-LEX project
    // `X-Knack-REST-API-KEY`: Knack API key, for the public view API, this
    //                         is always `knack`.
    const queryParams = new HttpParams()
      .append('format', 'both')
      .append('page', 1)
      .append('rows_per_page', 10)
      .append('sort_field', 'field_2')
      .append('sort_order', 'asc')
      .append('search', search);
    const headers = new HttpHeaders()
      .append('X-Knack-Application-Id', '58bedca7d78f7f26e2d7dcbe')
      .append('X-Knack-REST-API-KEY', 'knack');

    const result = await this.httpClient
      .get<any>(baseURL, {
        headers: headers,
        params: queryParams
      })
      .toPromise();

    if (!result) {
      return [];
    }

    // Gets the signs, filter out sign's that don't have proper videos
    // associated with them and re-arrange the data into a `TagSearchResult`.
    const signs = result.records
      .filter((row: any) => {
        return row.hasOwnProperty('field_782') && row.field_782.length > 0;
      })
      .map((row: any) => {
        // Have to splice out the vimeo link from this field which containes
        // an existing iframe
        const link = row.field_782.split('src=')[1].split(/[ >]/)[0].replaceAll('"', '');

        // Make a URL that will autoplay and loop
        const videoURL = `${link}?&loop=1&autoplay=1&controls=0&background=1`;

        return {
          code: row.field_52,
          englishTag: row.field_2,
          videoURL: videoURL
        };
      });

    return signs;
  }
}
