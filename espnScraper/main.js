const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require('request')
const cheerio = require('cheerio')
const fs= require('fs')
const path = require('path')

const allMatchObj=require('./allmatch')

let iplPath=path.join(__dirname,'IPL')

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath)
    }
}

dirCreator(iplPath)

request(url, cb)

function cb(err, response, html) {
    if (err) {
        console.error(err)
    }
    else {
        extractLink(html)
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);
    let anchorElem = $('.ds-border-t.ds-border-line.ds-text-center.ds-py-2 a'); // the last a is written because it is a class that we have pass and when we have to use attribute from any class write a after class name

    let link = anchorElem.attr("href");

    // console.log(link);

    let fullLink = "https://www.espncricinfo.com" + link;
    console.log(fullLink);

    allMatchObj.getAllMatch(fullLink)
}


