import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';
import { join } from 'path';
import { DatasetResolver } from './dataset/dataset.resolver';
import { ProjectResolver } from './project/project.resolver';

const resolvers = [ProjectResolver, DatasetResolver];

const main = async () => {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers, []);

  writeFileSync(join(process.cwd(), '/dist/schema.gql'), printSchema(schema));
};
main();
