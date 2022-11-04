import {Command, Flags} from '@oclif/core';
import { MongoClient } from 'mongodb';

/**
 * Command to reset the state of SignLab to some state. The user can either
 * reset SignLab back to its intial state, or load in some default data.
 *
 * By default will simply reset the state of SignLab to its initial state.
 */
export default class Reset extends Command {
  static description = 'Reset SignLab to some state'

  static flags = {
    fromFile: Flags.string({
      char: 'f', description: 'Path to JSON file with reload information', required: false
    }),
    db: Flags.string({
      char: 'd', descriptions: 'Database URL', required: false, default: 'mongodb://localhost:27017/signlab'
    }),
    fromDefault: Flags.boolean({
      char: 'p', description: 'Load in default data stored in script', required: false, default: false
    }),
  }

  args: any;
  flags: any;
  client: MongoClient | null = null;

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Reset)

    // Keep the arguments around
    this.args = args;
    this.flags = flags;

    // Connect to the database
    this.client = new MongoClient(this.flags.db);
    await this.client.connect();

    this.log(`Clearing out database`);
    await this.clearDB();

    // If the user requested, restore the database from some state
    if (flags.from || flags.fromDefault) {
      const state = flags.from ? flags.from : defaultSettings;

      this.log(`Loading in data from ${flags.from}`);
      await this.loadDB();
    }

    await this.client.close();
  }


  private async clearDB(): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    await this.client.db().dropDatabase();
  }

  private async loadDB(): Promise<void> {

  }
}

const defaultSettings = [
  {
    collection: 'users',
    data: [
    ]
  },
];
