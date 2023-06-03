var editorData = {};

function setupAceEditors() {
    editorData.code = ace.edit("editor_code");
    editorData.code.setTheme("ace/theme/monokai");
    editorData.code.session.setMode("ace/mode/c_cpp");

    editorData.json = ace.edit("editor_json");
    editorData.json.setTheme("ace/theme/monokai");
    editorData.json.session.setMode("ace/mode/json");
    
    editorData.title = ace.edit("title_editor");
    editorData.title.setTheme("ace/theme/monokai");
    editorData.title.session.setMode("ace/mode/text");

    editorData.id = ace.edit("id_editor");
    editorData.id.setTheme("ace/theme/monokai");
    editorData.id.session.setMode("ace/mode/text");

    editorData.explanation = ace.edit("explanation_editor");
    editorData.explanation.setTheme("ace/theme/monokai");
    editorData.explanation.session.setMode("ace/mode/text");
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
    var title = editorData.title.getValue();
    var id = editorData.id.getValue();
    var explanation = editorData.explanation.getValue();

    var work_around = `</scri` + `pt>`;
    
    var htmlHead = createHtmlHead(work_around);
    var htmlBody = createHtmlBody(code, walkthrough, trace_variables, work_around, title, id, explanation);
    
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
<title>Enhance42 Walkthrough</title> 
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
function createHtmlBody(code, walkthrough, trace_variables, work_around, title, id, explanation) {
    return `<body>
<ol class="interactivities" id="interactivities">
    <li title="${title}" id="${id}">
        <div class="hc-included">
            <div>
                <p>${explanation}</p>
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

function download_html_json() {
    var blob = createHtml();
    var id = editorData.id.getValue();

    // Download HTML file
    var downloadLinkHTML = document.createElement("a");
    var urlHTML = URL.createObjectURL(blob);
    downloadLinkHTML.href = urlHTML;
    downloadLinkHTML.download = `${id}.html`;
    document.body.appendChild(downloadLinkHTML);
    downloadLinkHTML.click();
    document.body.removeChild(downloadLinkHTML);

    // Create JSON object
    var jsonObject = {
        code: editorData.code.getValue(),
        walkthrough: editorData.json.getValue(),
        title: editorData.title.getValue(),
        id: editorData.id.getValue(),
        explanation: editorData.explanation.getValue()
    };

    // Download JSON file
    var jsonBlob = new Blob([JSON.stringify(jsonObject)], { type: "application/json" });
    var downloadLinkJSON = document.createElement("a");
    var urlJSON = URL.createObjectURL(jsonBlob);
    downloadLinkJSON.href = urlJSON;
    downloadLinkJSON.download = `${id}.json`;
    document.body.appendChild(downloadLinkJSON);
    downloadLinkJSON.click();
    document.body.removeChild(downloadLinkJSON);
}


window.onload = setupAceEditors;

