oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g scripts
$ scripts COMMAND
running command...
$ scripts (--version)
scripts/0.0.0 linux-x64 node-v17.9.1
$ scripts --help [COMMAND]
USAGE
  $ scripts COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`scripts hello PERSON`](#scripts-hello-person)
* [`scripts hello world`](#scripts-hello-world)
* [`scripts help [COMMAND]`](#scripts-help-command)
* [`scripts plugins`](#scripts-plugins)
* [`scripts plugins:install PLUGIN...`](#scripts-pluginsinstall-plugin)
* [`scripts plugins:inspect PLUGIN...`](#scripts-pluginsinspect-plugin)
* [`scripts plugins:install PLUGIN...`](#scripts-pluginsinstall-plugin-1)
* [`scripts plugins:link PLUGIN`](#scripts-pluginslink-plugin)
* [`scripts plugins:uninstall PLUGIN...`](#scripts-pluginsuninstall-plugin)
* [`scripts plugins:uninstall PLUGIN...`](#scripts-pluginsuninstall-plugin-1)
* [`scripts plugins:uninstall PLUGIN...`](#scripts-pluginsuninstall-plugin-2)
* [`scripts plugins update`](#scripts-plugins-update)

## `scripts hello PERSON`

Say hello

```
USAGE
  $ scripts hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/cbolles/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `scripts hello world`

Say hello world

```
USAGE
  $ scripts hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ scripts hello world
  hello world! (./src/commands/hello/world.ts)
```

## `scripts help [COMMAND]`

Display help for scripts.

```
USAGE
  $ scripts help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for scripts.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.16/src/commands/help.ts)_

## `scripts plugins`

List installed plugins.

```
USAGE
  $ scripts plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ scripts plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.5/src/commands/plugins/index.ts)_

## `scripts plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ scripts plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ scripts plugins add

EXAMPLES
  $ scripts plugins:install myplugin 

  $ scripts plugins:install https://github.com/someuser/someplugin

  $ scripts plugins:install someuser/someplugin
```

## `scripts plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ scripts plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ scripts plugins:inspect myplugin
```

## `scripts plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ scripts plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ scripts plugins add

EXAMPLES
  $ scripts plugins:install myplugin 

  $ scripts plugins:install https://github.com/someuser/someplugin

  $ scripts plugins:install someuser/someplugin
```

## `scripts plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ scripts plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ scripts plugins:link myplugin
```

## `scripts plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scripts plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scripts plugins unlink
  $ scripts plugins remove
```

## `scripts plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scripts plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scripts plugins unlink
  $ scripts plugins remove
```

## `scripts plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scripts plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scripts plugins unlink
  $ scripts plugins remove
```

## `scripts plugins update`

Update installed plugins.

```
USAGE
  $ scripts plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
