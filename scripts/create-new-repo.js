const figlet = require("figlet")
const { input} = require("@inquirer/prompts")
const chalk = require("chalk")
const Spinner = require('cli-spinner').Spinner;
const fs = require("node:fs")
const path = require("node:path")
const _ = require("lodash")

const run = async () => {
  console.log(figlet.textSync("React Awesome Components"))
  const packageName = await input({ message: 'Enter package name (write in camel case): ' });
  const description = await input({ message: 'Enter package description: ' });
  const keywordStr = await input({ message: 'Enter package keywords (separate by whitespace): ' });
  
  const keywords = keywordStr.split(" ").map(str => JSON.stringify(str)).join(",\n")

  const spinner = new Spinner(chalk.yellow(`Creating new package ${packageName}... %s `));
  spinner.setSpinnerString('⣾⣽⣻⢿⡿⣟⣯⣷');
  spinner.start();

  const kebabName = _.kebabCase(packageName)

  const packageFolder = path.resolve(__dirname, "../packages/" + kebabName)

  // Create new folder with kebab case
  fs.mkdirSync(packageFolder)

  // Copy contents to new folder
  fs.cpSync(path.resolve(__dirname, "./template"), packageFolder, { recursive: true })

  // Replace package name

  const replaceFiles = [
    path.resolve(packageFolder, "./README.md"),
    path.resolve(packageFolder, "./package.json")
  ]

  for(const filePath of replaceFiles) {
    const content = fs.readFileSync(filePath).toString('utf8')
    const kebabRegex = new RegExp("<package-kebab>", 'g')
    const camelRegex = new RegExp("<package-camel>", 'g')
    const descriptionRegex = new RegExp("<description>", "g")
    const keywordRegex = new RegExp("\"<keywords>\"", "g")
    let updatedContent = content.replace(kebabRegex, kebabName)
    updatedContent = updatedContent.replace(camelRegex, packageName)
    updatedContent = updatedContent.replace(descriptionRegex, description)
    updatedContent = updatedContent.replace(keywordRegex, keywords)
    fs.writeFileSync(filePath, updatedContent, 'utf8')
  }

  spinner.stop();

  console.log(chalk.green(`\nYour new package is located at ${packageFolder}. Happy Hacking!!`))
  
  console.log(chalk.yellow("Remember to do the following steps:"))
  console.log(chalk.blue("- Ignore newly created package in vite.config.ts file."))
  console.log(chalk.blue("- Add Codecov step for newly created package in test.yml workflow."))
  console.log(chalk.blue("- Add new package to the @react-awesome/components's package.json dependencies."))
}

run()