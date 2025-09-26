#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // 1. 交互提问
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "请输入项目名称:",
      default: "electron-app"
    },
    {
      type: "list",
      name: "packageManager",
      message: "请选择包管理器:",
      choices: ["pnpm", "yarn", "npm"],
      default: "pnpm"
    }
  ]);

  const projectName = answers.projectName.trim();
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ 目录 ${projectName} 已存在！`);
    process.exit(1);
  }

  // 2. 拷贝模板
  fs.mkdirSync(targetDir);
  const templateDir = path.join(__dirname, "template");
  fs.cpSync(templateDir, targetDir, { recursive: true });

  // 3. 检查包管理器命令是否存在
  try {
    execSync(`${answers.packageManager} --version`, { stdio: "ignore" });
  } catch (err) {
    console.error(`❌ 未找到命令: ${answers.packageManager}`);
    console.error(`👉 请先安装 ${answers.packageManager}`);
    process.exit(1);
  }

  // 4. 提示
  console.log(`\n✅ 项目已创建在 ${projectName}`);
  console.log("👉 下一步：");
  console.log(`   cd ${projectName}`);
  console.log(`   ${answers.packageManager} install`);
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
