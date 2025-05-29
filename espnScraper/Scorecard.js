// const url ='https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'

const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx =require("xlsx")

function processScoreCard(url){
    request(url,cb);
}



function cb(err,response,html){
    if(err){
        console.error(err)
    }
    else{
        extractMatchDetails(html)
    }
}

function extractMatchDetails(html){
    let $=cheerio.load(html)

    let descString = $('div.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3')

    let descStringArr=descString.text().split(',')

    let venue = descStringArr[1].trim()
    let date = descStringArr[2].trim()

    let result = $('.ds-text-tight-s.ds-font-medium.ds-truncate.ds-text-typo').text()


    console.log("******************************************")
    console.log(venue)
    console.log(date)
    console.log(result)

    let innings = $('.ds-rounded-lg.ds-mt-2 .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-border.ds-border-line.ds-mb-4')

    let htmlString = ''
    // console.log(innings.length)

    for(let i=0;i<innings.length;i++){
        htmlString +=$(innings[i]).html()

        let teamName =$(innings[i]).find('.ds-text-title-xs.ds-font-bold.ds-capitalize').text();

        let opponentIndex =i==0?1:0

        let opponentName =$(innings[opponentIndex]).find('.ds-text-title-xs.ds-font-bold.ds-capitalize').text();

        // console.log(teamName,opponentName)

        let cInning = $(innings[i]);

        let allRows = cInning.find('.ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody tr')

        for(let j=0;j<allRows.length;j++){
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("ds-hidden");
      
            if (isWorthy == false) {
              let playerName = $(allCols[0]).text().trim();
      
              let runs = $(allCols[2]).text().trim();
              let balls = $(allCols[3]).text().trim();
              let fours = $(allCols[5]).text().trim();
              let sixes = $(allCols[6]).text().trim();
              let STR = $(allCols[7]).text().trim();

              console.log(
          `${playerName} | ${runs} |${balls} | ${fours} | ${sixes} | ${STR}`//this $ is template Literal this is not cheerio
        );

        processPlayer(
            teamName,
            opponentName,
            playerName,
            runs,
            balls,
            fours,
            sixes,
            STR,
            venue,
            date,
            result
          );
            }
            console.log("..................................")
        }
    }

    // console.log(htmlString)
}
function processPlayer(
    teamName,
    opponentName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    STR,
    venue,
    date,
    result
  ) {
        let teampath = path.join(__dirname,"IPL", teamName)
        dirCreator(teampath)


        let filePath = path.join(teampath, playerName + ".xlsx");
        let content = excelReader(filePath, playerName); 
      
        let playerObj = {
          playerName,
          teamName,
          opponentName,
          runs,
          balls,
          fours,
          sixes,
          STR,
          venue,
          date,
          result,
        };
      
        content.push(playerObj)
      
        excelWriter(filePath , playerName , content )
      }

         

  

  
  function dirCreator(folderpath){
    if(fs.existsSync(folderpath)==false){
        fs.mkdirSync(folderpath)
    }
}

function excelWriter(fileName, sheetName, jsonData) {
  if (sheetName.length > 31) {
    console.warn(`Sheet name "${sheetName}" exceeds 31 characters. It will be truncated.`);
    sheetName = sheetName.slice(0, 31); // Truncate to 31 characters
}
    let newWB = xlsx.utils.book_new();
    // Creating a new WorkBook
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    // Json is converted to sheet format (rows and cols)
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, fileName);
  }
  
  function excelReader(fileName, sheetName) {
    if (fs.existsSync(fileName) == false) {
      return [];
    }
    let wb = xlsx.readFile(fileName);
  
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans
  }

module.exports={
    ps: processScoreCard
}