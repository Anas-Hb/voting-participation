const request = require('request');

module.exports = (app)=> {

  app.get('/', (req, res) =>{
    res.render('votingParticipation');
  });

  app.get('/api/election', async(req, res) => {
    // get text_region
    const options = {
      'method': 'GET',
      'url': 'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104D/ME0104T4',
      'headers': {
        'Content-Type': 'application/json'
      },
    };

    await request(options,  function (error, response) {
      if (error) throw new Error(error);

      let obj = JSON.parse(response.body);
      let regionNumberArray = obj.variables[0].values;
      let regionTextArray = obj.variables[0].valueTexts;
      data_election_district(res,regionNumberArray,regionTextArray)
    })
  })

  async function data_election_district(res,regionNumberArray,regionTextArray){
    const options = {
      'method': 'POST',
      'url': 'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104D/ME0104T4',
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {"query":[
          {"code":"Region","selection":{"filter":"all","values":["*"]}},
          {"code":"ContentsCode","selection":{"filter":"item","values":["ME0104B8"]}},
          {"code":"Tid","selection":{"filter":"all","values":["*"]}}
        ],
        "response":{"format":"json"}}
      )
    };
    await request(options,  function (error, response) {
      if (error) throw new Error(error);

      let objResponse = JSON.parse(response.body);
      let dataArray = objResponse.data;

      let arr =[];
      dataArray.forEach((item, i) => {
        let objForArr ={
          y:'',
          c:'',
          p:''
        };

        let indexTextregion = regionNumberArray.indexOf(item.key[0]);

        let city = regionTextArray[indexTextregion];
        let year = item.key[1];
        let percentage = item.values[0];

          // filter by year
        var oldObj =  arr.find(obj => obj.y === year);
        if(!oldObj){
          objForArr.y = year;
          objForArr.c = city;
          objForArr.p = percentage;
          arr.push(objForArr)
        }else{
            // filter by percentage
          if(oldObj.p < percentage){
            const index = arr.findIndex((obj) => obj.y === year);
            arr[index] = {
              y : year,
              c : city,
              p : percentage
            };
          }else if (oldObj.p === percentage) {
            const index = arr.findIndex((obj) => obj.y === year);
            moreThenCity = oldObj.c +', '+ city;
            arr[index] = {
              y : year,
              c : oldObj.c +', '+ city,
              p : percentage
            };
          }
        }
      });

      res.send(arr)
    });
  }

}
