#!/usr/bin/env node
const args = process.argv.slice(2);

const { getDependencies } = require('./utils/dependencies');
const { stringify } = require('./utils/stringify');
const { getName } = require('./utils/name');
const { create, read } = require('./utils/fs');
const { relative, join } = require('path');

if (args.includes('--help')) {
  console.log(`
Usage: create-webpack5-react <project-name>

You can set specific versions of dependencies by passing them as arguments:
yarn create webpack5-react . --version-react="18"
yarn create webpack5-react . --version-react 18 --version-webpack="^5.0.0"
`);

  process.exit(0);
}

const [outputDir, ...remainder] = args;
const dependencies = getDependencies(remainder);
const location = join(process.cwd(), relative(process.cwd(), outputDir));
const name = getName(location);

const generate = async ({ dependencies, location }) => {
  await create(join(location, 'package.json'), stringify({
    name,
    version: '1.0.0',
    description: '',
    private: true,
    author: '',
    scripts: {
      dev: "webpack serve --open",
      build: "webpack build",
    },
    dependencies
  }));

  await create(join(location, 'README.md'), ((await read(join(__dirname, '..', 'README.md'))).toString().replace(/create-webpack5-react/g, name)));

  await create(join(location, 'tsconfig.json'), await read(join(__dirname, '..', 'template', 'tsconfig.json')));
  await create(join(location, '.babelrc'), await read(join(__dirname, '..', 'template', '.babelrc')));
  await create(join(location, 'webpack.config.js'), await read(join(__dirname, '..', 'template', 'webpack.config.js')));
  await create(join(location, 'src', 'index.tsx'), await read(join(__dirname, '..', 'template', 'src', 'index.tsx')));
}

generate({ dependencies, location }).catch(e => {
  console.error(e);
  process.exitCode = 1;
});
