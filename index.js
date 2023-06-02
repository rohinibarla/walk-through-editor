const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`


    <!DOCTYPE html>
    <html>
    <head>
        <title>ACE Editor</title>
        <style type="text/css">
            #editor_code { 
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
            }
            #editor_json { 
                position: absolute;
                top: 0%;
                left: 50%;
                width: 50%;
                height: 65%;
            }
            #editor_trace_variables { 
                position: absolute;
                top: 70%;
                left: 50%;
                width: 50%;
                height: 20%;
            }
            button{
                position: absolute;
                top: 90%;
                left: 50%;
                width: 50%;
                height: 10%;

            }
        </style>
    </head>
    <body>
        <div id='final'>
        <form id="data" method="POST">
    
    
         <div id="editor_code">int i = 10;
    number_rayu(i);</div>
        <div id="editor_json">[
            {"line": 2, "variable": "i",        "answer": 1},
            {"line": 4, "variable": "output",   "answer": 1},
            {"line": 2, "gotoline": 4},
            {"line": 6}
    ]</div>
    <div id="editor_trace_variables">i output</div>
    <button type="submit" id="submit" >submit</button>

    </form>
    </div>
        <!-- Include the ACE library -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" type="text/javascript" charset="utf-8"></script>
        <script>
            var editor_code = ace.edit("editor_code");
            editor_code.setTheme("ace/theme/monokai");
            editor_code.session.setMode("ace/mode/c_cpp");
    
            var editor_json = ace.edit("editor_json");
            editor_json.setTheme("ace/theme/monokai");
            editor_json.session.setMode("ace/mode/json");
    
            var editor_trace_variables = ace.edit("editor_trace_variables");
            editor_trace_variables.setTheme("ace/theme/monokai");
            editor_trace_variables.session.setMode("ace/mode/txt");
        


            document.getElementById('data').addEventListener('submit', function(e) {
                e.preventDefault();
            
                var code = editor_code.getValue();
                var json = editor_json.getValue();
                var trace = editor_trace_variables.getValue() ;
            
                var xhr = new XMLHttpRequest();
                xhr.open("POST", this.action, false);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            
                /*xhr.onloadend = function() {
                    if (xhr.status == 200) {
                        // success
                        var myWindow = window.open();
                        myWindow.document.write(xhr.response);
                    } else{
                        // error
                    }

                };*/
            
                var data = {
                    code: code,
                    json: json,
                    trace: trace

                };
                 //console.log(data);
                 console.log(JSON.stringify(data));
                xhr.send(JSON.stringify(data));
                var myWindow = window.open("", "trace.html", "width=800,height= 950" );
                myWindow.document.open();
                myWindow.document.write(xhr.responseText);
                myWindow.document.close();
              
                
            });
            
        </script>
        
    </body>
    </html>`

)});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.post('/', (req, res) => {
    console.log(req.body);
    const code = req.body.code;
    const walkthrough = req.body.json;
    const trace_variables = req.body.trace.split(' ').map(va => `<th>${va}</th>`).join('');

    const htmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
        <title>Walk-through C loops 01</title> 
        <script type="text/javascript" src="https://e42.dev/c/assets/scripts/e42_all_min.js"></script> 
        <link type="text/css" rel="stylesheet" href="https://e42.dev/c/assets/css/e42_all_min.css"></link>
    
        <style type='text/css'>
         ol.interactivities > li {
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
      </head>
     
      <body>
        <ol class='interactivities' id='interactivities'>
          <li title='c-loops-walkthrough-01' id='c-loops-walkthrough-01'>
            <div class='hc-included'>
              <div>
                <p>Walk-through the sample code.</p>
                <div class='e42_walkthrough'>
                  <pre>${code}
                </pre>
                <table style="font-size:x-large">
                  <tr>
    ${trace_variables}
    
                  </tr>
                </table>
                  <script type='text/javascript'>//<![CDATA[
    e42_walkthrough.setup.push(
    ${walkthrough}
    )
                  //]]> </script> 
                </div>
              </div>
            </div>
          </li>
        </ol>
        <div class='vstreport'></div>
      </body>
    </html>`
    ;
    console.log(htmlContent);
    res.send(htmlContent);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
