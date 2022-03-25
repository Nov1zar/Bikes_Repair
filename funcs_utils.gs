function include(filename){
  return HtmlService.createTemplateFromFile(filename).getRawContent();
}

function render (file,argsObject){
  var tmp = HtmlService.createTemplateFromFile(file);
  if(argsObject){
    var keys = Object.keys(argsObject);
    keys.forEach(function(key){
      tmp[key] = argsObject[key];
    })
  } //end IF
  return tmp.evaluate();
} // end RENDER
