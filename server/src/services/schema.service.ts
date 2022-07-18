import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Validator } from 'jsonschema';
import { Model } from 'mongoose';
import {
  DynamicSchema,
  DynamicSchemaDocument,
} from '../schemas/dyanmicschema.schema';

/**
 * The schema service handles validation of dynamic schema. Dynamic schema
 * is schema which is not known until application runtime. This service
 * handles validation against that dynamic schema.
 */
@Injectable()
export class SchemaService {
  /**
   * Holds the mapping between the model name and the associated dynamic
   * schema. This is to reduce the number of DB calls since the dynamic schema
   * rarely changes.
   */
  private schemaMap: Map<string, DynamicSchema>;

  private validator: Validator;

  constructor(
    @InjectModel(DynamicSchema.name)
    private dynamicSchemaModel: Model<DynamicSchemaDocument>,
  ) {
    this.schemaMap = new Map();
    this.validator = new Validator();
  }

  /**
   * Validate the value agains the schema associated with the schema type.
   * Throws an error if there is a validation error.
   *
   * @return True if the data is valid, an error otherwise
   */
  public async validate(schemaType: string, value: any): Promise<boolean> {
    const schema = (await this.getSchema(schemaType)).schema;

    const result = this.validator.validate(value, schema);

    // If errors are present, extract out the human readable message and
    // throw the error
    if (result.errors.length > 0) {
      let errorMessage = '';
      for (const error of result.errors) {
        errorMessage += `${error.message}\n`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  /**
   * Attempts to read the schema from the cached map. If the schema is not
   * in the cached map, then try to get the schema from the database, if the
   * schema is not in the database, throw an error.
   *
   * @param schemaType The name of the schema to search for
   * @return The DynamicSchema associated with the given schemaType
   */
  private async getSchema(schemaType: string): Promise<DynamicSchema> {
    // Check if its in the map
    if (this.schemaMap.has(schemaType)) {
      return this.schemaMap.get(schemaType);
    }

    // Otherwise try to read from the database and cache
    const schema = await this.dynamicSchemaModel
      .findOne({ schemaName: schemaType })
      .exec();
    if (schema) {
      this.schemaMap.set(schemaType, schema);
      return schema;
    }

    // Schema not found in cached map nor database
    throw new Error(`Schema not found for type ${schemaType}`);
  }
}
