const cheerio = require('cheerio')
const request = require('request')

const scorecardObj=require('./Scorecard')

function getAllMatchLink(uri) {
    request(uri, function (err, response, html) {
        if (err) {
            console.error(err)
        }
        else {
            extractAllLink(html)
        }   
    })
}

function extractAllLink(html) {
    let $ = cheerio.load(html)
    let uniqueLinks = new Set();
    let scoreCardArr = $('.ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent a.ds-no-tap-higlight')
    console.log(scoreCardArr.length)
    for (let i = 0; i < scoreCardArr.length; i++) {
        let link = $(scoreCardArr[i]).attr('href')
        let fullLink = "https://www.espncricinfo.com/" + link;
        uniqueLinks.add(fullLink);

    }
    uniqueLinks.forEach(link => {
        // console.log(link);
        scorecardObj.ps(link)
    });
}


module.exports={
    getAllMatch : getAllMatchLink
}