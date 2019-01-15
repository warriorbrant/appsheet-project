const express = require('express')
const app = express()
const request = require('request');
const Promise = require('promise');

const endPoint="https://appsheettest1.azurewebsites.net/sample"
let userObjectArray=[]
let cachedYoungestUserList=[]


//validate the us phone number
function validatePhoneNumber(elementValue){
  var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return phoneNumberPattern.test(elementValue);
}

/**
  This function is fetch and generate all user endpoints from root end points
*/
function fetchAndGenerateAllUserEndpointFromRootEndPoint(url){
  let userEndPoints=[];
  return new Promise(function(resolve, reject){
    request.get(url, function(err, resp, body) {
            if (err) {
                reject(err)
            } else if(resp.statusCode==200) {
                const bodyJson=JSON.parse(body)
                // contain token node
                if(bodyJson.token){
                  userEndPoints.push(endPoint+'/list?token='+bodyJson.token)
                }
                //user node
                if(bodyJson.result){
                  bodyJson.result.forEach(userId=>userEndPoints.push(endPoint+"/detail/"+userId))
                }
                //store user object if has valid us phone number
                if(bodyJson.name&&validatePhoneNumber(bodyJson.number)){
                  userObjectArray.push(bodyJson)
                }
            } else {
                // invalid url with id 17
                console.log("Invalid url: "+url)
            }
            resolve(userEndPoints)
    })
  })

}

/**
  1.Fetch the root data from the list
  2.put the url to the stack
  3.keep fetching user data until the stack is empty
*/
let getTopFiveYoungestUser = async function(){
    let userListEndPoint = "https://appsheettest1.azurewebsites.net/sample/list"
    let userEndPoints = await fetchAndGenerateAllUserEndpointFromRootEndPoint(userListEndPoint);
    while(userEndPoints.length!=0){
      let currentUserEndPoint=userEndPoints.shift();
      await fetchAndGenerateAllUserEndpointFromRootEndPoint(currentUserEndPoint)
      .then(userEndPointUrlArray=>userEndPointUrlArray.forEach(userEndPointUrl=>userEndPoints.push(userEndPointUrl)))
      .catch(err=>console.log('error'+err))
    }
    userObjectArray = userObjectArray.sort((a,b)=>{return a.age-b.age}).slice(0,5)
    cachedYoungestUserList=userObjectArray
    return userObjectArray
}


app.get("/api/youngest", function(req,res) {
  /*
    If this is the first time queried by user, then we have to process the data,
    otherwise we return the cached data
    
    here is to solve the cold start issue and cache the processed 
    data in memory, but if the database changes, then we have to come up
    with a cache eviction strategy
  **/
  if(cachedYoungestUserList.length==0){
    getTopFiveYoungestUser()
    setTimeout(function(){res.send({cachedYoungestUserList})}, 8000);
  } else {
    res.send({cachedYoungestUserList})
  }
})

app.listen(9093, function () {
  console.log('Node app start')
})

