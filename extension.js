// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

function getLogic(path) {
  return `import 'package:get/get.dart';
  
import 'state.dart';
  
class ${path}Logic extends GetxController {
  final state = ${path}State();
}`
}

function getState(path) {
  return `class ${path}State {
}`
}

function getView(path) {
  return `import 'package:flutter/material.dart';
import 'package:get/get.dart';
  
import 'logic.dart';
import 'state.dart';

class ${path}Page extends StatelessWidget {
  final ${path}Logic logic = Get.put(${path}Logic());
  final ${path}State state = Get.find<${path}Logic>().state;

  ${path}Page({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }
}`
}

// file_name 转换为 FileName dart大驼峰
function changePathFunc(path) {
  let result = [];
  [...path].forEach((item, index, array) => {
    array[0] = array[0].toUpperCase();
    if (item === '_') {
      array[index + 1] = array[index + 1].toUpperCase();
    }
    result.push(array[index]);
  })
  return result.join('').replace(/\_*/g, '');
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('getx-create-page.helloWorld', function (args) {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
    vscode.window.showInputBox({
      placeHolder:'输入文件夹名称', 
      prompt: "文件夹里生成view.dart、logic.dart、state.dart",
    }).then((path) =>{
      if (!path) {
        return
      }
      if (!fs.existsSync(`${args.path}/${path}`)) {
        fs.mkdirSync(`${args.path}/${path}`);

        let fileName = changePathFunc(path);
        fs.writeFileSync(`${args.path}/${path}/logic.dart`, getLogic(fileName));
        fs.writeFileSync(`${args.path}/${path}/state.dart`, getState(fileName));
        fs.writeFileSync(`${args.path}/${path}/view.dart`, getView(fileName));

		    vscode.window.showInformationMessage(`${path}文件夹创建成功!`);
      } else {
        vscode.window.showErrorMessage(`'${args.path}'目录下${path}文件夹已存在!`);
      }
    });
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
