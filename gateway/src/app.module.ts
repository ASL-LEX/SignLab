import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloGatewayDriver,
      useFactory: async (configService: ConfigService) => ({
        gateway: {
          buildService: ({ url }) => {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                if (context.req && context.req.headers) {
                  // Copy over authentication
                  request.http!.headers.set('authorization', context.req.headers.authorization);
                }
              }
            });
          },
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'signlab', url: configService.getOrThrow('signlab.uri') },
              { name: 'lex_service', url: configService.getOrThrow('lex_service.uri') },
            ]
          })
        }
      })
    })
  ]
})
export class AppModule {}
