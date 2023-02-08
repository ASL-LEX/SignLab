import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';
import { join } from 'path';


export let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

  // HACK: Other approach to generating the schema caused issues that seem
  //       to originate from some circular dependency. This approach also
  //       means that a live mongo instance must be up in order to generate
  //       the schema.
  if (process.env.MAKE_INTROSPECTION) {
    await app.init();
    const { schema } = app.get(GraphQLSchemaHost);
    writeFileSync(join(process.cwd(), '/dist/schema.gql'), printSchema(schema));
    process.exit();
  }

  await app.listen(3000);
}
bootstrap();
