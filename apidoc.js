/* eslint-disable */
const path = require("path");
const apidoc = require("apidoc");
const fs = require('fs');
const src = path.resolve(__dirname, 'src/routes/');
const dest = path.resolve(__dirname, 'public/apidoc/');
const doc = apidoc.createDoc({src, dest})
if (typeof doc !== 'boolean') {
    replaceFile(dest + "/vendor/webfontloader.js", "//fonts.googleapis.com/css", "");
    addHeaderText();
    console.log("成功生成文档!");
    const config = require("./env/development.js");
    console.log("访问地址：http://127.0.0.1:" + config.port + "/public/apidoc/index.html")
}

function replaceFile(filePath, sourceRegx, targetStr) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return err;
        }
        let str = data.toString();
        str = str.replace(sourceRegx, targetStr);
        fs.writeFile(filePath, str, function (err) {
            if (err) return err;
        });
    });
}


function addHeaderText() {
    const text = `<div style="position: fixed;right: 10px;top: 10px;">
    统一Header修改:
    <select id="cpcRequeryType"></select>
    <input id="cpcRequeryValue" type="text">
    <button onclick="uniformModification()">确定修改</button>
    <script>
        document.getElementById('loader').addEventListener("DOMNodeRemoved", function () {
            setTimeout(() => {
                const allFieldDom = document.querySelectorAll('[id^="sample-request-header-field-"]');
                let allMap = [];
                allFieldDom.forEach(el => allMap.push(el.id))
                const all = [...new Set(allMap)];
                document.getElementById("cpcRequeryType").innerHTML = [...new Set(allMap)].map(id => {
                    return '<option value="'+id+'">'+id.replaceAll("sample-request-header-field-", "")+'</option>'
                });
                document.getElementById("cpcRequeryValue").value = localStorage.getItem("cpcRequeryValue");
                uniformModification();
            }, 1000)
        }, false);

        function uniformModification() {
            const cpcRequeryType = document.getElementById("cpcRequeryType");
            const value = document.getElementById("cpcRequeryValue").value;
            localStorage.setItem("cpcRequeryValue",value);
            document.querySelectorAll("#"+cpcRequeryType.value).forEach(el => {
                el.value = value
            })
        }

    </script>
</div>`;
    const filePath = dest + "/index.html";
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return err;
        }
        let str = data.toString();
        str = str + text;
        fs.writeFile(filePath, str, function (err) {
            if (err) return err;
        });
    });
}