import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { Router, RouterModule } from '@angular/router';
import { onError } from '@apollo/client/link/error';
import { environment } from '../environments/environment';

export function createApollo(httpLink: HttpLink, router: Router): ApolloClientOptions<any> {
  // Logic to get the token from local storage
  const auth = setContext((_operation, _context) => {
    const authInfo = localStorage.getItem('SIGNLAB_AUTH_INFO');
    if (authInfo === null) {
      return {};
    }
    const { token } = JSON.parse(authInfo);
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  });

  // Logic to handle auth errors
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        if (error.extensions.code === 'UNAUTHENTICATED') {
          router.navigate(['/auth']);
        }
      }
    }
  });

  return {
    link: ApolloLink.from([auth, errorLink, httpLink.create({ uri: environment.graphqlEndpoint })]),
    cache: new InMemoryCache()
  };
}

@NgModule({
  imports: [RouterModule],
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Router]
    }
  ]
})
export class GraphQLModule {}
