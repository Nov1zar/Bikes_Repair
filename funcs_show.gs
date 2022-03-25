


function getWords2(bike_type){
  
  var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gears_CRUD");
  var data = ws.getRange(2,2,ws.getLastRow(),2).getValues();
  var filtered = data.filter(function(x){return x[1] == bike_type })
  
  var options = {}
  filtered.forEach(function(v){
    options[v[0]]= false;
  });
  
  return options;
}






function modernLookInfo(gears_name_field){
  var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gears_CRUD");
  var array = ws.getRange(2,2,ws.getLastRow()-1,1).getValues();
  for(var i = 0; i<array.length;i++){
    if(array[i].toString().toLowerCase() === gears_name_field.toString().toLowerCase()) { //[1] because column B
      if (i+2 > -1){
      var info = {
                  gears_id: ws.getRange(i+2,1).getValue(),
                  gears_name: ws.getRange(i+2,2).getValue(),
                  gears_type: ws.getRange(i+2,3).getValue(),
                  gears_repair_rent: ws.getRange(i+2,4).getValue(),
                  gears_price: ws.getRange(i+2,5).getValue(),
                  gears_work: ws.getRange(i+2,6).getValue(),
                  }
      
      return info
    }
  }
}
}


function addNewGearsToForm(gearsInfo,formInfo ){

  var repair_sum = (Number(gearsInfo.gears_price) + Number(gearsInfo.gears_work))
  var repair_amount = repair_sum * gearsInfo.gears_quantity
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Repair_Show_Created");
  var gearsID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues();
  var maxNum = 0
  gearsID.forEach(r => {
    maxNum = r[0] > maxNum ? r[0] : maxNum
  });
  var newRodId = maxNum + 1
  
  ws.appendRow([
    newRodId,
    formInfo.form_id,
    formInfo.form_status,
    formInfo.bike_id,
    formInfo.bike_type,
    gearsInfo.gears_id,
    gearsInfo.gears_name,
    gearsInfo.gears_type,
    gearsInfo.gears_repair_rent,
    gearsInfo.gears_quantity,
    gearsInfo.gears_price,
    gearsInfo.gears_work,    
    repair_amount
  ]);
  updateIndexCost(formInfo)
}

function deleteRowInForm(rowID){
  var idToDel = rowID.rowId
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Repair_Show_Created");
  var gearsID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());

  
  var posIndex = gearsID.indexOf(idToDel.toString().toLowerCase());
  var rowNumber = posIndex === -1 ? 0 : posIndex+2
    var formInfo ={
    form_id: ws.getRange(rowNumber,2).getValues()
    }
  ws.deleteRow(rowNumber)
  updateIndexCost(formInfo)
}







function approveForm (form_id){
  
  // var form_id = 7

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var indexSheet = ss.getSheetByName("Repair_Index");
    var rowsIndexID = indexSheet.getRange(2,1,indexSheet.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
    var posIndex = rowsIndexID.indexOf(form_id.toString().toLowerCase())+2;
    indexSheet.getRange(posIndex,2).setValue(statuses.completed)
    indexSheet.getRange(posIndex,12).setValue(currentDate)

    var createdSheet = ss.getSheetByName("Repair_Show_Created")
    var approvedSheet = ss.getSheetByName("Repair_Show_Completed")
    var data = createdSheet.getRange(2,1,createdSheet.getLastRow()-1,createdSheet.getLastColumn()).getValues(); // Get values in active sheet
    data.forEach(function(x){
        if (x[1] == form_id){
          x[2] = statuses.completed

        }
    })
    
    var filteredData = data.filter(function(dataRow){
      return dataRow [1] == form_id.toString().toLowerCase()
      }) //getFiltered by form_id

    if (filteredData.length > 0) {approvedSheet.getRange(approvedSheet.getLastRow()+1,1,filteredData.length,13).setValues(filteredData)}
    

      var rows = createdSheet.getDataRange().getValues();
      var spreadsheetId = ss.getId();
      var sheetId = createdSheet.getSheetId();
      var reqs = rows.reduceRight(function(ar, e) {
        if (e[1] == form_id) {
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
}






function payForm (form_id){
  
  // var form_id = 7

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var indexSheet = ss.getSheetByName("Repair_Index");
    var rowsIndexID = indexSheet.getRange(2,1,indexSheet.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
    var posIndex = rowsIndexID.indexOf(form_id.toString().toLowerCase())+2;
    indexSheet.getRange(posIndex,2).setValue(statuses.payed)
    indexSheet.getRange(posIndex,13).setValue(currentDate)

    var approvedSheet = ss.getSheetByName("Repair_Show_Completed")
    var payedSheet = ss.getSheetByName("Repair_Show_Payed")
    var data = approvedSheet.getRange(2,1,approvedSheet.getLastRow()-1,approvedSheet.getLastColumn()).getValues(); // Get values in active sheet
    data.forEach(function(x){
        if (x[1] == form_id){
          x[2] = statuses.payed

        }
    })
    
    var filteredData = data.filter(function(dataRow){
      return dataRow [1] == form_id.toString().toLowerCase()
      }) //getFiltered by form_id

    if (filteredData.length > 0) {payedSheet.getRange(payedSheet.getLastRow()+1,1,filteredData.length,13).setValues(filteredData)}
    

      var rows = approvedSheet.getDataRange().getValues();
      var spreadsheetId = ss.getId();
      var sheetId = approvedSheet.getSheetId();
      var reqs = rows.reduceRight(function(ar, e) {
        if (e[1] == form_id) {
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
}




function smartDataLoadForm (id){
  
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var risheet = ss.getSheetByName("Repair_Index");
  var formIDs = risheet.getRange(2,1,risheet.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
  
  var posIndex = formIDs.indexOf(id.toString().toLowerCase())+2;
  var rowNumber = posIndex === -1 ? 0 : posIndex
  

  var formInfo ={
                  form_id: risheet.getRange(rowNumber, 1).getValue(),
                  form_status: risheet.getRange(rowNumber, 2).getValue(),
                  bike_id: risheet.getRange(rowNumber, 3).getValue(),
                  assigned_worker: risheet.getRange(rowNumber, 4).getValue(),
                  bike_type: risheet.getRange(rowNumber, 5).getValue(), 
                  bike_owner: risheet.getRange(rowNumber, 6).getValue(),
                  bike_rent: risheet.getRange(rowNumber, 7).getValue(),
                  rent_repair: risheet.getRange(rowNumber, 8).getValue(),
                  rider_name: risheet.getRange(rowNumber, 9).getValue()
                }     
  
  

  switch (formInfo.form_status)
    {
        case statuses.created:
            var ws = ss.getSheetByName("Repair_Show_Created")
            break;
        case statuses.completed:
            var ws = ss.getSheetByName("Repair_Show_Completed")
            
            break;
        case statuses.payed:
            var ws = ss.getSheetByName("Repair_Show_Payed")
            break;
    }
  var arrayData = ws.getRange(2,1,ws.getLastRow()-1,13).getValues();
  

  var filtered = arrayData.filter(function(dataRow){return dataRow [1] == id.toString().toLowerCase()})


  var dataObject = filtered.map(function(x) {
    return {    
          row_id: x[0],
          form_id: x[1],
          form_status: x[2],
          bike_id: x[3],
          bike_type: x[4],
          gears_id: x[5],
          gears_name: x[6],
          gears_type: x[7],
          gears_repair_rent: x[8],
          gears_quantity: x[9],
          gears_price: x[10],
          gears_work: x[11],
          repair_amount: x[12],
          }
      });
    
  return [dataObject, formInfo]
}        

  



function updateIndexCost(formInfo){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var indexSheet = ss.getSheetByName("Repair_Index");
  var ws = ss.getSheetByName("Repair_Show_Created")
    var rowsIndexID = indexSheet.getRange(2,1,indexSheet.getLastRow()-1,1).getValues().map(r => r[0].toString().toLowerCase());
    var posIndex = rowsIndexID.indexOf(formInfo.form_id.toString().toLowerCase())+2;
  

  var arrayData = ws.getRange(2,1,ws.getLastRow()-1,13).getValues();
  
  
  var filtered_sum = arrayData.filter(function(dataRow){return dataRow [1] == formInfo.form_id.toString().toLowerCase()}).map(function(x){return x[12]})
  if(filtered_sum.length === 0){
    indexSheet.getRange(posIndex,10).setValue(0)
  }else
  {indexSheet.getRange(posIndex,10).setValue(filtered_sum.reduce(function(a,b){return a+b}))}
  
  
  


}
  

  


  
