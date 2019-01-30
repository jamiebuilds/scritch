# Scritch

> Easily create a tiny CLI to help you write sharable scripts for your team

- Write scripts in any scripting language (JavaScript, Bash, Python, etc)
- Share your scripts as a CLI via npm
- Depend on other CLIs/libraries distributed via npm
- Injects useful environment variables into your script

## Install

```sh
npm install scritch
```

## Guide

Create a new npm package:

```sh
git init company-cli && cd company-cli
npm init
```

Create a `cli.js` file and call Scritch inside:

```sh
#!/usr/bin/env node
require('scritch')(__dirname)
```

Then make it executable:

```sh
chmod +x ./cli.js
```

Add `cli.js` as your `package.json#bin`:

```json
{
  "bin": "./cli.js"
}
```

Next create a `scripts` folder:

```sh
mkdir scripts
```

Then start adding scripts in your favorite scripting language:

```sh
touch scripts/build.sh
```

```sh
#!/bin/sh
set -e

start=$(date +%s)
echo "Building files..."

for i in $(seq 1 10); do
  sleep 0.1
  echo "- File $i built."
done

end=$(date +%s)
total=$((end-start))

echo "10 files built in $((total))s."
```

When you're done, make sure all the scripts you write are executable:

```sh
chmod +x ./scripts/*
```

## Usage

### Package Structure

Your package structure should look like this:

```
/company-cli/
  package.json
  cli.js (executable)
  /scripts/
    build.sh (executable)
    lint.js (executable)
    test.py (executable)
```

> **Note:** Scripts inside of `scripts/*` can be written in any scripting
> language.

In order to make the appropriate files executable you can run:

```sh
chmod +x ./cli.js
chmod +x ./scripts/*
```

Your `package.json` file should have the following fields:

```json
{
  "name": "company-cli",
  "version": "1.0.0",
  "description": "Our company's CLI",
  "bin": "cli.js",
  "dependencies": {
    "scritch": "*"
  }
}
```

### API Usage

The simplest usage of scritch is the following `cli.js` file:

```sh
#!/usr/bin/env node
require('scritch')(__dirname)
```

But scritch accepts other options:

```js
#!/usr/bin/env node
require('scritch')(__dirname, {
  // An alternate path to where your scripts are located
  scriptsPath: 'build/scripts',

  // Additional help content, great for examples
  help: `
    Examples
      Build all files:
      $ company-cli build

      Lint all files:
      $ company-cli lint

      Run all tests:
      $ company-cli test
  `,
  // Additional environment variables you would like to pass to all scripts
  env: {
    HELPER_ENV_VARIABLE: 'some value'
  }
})
```
