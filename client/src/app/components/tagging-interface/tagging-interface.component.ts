import { Component, OnInit } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import {ResponseService} from '../../services/response.service';
import { Tag } from '../../../../../shared/dtos/tag.dto';
import { AslLexSignBankField, aslLexSignBankControlRendererTester } from './custom-fields/asl-lex-field.component';

@Component({
  selector: 'tagging-interface',
  templateUrl: './tagging-interface.component.html',
  styleUrls: ['./tagging-interface.component.css']
})
export class TaggingInterface implements OnInit {
  renderers = [
    ...angularMaterialRenderers,
    { tester: aslLexSignBankControlRendererTester, renderer: AslLexSignBankField }
  ];

  /**
   * Determine the format of the data contained within the tag such as the
   * various properties and their types. This is a JSON Schema object
   */
  tagDataSchema: any = { };
  /**
   * Defines how the tag fields should be presented in a form.
   * This is a JSON Forms object
   */
  tagUISchema: any = { };
  /**
   * The existing data to populate the form with
   */
  tagData = { };
  /**
   * The tag that the user needs to complete
   */
  tag: Tag;
  /**
   * Flag that represents there are more tags to be completed. Changing it will
   * display to the user that all videos have been taged
   */
  hasRemainingTags: boolean = true;

  constructor(private responseService: ResponseService) {}

  ngOnInit(): void {
    this.getNextTag();
  }

  /**
   * Handle data update, store the changes in the local representation of
   * the form for submission when the user prompts for it.
   */
  formChange(data: any) {
    this.tagData = data;
  }

  /**
   * Request the next tag to complete from the server and update the view
   * for the new tag. If no additional tag is available, set the
   * `hasRemainingTags` field which updates the view to display a message to
   * the user.
   */
  async getNextTag() {
    // Clear out current data
    this.tagData = {};

    const tag = await this.responseService.getNextUntaggedResponse();

    // No more tags for this study
    if (!tag) {
      this.hasRemainingTags = false;
      return;
    }

    // Update the local variables
    this.tag = tag;
    this.tagDataSchema = tag.study.tagSchema.dataSchema;
    this.tagUISchema = tag.study.tagSchema.uiSchema;
  }

  /**
   * Handle submitting the user tag data
   */
  async formSubmit() {
    try {
      this.tag.info = this.tagData;
      await this.responseService.addTag(this.tag);

      // Get next tag to complete
      this.getNextTag();
    } catch(error) {
      alert('Please fill out all required fields following the instructions for each field');
    }
  }
}
