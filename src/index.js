import "./components/challenge-chart/dist/challenge-chart.js";
import "./components/challenge-table.js";
import "./components/challenge-select.js";
import { ChallengeDataService } from "./services/ChallengeDataService.js";

// INITIALIZE VARIABLES AND DATA SERVICE
let fetchedData = {};
let streamingChartCoordinatesData = [];
let streamingTableCoordinatesData = {
  name: "DataSet-streaming",
  coords: [],
};
const dataService = new ChallengeDataService();

// DOM ELEMENTS
const challengeTable = document.querySelector("challenge-table");
const challengeChart = document.querySelector("challenge-chart");
const challengeSelect = document.querySelector("challenge-select");
const challengeContainer = document.querySelector(".challenge-container");

// STREAMING CALLBACK
function callback(x, y) {
  streamingChartCoordinatesData = [...streamingChartCoordinatesData, { x, y }];
  streamingTableCoordinatesData = {
    name: "DataSet-streaming",
    coords: [...streamingTableCoordinatesData.coords, [x, y]],
  };

  // pass values to custom elements
  challengeChart.data = streamingChartCoordinatesData;
  challengeTable.data = streamingTableCoordinatesData;
}

// STREAMING RESET
function handleResetStreaming() {
  streamingChartCoordinatesData = [];
  streamingTableCoordinatesData = {
    name: "DataSet-streaming",
    coords: [],
  };

  challengeChart.data = streamingChartCoordinatesData;
  challengeTable.data = streamingTableCoordinatesData;
}

// SET DATA ON INPUT
async function setData() {
  // get selected size value
  const currentDataValue = challengeSelect.value;

  if (currentDataValue === "stream") {
    // streaming handled on button clicks
    challengeChart.data = streamingChartCoordinatesData;
    challengeTable.data = streamingTableCoordinatesData;
  } else {
    // fetch data
    const data = await dataService.getDataSet(currentDataValue);
    fetchedData = dataService.formatDataSet(data);

    challengeChart.data = fetchedData.chartCoordinatesData;
    challengeTable.data = fetchedData.tableCoordinatesData;
  }
}

// ON PAGE LOAD
(async function () {
  await setData();
  challengeTable.data = fetchedData.tableCoordinatesData;
  challengeTable.dataService = dataService;
})();

// SET DOM ELEMENT EVENT FUNCTIONS
challengeSelect.oninput = () => setData();

// SET EVENT LISTENERS FOR STREAMING BUTTONS
document.addEventListener("stream-start", (e) =>
  dataService.startStreaming(e.detail.rate.value, callback)
);
document.addEventListener("stream-stop", () => dataService.stopStreaming());
document.addEventListener("stream-reset", () => handleResetStreaming());
