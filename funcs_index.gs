function getDataForIndex(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Repair_Index");
  var arrayData = ws.getRange(2,1,ws.getLastRow()-1,13).getDisplayValues();
  return  arrayData
}

function getDashInfo(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Repair_Index");
  var arrayData = ws.getRange(2,1,ws.getLastRow()-1,9).getValues()
  dashInfo = arrayData.map(function(x){
    return {
      form_id: x[0],
      form_status: x[1],
      bike_id: x[2],
      bike_id: x[3],
      bike_type: x[4],
      bike_owner: x[5],
      rent_status: x[6],
      rider_name: x[7],
      total_amount: x[8]
    }
  })
  return dashInfo
}



function addNewForm(formInfo){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Repair_Index");
  
  // Ищем максимальное значение form_id в "Repair_Index"
  var formID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues();
  var maxNum = 0
  formID.forEach(r => {
    maxNum = r[0] > maxNum ? r[0] : maxNum
  });
  var newID = maxNum + 1
  

  // Добавляем новую строчку в "Repair_Index"
  ws.appendRow([
    newID,
    statuses.created,
    formInfo.bikeID.toString(),
    formInfo.assignedWorker,
    formInfo.bikeType,
    formInfo.bikeOwner,
    formInfo.bikeRent,
    formInfo.rentRepair,
    formInfo.riderName,
    formInfo.repairAmount,
    currentDate    
  ]);
}


function deleteFormID(form_ID){
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Repair_Index");
  var createdSheet = ss.getSheetByName("Repair_Show_Created")
  var gearsID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
  var posIndex = gearsID.indexOf(form_ID.toString().toLowerCase())+2;
  
  var rowNumber = posIndex === -1 ? 0 : posIndex
  

      var rows = createdSheet.getDataRange().getValues();
      var spreadsheetId = ss.getId();
      var sheetId = createdSheet.getSheetId();
      var reqs = rows.reduceRight(function(ar, e) {
        if (e[1] == form_ID) {
          var index = rows.indexOf(e)
          ar.push({"deleteDimension":{"range":{
            "sheetId": sheetId,
            "dimension": "ROWS",
            "startIndex": index,
            "endIndex": index+1
          }}});
        }
        return ar;
      }, []);
      if (reqs.length > 0)
      {Sheets.Spreadsheets.batchUpdate({"requests": reqs}, spreadsheetId);}    


  ws.deleteRow(rowNumber)
  
}


function getListOfMasters(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("masters_list");
  var listOfMasters = ws.getDataRange().getValues()
  
  return listOfMasters
}


