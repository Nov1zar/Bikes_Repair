
const url = "https://docs.google.com/spreadsheets/d/1RjvRglgv9n9BX0v4P6UElVWPTgPAQu81wiyrI2vX_HM/edit";
const webUrl = ScriptApp.getService().getUrl();




const Route = {};
  Route.path = function (route,callback){
  Route[route] = callback;
}


function doGet(e) {
  Route.path("repair_index",indexRepair);
  Route.path("about",loadAbout);
  Route.path("repair_form",repairForm);
  Route.path("dash", dashboard)

  


  if(Route[e.parameters.v]){
  return Route[e.parameters.v]();
  }else{
    return render("library").setTitle("Справочник запчастей");
  }
}

function dashboard(){
  return render ("dash").setTitle("Дашборд");
}

function indexRepair(){
  return render ("repair_index").setTitle("Формы ремонта");
}

function repairForm(){
  return render ("repair_form").setTitle("Форма ремонта");
}

function loadAbout(){
      return render("about", {title: "Text", other: "Other text"});
      
}

function getWebUrl(){
  
  return webUrl
}

