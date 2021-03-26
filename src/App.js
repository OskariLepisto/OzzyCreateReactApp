import React, { useState } from 'react';
import './App.css';
import Chart from 'react-google-charts';

function App() {
  const initWeather = []; //esimerkiksi mahdollisia tulevia haun filtteröintejä varten tarvitaan state. Esim. näytetäänkö hakutuloksista vain tasatunnein mitatut
  const [weather, setWeather] = useState(initWeather);

  function convertUTCDateToLocalDate(date) {
    new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
    return date;
  }

  let chartHumData = [
    ['Aika', '%'],
    ['Please wait...', 0]
  ];
  let chartTempData = [
    ['Aika', 'Asteet'],
    ['Please wait...', 0]
  ];

  fetch('https://oppilas-14.azurewebsites.net/api/HttpTriggerCSharp2?code=B7c7OAfTjJ/n0TaX1ehieax04IbTctSaPU0yaw4gawpykrVPBTBDKg==&deviceId=360038001947393035313138&amount=10')
    .then(response => response.json())
    .then(json => setWeather([...json]));

  let humtempkey = 1;
  
  const rows = () => weather.map(temphum => { //loopataan läpi uusimmat 10kpl (amount=10) mittaustuloksia

    if(chartHumData[1][0] === 'Please wait...'){
      chartHumData.pop();
    }
    if(chartTempData[1][0] === 'Please wait...'){
      chartTempData.pop();
    }

    chartHumData.push([String(convertUTCDateToLocalDate(new Date(temphum.Timestamp))).split(' ')[4], parseInt(temphum.Hum)])
    chartTempData.push([String(convertUTCDateToLocalDate(new Date(temphum.Timestamp))).split(' ')[4], parseInt(temphum.Temp)])

    return <div key={humtempkey++}>
      <b>Klo:</b> {String(convertUTCDateToLocalDate(new Date(temphum.Timestamp))).split(' ')[4]} &nbsp;
      <b>Ilmankosteus:</b> {temphum.Hum} % &nbsp;
      <b>Lämpötila:</b> {temphum.Temp} °C 
    </div>
  }) 
  return (
    <div className="App">
      {rows()}
      <div>
        <Chart
          width={1000}
          height={300}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={chartHumData}
          options={{
            title: 'Ilmankosteus:',
            hAxis: {
              minValue: 0,
            }, 
          }}
        />
        </div>
        <div>
        <Chart
          width={1000}
          height={300}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartTempData}
          options={{
            title: 'Lämpötila:',
            vAxis: { minValue: 0 },
          }}
        />
      </div>
    </div>
  );
}
export default App;
