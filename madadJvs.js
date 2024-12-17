const todayd=new Date();

const day = String(todayd.getDate()).padStart(2,'0');
console.log(document.getElementById('dateto'));
const month=String(todayd.getMonth()+1).padStart(2,'0');
const year=todayd.getFullYear();
document.getElementById('dateto').max=`${year}-${month}-${day}`;
document.getElementById('datefrom').max=`${year}-${month}-${day}`;



function shita(){
    const boded=document.getElementById('boded');
    const kovetz=document.getElementById('kovetz');
    const outputDiv = document.getElementById('output');
  

    if (boded.checked) {
        document.getElementById('madadstyle').style.display='block';
        document.getElementById('taarich').style.display='block';
        document.getElementById('schomdiv').style.display='block';
        document.getElementById('hashevdiv').style.display='block';
        document.getElementById('btnlblup').style.display='none';
        outputDiv.innerHTML = '';
        document.getElementById('input-excel').value = '';
    }
    else{
        document.getElementById('madadstyle').style.display='none';
        document.getElementById('taarich').style.display='none';
        document.getElementById('schomdiv').style.display='none';
        document.getElementById('hashevdiv').style.display='none';
        document.getElementById('tables').style.display='none';
        document.getElementById('btnlblup').style.display='block';
    }
    }

function cnl(){
    const boded=document.getElementById('boded');
    const kovetz=document.getElementById('kovetz');
    const yadoa=document.getElementById('yadoa');
    const begin=document.getElementById('begin');
    
    if (boded.checked) {
        if(begin.checked){bodedf('begin');}
        if(yadoa.checked){bodedf('yadoa');}
    } 
    else if (kovetz.checked) {
      return;
    } 
}

function bodedf(x) {
    let df = document.getElementById('datefrom');
    let dt = document.getElementById('dateto');
    
    
    let datef = new Date(df.value); 
    let datet = new Date(dt.value); 
    const numericValue = document.getElementById('schom').value.replace(/[^\d]/g, '');
    const schom=parseFloat(numericValue);
    
    if( isNaN(datef) || isNaN(datet) || datef>datet){alert('בדוק תקינות תאריכים');return;}
    if(!schom ){alert('חסר סכום');return;}
    
    let dayf = datef.getDate(); 
    let monthf = datef.getMonth() + 1; 
    let yearf = datef.getFullYear(); 
    
    let dayt = datet.getDate(); 
    let montht = datet.getMonth() + 1; 
    let yeart = datet.getFullYear();
    
    let formatdatef
    let formatdatet

    if(x==="yadoa"){

    if(dayf<15 && Number(monthf) <3){
        formatdatef=String(monthf+10)+String(yearf-1);    
    }
    else if(dayf>=15 && Number(monthf) ===1){
        formatdatef="12"+String(yearf-1);   
    }
    else if(dayf<15){
        formatdatef=String(monthf-2)+String(yearf);    
    }
    else if(dayf>=15 ){
        formatdatef=String(monthf-1)+String(yearf);
    }

    if(dayt<15 && Number(montht) <3){
        formatdatet=String(montht+10)+String(yeart-1);    
    }
    else if(dayt>=15 && Number(montht) ===1){
        formatdatet="12"+String(yeart-1);   
    }
    else if(dayt<15){
        formatdatet=String(montht-2)+String(yeart);    
    }
    else if(dayt>=15 ){
        formatdatet=String(montht-1)+String(yeart);
    }
}
else{
    
    formatdatef=String(monthf)+String(yearf);  
    formatdatet=String(montht)+String(yeart);    
}  

    fetch('madadim.txt')
    .then(Response=>Response.text())
    .then(data=>{
       
    const madad=data.split(",");
    
    var x= madad.indexOf (String("-"+formatdatef));
    if(x===-1){alert('מדד לא קיים-בדוק תאריכים');return;}
    const madadf= Number(madad.slice(x+1, x+2))*-1;
    var x= madad.indexOf (String("-"+formatdatet));
    if(x===-1){alert('מדד לא קיים-בדוק תאריכים');return;}
    const madadt= Number(madad.slice(x+1, x+2))*-1;



    /*if(isNaN(x)|| x===0){alert('לא קיים מדד בגין לתאריך הנבחר');return;}
    */
   
    var schommemudad=(schom*madadt/madadf).toFixed(2);
    schommemudad=Number(schommemudad).toLocaleString();
    
    document.getElementById('frt1').textContent=dayf+"/"+monthf+"/"+yearf;
    document.getElementById('frt2').textContent=dayt+"/"+montht+"/"+yeart;

    document.getElementById('md1').textContent=formatdatef.slice(0,formatdatef.length-4)+"/"+
    formatdatef.slice(formatdatef.length-4,formatdatef.length);
    document.getElementById('md2').textContent=formatdatet.slice(0,formatdatet.length-4)+"/"+
    formatdatet.slice(formatdatet.length-4,formatdatet.length);


    document.getElementById('nm1').textContent=madadf.toFixed(2);
    document.getElementById('nm2').textContent=madadt.toFixed(2);

    document.getElementById('tozk').textContent=Number(schom).toLocaleString()+' ש"ח';
    document.getElementById('tozm').textContent=schommemudad+' ש"ח';
    document.getElementById('tables').style.display="block";
    })
    .catch(error=>console.error('Error:',error));
      
}

function chng(){
    document.getElementById('frt1').textContent="";
    document.getElementById('frt2').textContent="";
    document.getElementById('md1').textContent="";
    document.getElementById('md2').textContent="";
    document.getElementById('nm1').textContent="";
    document.getElementById('nm2').textContent="";
    document.getElementById('tozk').textContent="";
    document.getElementById('tozm').textContent="";
    document.getElementById('tables').style.display="none";
}

function yavee(e) {
            
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            jsonData=jsonData.slice(1);
            

            // המרת תאריך Excel לפורמט JavaScript Date
            const convertExcelDateToJSDate = (excelDate) => {
                return new Date((excelDate - (25567 + 2)) * 86400 * 1000); // המרה ל-epoch
                
            };

            // סינון שורות עם ערכים חסרים או NaN
            jsonData = jsonData.filter(row => {
                return row[0] !== undefined &&   row[0]!==0 && row[1] !== undefined &&   row[1]!==0  ;
            });

            // המרת כל הנתונים בתאריך לפורמט תאריך
            jsonData.forEach(row => {
                row[0] = convertExcelDateToJSDate(row[0]);
            
    });
            

            

            // מיון הנתונים לפי תאריך
            jsonData.sort((a, b) => a[0] - b[0]);

            // הצגת הנתונים בטבלה
            displayDataInTable(jsonData);

          
           
        };

        reader.readAsBinaryString(file);
    }
}

// פונקציה להצגת הנתונים בטבלה
function displayDataInTable(data) {
const table = document.createElement('table');
table.id = 'myTable';
table.className = 'tbldata';
table.style.display = 'block';
    

    const headerRow = document.createElement('tr');
    if (data.length > 0) {

        th = document.createElement('th');
        th.textContent = 'תאריך הפקדה';
        headerRow.appendChild(th);
        
        th = document.createElement('th');
        th.textContent = 'סכום';
        headerRow.appendChild(th);

        th = document.createElement('th');
        th.textContent = 'מדד בסיס';
        headerRow.appendChild(th);
                    

        th = document.createElement('th');
        th.textContent = 'סכום צמוד למדד';
        headerRow.appendChild(th);
        table.appendChild(headerRow);
                    
            
        
        
        
        

        // יצירת שורות עבור הנתונים
        data.forEach(row => { 
            let formatdate;
            const tr = document.createElement('tr');
            row.forEach((cell, index) => {
                const td = document.createElement('td');
    
                if (index === 0 && cell instanceof Date) {	
                    td.textContent = formatDate(cell);
                    tr.appendChild(td);
                
                } 
                
                else {                                
                        td.textContent = Number(cell.toFixed(2)).toLocaleString();
                        tr.appendChild(td);
                }
                
        if (index === 1){
                
        const da= row[0].getDate(); let mo=row[0].getMonth()+1;const yr=row[0].getFullYear();
        
        if(da<15 && Number(mo) <3){
            formatdate="-"+String(mo+10)+String(yr-1);    
        }
        else if(da>=15 && Number(mo) ===1){
            formatdate="-"+"12"+String(yr-1);   
        }
        else if(da<15){
            formatdate="-"+String(mo-2)+String(yr);    
        }
        else if(da>=15 ){
            formatdate="-"+String(mo-1)+String(yr);
        }
        


        


        fetch('madadim.txt')
        .then(Response=>Response.text())
        .then(data=>{
        const madad=data.split(",");



        var x= madad.indexOf (String(formatdate));
        const w= Number(madad.slice(x+1, x+2))*-1;
        const madadnow=Number(madad.slice(madad.length-1,madad.length))*-1;
                
        const td2 = document.createElement('td');
        td2.textContent = Number(w).toFixed(2);
        tr.appendChild(td2);
        const td3 = document.createElement('td');
                td3.textContent = Number(Number((row[1]*madadnow/w)).toFixed(2)).toLocaleString();
                tr.appendChild(td3);
                
                })

         }
    
                
            });				
            
            table.appendChild(tr);
        });
        
    }
    

    // הצגת הטבלה בדף
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // ניקוי התוכן הקודם
    outputDiv.appendChild(table);
    calculateColumnSum()


}

// פונקציה להמיר תאריך לפורמט dd/mm/yyyy
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function calculateColumnSum(x) {
    var table = document.getElementById('myTable'); // שולף את הטבלה
    var sum = 0; var suma = 0;
    var rows = table.getElementsByTagName('tr'); // שולף את כל השורות בטבלה
    
    // מעגלים על כל השורות, מתחילים מ-1 כדי לדלג על השורה הראשונה (כותרות)
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td'); // שולף את התאים של כל שורה
        if (cells.length > 1) { // אם השורה לא ריקה ויש לפחות שני תאים
            var value = parseFloat(cells[3].textContent); // מקבל את הערך בעמודה השנייה
            var valuea = parseFloat(cells[1].textContent);
            if (!isNaN(value)) { // אם הערך הוא מספר
                sum += value; // מוסיף את הערך לסכום
                
            }
            if (!isNaN(valuea)) { // אם הערך הוא מספר
                suma += valuea; // מוסיף את הערך לסכום
                
            }
        }
    }
    
    // מציג את הסכום באלמנט #total
    document.getElementById('toz').textContent = Number(sum.toFixed()).toLocaleString();
    document.getElementById('toza').textContent = Number(suma.toFixed()).toLocaleString();

}
