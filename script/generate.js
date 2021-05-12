var fs = require('fs');

var path = process.cwd();

const templateBase = './template/';
const templateApi = templateBase + 'api.txt';
const templateModel = templateBase + 'model.js';
const templateOperating = templateBase + 'operating.js';
const templatePage = templateBase + 'page.js';

const pageSrc = '../src/pages/';

const writeFilepath = '../src/services/api.js';

function run(argv) {
  if (argv[0] === '-v' || argv[0] === '--version') {
    console.log('version is 1.0.0');
  } else if (argv[0] === '-l' || argv[0] === '--list') {
    let data = fs.readFileSync(templateApi);
    data = data.toString();

    const name = argv[1];
    const cname = argv[2];
    const pagePath = pageSrc + argv[3];
    const operatingPath = pagePath + '/operating';
    const modelsPath = pagePath + '/models';

    data = data.replace(/\{name\}/g, name);
    data = data.replace(/\{cname\}/g, cname);

    let apiData = fs.readFileSync(writeFilepath);
    apiData = apiData.toString().replace(/\};/, data + '\n};');

    fs.writeFileSync(writeFilepath, apiData, error => {
      if (error) return console.log('写入文件失败,原因是' + error.message);
      console.log('api写入成功');
    });

    fs.mkdirSync(pagePath, function(error) {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('创建目录成功');
    });

    fs.mkdirSync(modelsPath, function(error) {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('创建Models目录成功');
    });

    fs.mkdirSync(operatingPath, function(error) {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('创建operating目录成功');
    });

    data = fs.readFileSync(templateModel);
    data = data.toString();
    data = data.replace(/_modelName_/g, name);
    fs.writeFileSync(`${modelsPath}/${name}.js`, data, error => {
      if (error) return console.log('写入文件失败,原因是' + error.message);
      console.log('model文件创建成功');
    });

    data = fs.readFileSync(templateOperating);
    data = data.toString();
    data = data.replace(/_cname_/g, cname);
    fs.writeFileSync(`${operatingPath}/index.js`, data.toString(), error => {
      if (error) return console.log('写入文件失败,原因是' + error.message);
      console.log('operating文件创建成功');
    });

    data = fs.readFileSync(templatePage);
    data = data.toString();
    data = data.replace(/_modelName_/g, name);
    fs.writeFileSync(`${pagePath}/index.js`, data, error => {
      if (error) return console.log('写入文件失败,原因是' + error.message);
      console.log('page文件创建成功');
    });
    console.log('创建成功');
  }
}

run(process.argv.slice(2));
