#!/usr/bin/env node

const { program } = require("commander");
const inquirer = require('inquirer');
const fs = require("fs");
const path = require("path");

let config = {};

try {
  config = require(path.resolve(process.cwd(), 'cli-config'));
}catch(e) {}

const { plugins = [] } = config;

program
  .arguments('<dir>')
  .action(dir => {

    inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'which farmework do yuo like best',
        choices: [
          'react', 'vue'
        ]
      }
    ]).then(ans => {
      const content = fs.readFileSync(path.resolve(__dirname, './index.boilerplate'), 'utf-8');

      const result = content.replace('__template', ans.framework);

      plugins.forEach(plugin => {
       const pluginModule = require(`@module-plugin-${plugin}`);
       pluginModule(result, dir);
      })

      fs.writeFileSync(path.resolve(process.cwd(), dir), result, 'utf-8');
    })


  })

program.parse(process.argv)