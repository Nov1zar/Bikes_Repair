const currentDate = new Date ();
const formattedDate = Utilities.formatDate(new Date(), "GMT", "dd.MM.yyyy").toString();

const statuses = {
  created: "Создана",
  completed: "Подтверждена",
  payed: "Оплачена"
}




function randomQuotes() {
  var baseURL = 'https://thesimpsonsquoteapi.glitch.me/quotes';
  var quotesData = UrlFetchApp.fetch(baseURL, { muteHttpExceptions: true });
  var quote;
  var imageURL;
  if (quotesData.getResponseCode() == 200 || quotesData.getResponseCode() == 201) {
    var response = quotesData.getContentText();
    var data = JSON.parse(response)[0];
    quote = data["quote"];
    imageURL = data["image"];
    character = data["character"];
  } else {
    quote = 'Random Quote Generator is broken!';
    imageURL = 'https://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_large.png?v=1480481055';
  }
  var randomQuote = {
    "quote": quote,
    "character": character,
    "imageTag": '<img class="responsive-img" src="' + imageURL + '">'
  }
  return randomQuote;
}

function getTime() {
  var now = new Date();
  return now;
}


function getDataForTable(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Gears_CRUD");
  var dataArray = ws.getRange(2,1,ws.getLastRow()-1,6).getValues();
  
  return dataArray;
}



function deleteByID(id){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Gears_CRUD");
  var gearsID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
  var posIndex = gearsID.indexOf(id.toString().toLowerCase());
  var rowNumber = posIndex === -1 ? 0 : posIndex+2
  ws.deleteRows(rowNumber)
}

function getDataForEdit(id){  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Gears_CRUD");
  var gearsID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
  var posIndex = gearsID.indexOf(id.toString().toLowerCase());
  var rowNumber = posIndex === -1 ? 0 : posIndex+2;
  var gearsInfo = ws.getRange(rowNumber,1,1,6).getValues()[0];
  return {gearsID: gearsInfo[0], gearsName: gearsInfo[1], gearsType: gearsInfo[2], gearsRepairRent: gearsInfo[3],gearsPrice: gearsInfo[4], gearsWork: gearsInfo[5]}
}

function editGearsById(id, gearsInfo){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Gears_CRUD");
  var gearsID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
  var posIndex = gearsID.indexOf(id.toString().toLowerCase());
  var rowNumber = posIndex === -1 ? 0 : posIndex+2;
  ws.getRange(rowNumber,2,1,5).setValues([[
    gearsInfo.gearsName,
    gearsInfo.gearsType,
    gearsInfo.gearsRepairRent,
    gearsInfo.gearsPrice,
    gearsInfo.gearsWork
  ]]);
  return true
}



function addNewGears(gearsInfo){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Gears_CRUD");
  var gearsID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues();
  var maxNum = 0
  gearsID.forEach(r => {
    maxNum = r[0] > maxNum ? r[0] : maxNum
  });
  var newID = maxNum + 1
  ws.appendRow([
    newID,
    gearsInfo.gearsName,
    gearsInfo.gearsType,
    gearsInfo.gearsRepairRent,
    gearsInfo.gearsPrice,
    gearsInfo.gearsWork,
  ]);
}

















