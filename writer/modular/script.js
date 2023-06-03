var editorData = {};

function setupAceEditors() {
    editorData.code = ace.edit("editor_code");
    editorData.code.setTheme("ace/theme/monokai");
    editorData.code.session.setMode("ace/mode/c_cpp");

    editorData.json = ace.edit("editor_json");
    editorData.json.setTheme("ace/theme/monokai");
    editorData.json.session.setMode("ace/mode/json");
}

// Other functions
function traceVaraibles(jsonText) {
    var jsonData = JSON.parse(jsonText);
    // First, map to get all variables
    var variables = jsonData.map(function(obj) {
        return obj.variable;
    });

    // Then, filter out unique values
    var uniqueVariables = [...new Set(variables)].filter(Boolean);
    console.log(uniqueVariables);  // Outputs: ["i", "output"]

    return uniqueVariables.map(va => `<th>${va}</th>`).join('');
}

 function encodeHTMLEntities(code) {
    var htmlEntities = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return code.replace(/[<>&'"]/g, function (match) {
      return htmlEntities[match];
    });
  }

  function createHtml() {
    var code = editorData.code.getValue();
    code = encodeHTMLEntities(code);
    var walkthrough = editorData.json.getValue();
    var trace_variables = traceVaraibles(walkthrough);
    var htmlContent = createHtmlContent(code, walkthrough, trace_variables);

    var blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    return blob;
}

// Create HTML Content
function createHtmlContent(code, walkthrough, trace_variables) {
    var work_around = `</scri` + `pt>`;
    
    var htmlHead = createHtmlHead(work_around);
    var htmlBody = createHtmlBody(code, walkthrough, trace_variables, work_around);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    ${htmlHead}
    ${htmlBody}
</html>`;
}

// Create HTML Head
function createHtmlHead(work_around) {
    return `<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
<title>Walk-through C loops 01</title> 
<script type="text/javascript" src="https://e42.dev/c/assets/scripts/e42_all_min.js">${work_around}
<link type="text/css" rel="stylesheet" href="https://e42.dev/c/assets/css/e42_all_min.css"></link>
<style type="text/css">
ol.interactivities>li {
    list-style: none;
    margin-bottom: 2em;
}

.problemheading {
    font-size: 1.4em;
    font-weight: bold;
    font-family: monospace;
    border-top: thin dotted black;
    padding-top: 0.4em;
}

body {
    margin-left: 2em;
    margin-right: 2em;
    overflow-y: visible;
    font-size: x-large;
}
</style>
</head>`;
}

// Create HTML Body
function createHtmlBody(code, walkthrough, trace_variables, work_around) {
    return `<body>
<ol class="interactivities" id="interactivities">
    <li title="c-loops-walkthrough-01" id="c-loops-walkthrough-01">
        <div class="hc-included">
            <div>
                <p>Walk-through the sample code.</p>
                <div class="e42_walkthrough">
                    <pre>${code}</pre>
                    <table style="font-size:x-large"><tr>${trace_variables}</tr></table>
                    <script type="text/javascript">//<![CDATA[
                        e42_walkthrough.setup.push(${walkthrough})
                    //]]> ${work_around}
                </div>
            </div>
        </div>
    </li>
</ol>
<div class="vstreport"></div>
</body>`;
}

// Open in New Tab
function openInNewTab(htmlContent) {
    var blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    
    // Open the URL in a new tab
    window.open(url, '_blank');
}

function open_html() {
    var blob = createHtml();
    var url = URL.createObjectURL(blob);

    // Open the URL in a new tab
    window.open(url, '_blank');
}

function download_html() {
    var blob = createHtml();
    var downloadLink = document.createElement("a");
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "index.html";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

window.onload = setupAceEditors;

