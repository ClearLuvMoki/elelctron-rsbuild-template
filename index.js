#!/usr/bin/env node
import inquirer from "inquirer";
import fs, { promises as fsp } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import ora from 'ora';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runCommandWithSpinner(command, message) {
  const spinner = ora(message)
  spinner.start();
  
  try {
    execSync(command, { stdio: 'pipe' });
    spinner.succeed('Dependencies installed successfully!');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    throw error;
  }
}

async function createProjectFiles(targetDir, templateDir) {
  const spinner = ora("Creating project files...").start();

  try {
    await fsp.mkdir(targetDir);
    await fsp.cp(templateDir, targetDir, { recursive: true });
    spinner.succeed("Project files created successfully!");
  } catch (err) {
    spinner.fail("Failed to create project files!");
    throw err;
  }
}


async function main() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Please input project name:",
      default: "electron-app"
    },
    {
      type: "list",
      name: "packageManager",
      message: "Please select package manager:",
      choices: ["pnpm", "yarn", "npm"],
      default: "pnpm"
    }
  ]);

  const projectName = answers.projectName.trim();
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Project ${projectName} already exists!`);
    process.exit(1);
  }

  const templateDir = path.join(__dirname, "template");
  await createProjectFiles(targetDir, templateDir);

  try {
    execSync(`${answers.packageManager} --version`, { stdio: "ignore" });
  } catch (err) {
    console.error(`❌ Command not found: ${answers.packageManager}`); 
    console.error(`👉 Please install ${answers.packageManager} first.`);
    process.exit(1);
  }

  try {
    process.chdir(targetDir);
    await runCommandWithSpinner(
      `${answers.packageManager} install`,
      `Installing dependencies with ${answers.packageManager}...`
    );
  } catch (error) {
    console.error('Error:', error.message);
    console.log(`👉 You can manually install dependencies later by running:`);
    console.log(`   cd ${projectName}`);
    console.log(`   ${answers.packageManager} install\n`);
  }

  console.log(`\n✅ Project ${projectName} created successfully!`);
  console.log("👉 Next steps:");
  console.log(`   cd ${projectName}`);
  console.log(`   ${answers.packageManager} run dev\n`);
}

main()
.catch(err => {
  if (err.isTtyError || err.name === "ExitPromptError") {
    process.exit(0); 
  }
  console.error(err);
  process.exit(1);
});