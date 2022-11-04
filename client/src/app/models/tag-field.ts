import { JsonSchema, Layout } from '@jsonforms/core';
import { DatasetService } from '../core/services/dataset.service';

/**
 * The different kind of tag fields that are supported
 */
export enum TagFieldType {
  AslLex,
  Autocomplete,
  BooleanOption,
  EmbeddedVideoOption,
  FreeText,
  Numeric,
  VideoRecord,
}

/**
 * A TagField represents a possible field that can be in a tag. These
 * represent the different kind of inputs that will be supported in a
 * form.
 *
 * These fields are defined using JSON Forms. This allows for describing
 * how to generate a form for the information that is needed for a tag
 * field. For example, a Numeric field may have a minimum and maximum possible
 * value and therefore the TagField needs to produce a JSON Forms schema that
 * produces a form to capture those values.
 *
 * JSON Forms is used for two different tasks. First, JSON Forms is used
 * to describe how to make a form for capturing the needed information to
 * make a single field within a Tag form. The second use is to then aggregate
 * that information into a single JSON Forms schema which describes the
 * whole tag.
 */
export abstract class TagField {
  /** The kind of data this field will capture */
  kind: TagFieldType;
  /** How to display the field kind in a human readable format */
  kindDisplay: string;
  /** The unique name for this field, how the field is identified */
  name = '';
  /**
   * Helper flag which is used when producing the JSON Forms representation
   * of the whole Tag form
   */
  isValid = false;
  /**
   * The data which comes from the JSON Forms from this field, parsed to
   * produce the portion of the JSON Forms that is used to describe the
   * tag form.
   */
  data: any = {};
  /**
   * The JSON Froms type
   */
  type: string;

  constructor(kind: TagFieldType, kindDisplay: string, type: string) {
    this.kind = kind;
    this.kindDisplay = kindDisplay;
    this.type = type;
  }

  getFieldName(): string {
    return this.data.fieldName || '';
  }

  isRequired(): boolean {
    return this.data.required || false;
  }

  getDescription(): string {
    return this.data.shortDescription || '';
  }

  /**
   * This is the JSON Forms data portion of the schema which describes the
   * data that makes up the fields required infromation. This includes things
   * like the name of the field, and a description of the field.
   *
   * Additional fields may be needed (for example a Numeric field may have
   * information like a minimum and maximum value).
   */
  async getDataSchema(): Promise<JsonSchema> {
    const properties = await this.getFieldSpecificProperties();
    return {
      type: 'object',
      properties: {
        fieldName: {
          type: 'string',
        },
        shortDescription: {
          type: 'string',
        },
        ...properties,
        required: {
          type: 'boolean',
        },
      },
      required: [
        'fieldName',
        'shortDescription',
        ...this.getRequiredFieldProperties(),
      ],
    };
  }

  /**
   * This is the JSON Forms UI portion of the schema which describes how
   * to present the required fields.
   */
  getUISchema(): Layout {
    return {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/fieldName',
        },
        {
          type: 'Control',
          scope: '#/properties/shortDescription',
        },
        ...this.getFieldSpecificUiSchema(),
        {
          type: 'Control',
          scope: '#/properties/required',
        },
      ],
    };
  }

  /**
   * This describes any other portions of data that may be needed to represent
   * a field. Sub-classes can override this method with there own required
   * field.
   */
  protected getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    return Promise.resolve({});
  }

  /**
   * This is a list of property names that are required fields
   */
  protected getRequiredFieldProperties(): string[] {
    return [];
  }

  /**
   * This describes how to present other tag specific required fields
   */
  protected getFieldSpecificUiSchema(): any[] {
    return [];
  }

  /**
   * This converts the field into a fragment of a JSON Forms data schema.
   * This includes the information for this single field within the Tag
   * form. For example
   *
   * {
   *   "animal": {
   *     type: "string",
   *     description: "The animal the sign is of"
   *   }
   * }
   */
  asDataProperty(): JsonSchema {
    return {
      [this.getFieldName()]: {
        type: this.type,
        description: this.getDescription(),
      },
    };
  }

  /**
   * This converts the field into a fragment of a JSON forms UI schema.
   * This includes information for this single field within the Tag
   * form. For example.
   *
   * [
   *   {
   *     type: "Control",
   *     scope: "#/properties/animal",
   *     options: {
   *       showUnfocusedDescription: true
   *     }
   *   }
   * ]
   */
  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          showUnfocusedDescription: true,
        },
      },
    ];
  }
}

/**
 * Field for ASL-LEX signs. This field will present users with options
 * as ASL-LEX sign videos and store the cooresponding ASL-LEX sign code as
 * a string.
 */
export class AslLexField extends TagField {
  constructor() {
    super(TagFieldType.AslLex, 'ASL-LEX Sign', 'string');
  }

  /** Option for custom labels */
  protected getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    return Promise.resolve({
      allowCustomLabels: {
        type: 'boolean',
      },
    });
  }

  /** Option for custom labels */
  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/allowCustomLabels',
      },
    ];
  }

  /**
   * For properly displaying the ASL-LEX video options, override the
   * convertion to a UI property to include the custom type
   */
  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          customType: 'asl-lex',
          allowCustomLabels: this.data.allowCustomLabels,
          showUnfocusedDescription: true,
        },
      },
    ];
  }
}

export class AutocompleteField extends TagField {
  constructor() {
    super(TagFieldType.Autocomplete, 'Autocomplete', 'string');
  }

  /**
   * The autocomplete field needs a list of options as a data field which
   * will later become the enum values in the tag field.
   */
  protected getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    return Promise.resolve({
      userOptions: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    });
  }

  /**
   * Specify the view which is shown to users making a tag field. This will
   * give users to option to upload options as a file which contains different
   * options on each line.
   */
  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/userOptions',
        options: {
          customType: 'file-list',
        },
      },
    ];
  }

  /**
   * The autocomplete data property is bounded to only allowing values
   * that were options in the provided list. Thus the data schema returned
   * includes the enum made up of uploaded values
   */
  asDataProperty(): JsonSchema {
    return {
      [this.getFieldName()]: {
        type: this.type,
        description: this.getDescription(),
        enum: [...this.data.userOptions],
      },
    };
  }

  protected getRequiredFieldProperties(): string[] {
    return ['userOptions'];
  }
}

export class BooleanField extends TagField {
  constructor() {
    super(TagFieldType.BooleanOption, 'Boolean Option', 'boolean');
  }
}

export class EmbeddedVideoOption extends TagField {
  constructor() {
    super(TagFieldType.EmbeddedVideoOption, 'Video Option', 'string');
  }

  /**
   * Provides options to allow users to select a custom intpu and the format
   * of the video options
   */
  protected getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    return Promise.resolve({
      allowCustomLabels: {
        type: 'boolean',
      },
      userVideoParameters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            videoURL: {
              type: 'string',
            },
            code: {
              type: 'string',
            },
            searchTerm: {
              type: 'string',
            },
          },
          required: ['videoURL', 'code', 'searchTerm'],
        },
      },
    });
  }

  /** Option for custom labels */
  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/allowCustomLabels',
      },
      {
        type: 'Control',
        scope: '#/properties/userVideoParameters',
        options: {
          customType: 'video-option-upload',
        },
      },
    ];
  }

  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          customType: 'video-options',
          allowCustomLabels: this.data.allowCustomLabels,
          userVideoParameters: this.data.userVideoParameters,
          showUnfocusedDescription: true,
        },
      },
    ];
  }

  protected getRequiredFieldProperties(): string[] {
    return ['userVideoParameters'];
  }
}

export class FreeTextField extends TagField {
  constructor() {
    super(TagFieldType.FreeText, 'Free Text', 'string');
  }
}

export class NumericField extends TagField {
  constructor() {
    super(TagFieldType.Numeric, 'Numeric', 'number');
  }

  /**
   * A Numeric field optionally allows a minimum and maximum value
   */
  getFieldSpecificProperties(): Promise<{ [property: string]: JsonSchema }> {
    return Promise.resolve({
      minimum: {
        type: 'number',
      },
      maximum: {
        type: 'number',
      },
    });
  }

  getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/minimum',
      },
      {
        type: 'Control',
        scope: '#/properties/maximum',
      },
    ];
  }

  asDataProperty(): JsonSchema {
    const schema: JsonSchema = {
      type: 'number',
      description: this.getDescription(),
    };

    if (this.data.minimum) {
      schema.minimum = this.data.minimum;
    }

    if (this.data.maximum) {
      schema.maximum = this.data.maximum;
    }

    return {
      [this.getFieldName()]: schema,
    };
  }
}

export class VideoRecordField extends TagField {
  constructor(private datasetService: DatasetService) {
    super(TagFieldType.VideoRecord, 'Video Record', 'string');
  }

  /**
   * The video record field requires a dataset to record to. This will provide
   * the user creating the form with a list of datasets to choose from.
   */
  async getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    const datasets = await this.datasetService.getDatasets();
    const options = datasets.map((dataset) => {
      return {
        const: dataset._id,
        title: dataset.name,
      };
    });
    return {
      dataset: {
        type: 'string',
        oneOf: options,
        description: 'The dataset to save the videos into',
      },
    };
  }

  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/dataset',
      },
    ];
  }

  protected getRequiredFieldProperties(): string[] {
    return ['dataset'];
  }

  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          customType: 'video',
          dataset: this.data.dataset,
          showUnfocusedDescription: true,
        },
      },
    ];
  }
}
