"use strict";

class Measurements {
  constructor(value, unit, timestamp) {
    this._value = value;
    this._unit = unit;
    this._timestamp = timestamp;
  }

  get value() {
    return this._value;
  }
  get unit() {
    return this._unit;
  }
  get time() {
    return new Date(this._timestamp * 1000).toLocaleString("nl-BE", { timeStyle: "short" });
  }
  get date() {
    return new Date(this._timestamp * 1000).toLocaleDateString("nl-BE").split('/');
  }
  get htmlString() {
    return `<tr>
    <td>${this.unit}</td><td>${this.value}</td><td>${this.date.join('/')} ${this.time}</td></tr>`;
  }
}

const app = {
  measurements: [],
  filtered: [],
  values: [],
  timestamps: [],
  filteredTime: [],
  filteredValue: [],
  selectedMeasurement: "all",

  init() {
    this.fetchData();
    this.filter();
    this.render();


  },

  renderChart(type, array) {
    setTimeout(() => {
      for (let i = 5; i < 12;) {
        i++;
        i = i.toString();
        let maandFilter = this.measurements.filter((obj) => obj.date[1] === i);
        let unit = maandFilter.filter((obj) => obj.unit === type);
        let reduced = unit.reduce((sum, obj) => {
          return sum + obj.value;
        }, 0);
        array.push(reduced);
        console.log("reduced", reduced)
      }
    }, 250);
  },

  async fetchData() {
    fetch("https://thecrew.cc/herexamen/measurements.json")
      .then((res) => res.json())
      .then((data) => data.measurements.forEach((obj) => {
        this.measurements.push(new Measurements(obj.value, obj.type, obj.timestamp));
        this.values.push(obj.value);
        this.timestamps.push(obj.timestamp);
      }))
      .then(console.log("measurements", this.measurements))
      .then(console.log("values", this.values))
      .then(console.log("timestamps", this.timestamps))

  },

  async filter() {

    if (this.selectedMeasurement == "all") {
      this.filtered = this.measurements;
    }
    else {
      this.filtered = this.measurements.filter(obj => obj.unit == this.selectedMeasurement);
    } this.render();
    console.log("filteredLength", this.filtered.length);
    this.selectedMeasurement = document.getElementById("typeFilter").value;
    this.filteredTime = this.filtered.map((obj) => obj._timestamp);
    console.log("filteredTime", this.filteredTime);
    this.filteredValue = this.filtered.map((obj) => obj._value);
    console.log("filteredValues", this.filteredValue);

    setTimeout(() => {


      switch (this.selectedMeasurement) {
        case "None":
          myChart.setDatasetVisibility(0, false); // hides dataset
          myChart.setDatasetVisibility(1, false); // hides dataset
          myChart.setDatasetVisibility(2, false); // hides dataset
          myChart.setDatasetVisibility(3, false); // hides dataset
          myChart.update();
          console.log("None")
          break;
        case "CO2":
          myChart.setDatasetVisibility(0, true); // shows dataset
          myChart.setDatasetVisibility(1, false); // hides dataset
          myChart.setDatasetVisibility(2, false); // hides dataset
          myChart.setDatasetVisibility(3, false); // hides dataset
          myChart.update();
          console.log("CO2")
          break;
        case "VOC":
          myChart.setDatasetVisibility(0, false); // hides dataset
          myChart.setDatasetVisibility(1, true); // shows dataset
          myChart.setDatasetVisibility(2, false); // hides dataset
          myChart.setDatasetVisibility(3, false); // hides dataset
          myChart.update();
          console.log("VOC")
          break;
        case "PM25":
          myChart.setDatasetVisibility(0, false); // hides dataset
          myChart.setDatasetVisibility(1, false); // hides dataset
          myChart.setDatasetVisibility(2, true); // shows dataset
          myChart.setDatasetVisibility(3, false); // hides dataset
          myChart.update();
          console.log("PM25")
          break;
        case "PM10":
          myChart.setDatasetVisibility(0, false); // hides dataset
          myChart.setDatasetVisibility(1, false); // hides dataset
          myChart.setDatasetVisibility(2, false); // hides dataset
          myChart.setDatasetVisibility(3, true); // shows dataset
          myChart.update();
          console.log("PM10")
          break;
        case "all":
          myChart.setDatasetVisibility(0, true); // shows dataset
          myChart.setDatasetVisibility(1, true); // shows dataset
          myChart.setDatasetVisibility(2, true); // shows dataset
          myChart.setDatasetVisibility(3, true); // shows dataset
          myChart.update();
          console.log("all")
          break;
      }
    }, 250);
  },

  render() {
    document.getElementById("measurements").innerHTML = ``;
    this.filtered.forEach((obj) => { document.getElementById("measurements").innerHTML += obj.htmlString });
    document.getElementById("typeFilter").onchange = () => {
      this.selectedMeasurement = document.getElementById("typeFilter").value;
      this.filter();
    }
  }
}

app.init();

const co2Values = [];
const vocValues = [];
const pm25Values = [];
const pm10Values = [];
app.renderChart("CO2", co2Values);
app.renderChart("VOC", vocValues);
app.renderChart("PM25", pm25Values);
app.renderChart("PM10", pm10Values);
console.log("co2Values", co2Values);
console.log("vocValues", vocValues);
console.log("pm25Values", pm25Values);
console.log("pm10Values", pm10Values);

/////DRAWING A CHART/////
//setup
const data = {
  labels: ['Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'December'],
  datasets: [{
    label: 'CO2',
    data: co2Values,
    backgroundColor: [
      "purple"
    ],
  },
  {
    label: 'VOC',
    data: vocValues,
    backgroundColor: [
      "white"
    ],
  },
  {
    label: 'PM25',
    data: pm25Values,
    backgroundColor: [
      "gray"
    ],
  },
  {
    label: 'PM10',
    data: [5, 4, 5, 6, 7, 8, 3],
    backgroundColor: [
      "red"
    ],
  }]
}

// config 
const config = {
  type: 'bar',
  data,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
};

const myChart = new Chart(
  document.getElementById('myChart'),
  config
);

  /////END OF DRAWING CHART/////