//表單變數
var googleFormID = "1IDlzkzRoTpkl40qV9SSuv3GC0O-4S8NyxSg2Gyu6sC0";
function FormResponse(){
  // 通過ID打開一個表單，並記錄對每個問題的回答。
  var form = FormApp.openById(googleFormID);
  var formResponses = form.getResponses();//得到所有回應
    
  //---- 所有回應
  for (var i = 0; i < formResponses.length; i++) {
    var formResponse = formResponses[i];//每一筆回應
    var itemResponses = formResponse.getItemResponses();//回應內容
    var formResponseTime = formResponse.getTimestamp();//時間戳記    
    //var formRespondentEmail = formResponse.getRespondentEmail();//取得表單上「電子郵件地址」
        
    //----宣告試算表每列變數----
    var rowdata = {};  
    var total = 0;  
      
    //其他自訂欄位(前)
    //rowdata["填報標題"] = "";//填報標題  
    rowdata["時間戳記"] = formResponseTime;//表單回應時間
    //rowdata['電子郵件地址'] = formRespondentEmail;//電子郵件地址
      
    //----取得單筆回應資料
    for (var j = 0; j < itemResponses.length; j++) {
      var itemResponse = itemResponses[j];      
      var title = itemResponse.getItem().getTitle();//問題名稱
      var value = itemResponse.getResponse();//填報內容
      rowdata[title] = value;
      //時間戳記	桌號	雞腿飯-90元	雞排飯-80元	排骨飯-70元	招牌飯-60元	備註
      if(title == "雞腿飯-90元" || title == "雞排飯-80元" || title == "排骨飯-70元" || title == "招牌飯-60元"  ){        
        var subTotal =  title.split("-");
        total += parseInt(subTotal[1]) * value;
      }
    }
    //其他自訂欄位(尾)
    //----單筆回應資料end  
    rowdata['合計'] = total;  
      
    //----單筆要做的事情
    sendToLine(rowdata);//LineNotify通知
    appendRow(rowdata);//寫入總表
    //----單筆要做的事情 end   
      
  }
  //刪除回應問題
  form.deleteAllResponses();
}  
  
//填入Line Notify 權杖
var lineToken = "Sfl3NziZ1vLzvB2LhOOvh4YfKwbVZnahqvhOJM5KVU2";  
function sendToLine(rowdata){
  //整理   
  var message = "\n"; 
    
  for (var key in rowdata){
    message += key + " : " + rowdata[key] + "\n";
  }
  var options =
  {
      method  : "post",
      payload : "message=" + message,
      headers : {"Authorization" : "Bearer "+ lineToken},
      muteHttpExceptions : true
  };  
  
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}

//試算表變數
var SpreadsheetAppId = "SpreadsheetAppId";
var sheetName = '總表';
 
function appendRow(rowdata){
   
  //用id取得試算表
  var ss = SpreadsheetApp.openById(SpreadsheetAppId);  
  //用工作表名稱設定工作表
  var Sheet = ss.getSheetByName(sheetName);
  //設定工作表 0 1 2 ....
  //var Sheet = ss.getSheets()[0];//第1個工作表
   
  //插入第2行空白
  var row = 2;
  Sheet.insertRowBefore(row);
  //        
   
  //寫入記錄
  //時間戳記	桌號	雞腿飯-90元	雞排飯-80元	排骨飯-70元	招牌飯-60元	備註	合計
  //var data = [rowdata['時間戳記'],rowdata['桌號'],rowdata['雞腿飯-90元'],rowdata['雞排飯-80元'],rowdata['排骨飯-70元'],rowdata['招牌飯-60元'],rowdata['備註'],rowdata['合計']];
  // 上午 10:37:44			0	0	0		180
  var data = ["2020/2/12 上午 10:37:44","1號桌","1","2","3","4","5","6"];
   
  data.forEach(function(item,index){
    Sheet.getRange(row, index+1).setValue(item);
  });
}