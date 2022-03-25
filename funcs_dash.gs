const todayDate = Utilities.formatDate(new Date(), "GMT", "yyyy-mm-dd");
  const firstOfMonth = new Date(); // today
  const lastOfMonth = new Date(); 
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var ws = ss.getSheetByName("dashboards")

function setDefaultDates(){

  lastOfMonth.setMonth(lastOfMonth.getMonth()+1);  // Go ahead one month
  lastOfMonth.setDate(0);
  firstOfMonth.setDate(1);
  ws.getRange(1,2).setValue(firstOfMonth)
  ws.getRange(1,4).setValue(lastOfMonth)

}

function updateDates(dateInfo){
  ws.getRange(1,2).setValue(dateInfo.from_date)
  ws.getRange(1,4).setValue(dateInfo.to_date)
}



function getMainDashInfo() {
  
  Utilities.sleep(300)
  var data = ws.getRange(4,1,4,7).getValues()
  return data  

}

function getMastersDashInfo(){
  
  Utilities.sleep(300)
  var data = ws.getRange(10,1,ws.getLastRow()-1,7).getValues()
    var filtered = data.filter(function(r){
    return r.join("").length>0;
  });
  return filtered

}


function getBikesDashInfo(){
  
  Utilities.sleep(300)
  var data = ws.getRange(10,10,ws.getLastRow()-1,5).getValues()
      var filtered = data.filter(function(r){
    return r.join("").length>0;
  });
  return filtered

}


function getGearsDashInfo(){
  Utilities.sleep(300)
  var data = ws.getRange(10,17,ws.getLastRow()-1,7).getValues()
      var filtered = data.filter(function(r){
    return r.join("").length>0;
  });
  Logger.log(filtered)
  return filtered

}





