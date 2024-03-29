class ChallengeDataColumn {
  constructor(name, values) {
    this._name = name;
    this._values = values;
  }

  get name() {
    return this._name;
  }

  get values() {
    return this._values;
  }
}

class ChallengeDataSet {
  constructor(name, xColumn, yColumn) {
    this._name = name;
    this._xColumn = xColumn;
    this._yColumn = yColumn;
  }

  get name() {
    return this._name;
  }

  get xColumn() {
    return this._xColumn;
  }

  get yColumn() {
    return this._yColumn;
  }
}

const delay = async (ms) => {
  return new Promise((accept) => {
    setTimeout(accept, ms);
  });
};

export class ChallengeDataService {
  constructor() {
    this._streamTimeout = 0;
  }

  /*
   * Fetch a dataset.
   * This function is intended to simulate an asynchronous operation and provide
   * the caller with the requested dataset.
   * @param {string} which dataset to retrieve: 'small', 'medium', 'large'
   *
   * @returns Promise<ChallengeDataSet>
   */
  async getDataSet(which) {
    let count = 0;

    if (which === "small") {
      count = 10;
    } else if (which === "medium") {
      count = 100;
    } else if (which === "large") {
      count = 1000;
    } else {
      throw new Error("Invalid argument passed to getDataSet");
    }

    let x = 0;
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < count; ++i) {
      xValues.push(x);
      yValues.push(Math.sin(x));
      x += (2 * Math.PI) / count;
    }

    const xColumn = new ChallengeDataColumn("x", xValues);
    const yColumn = new ChallengeDataColumn("y", yValues);

    // simulate this taking time
    await delay(Math.random() * 500);

    return new ChallengeDataSet(`DataSet-${which}`, xColumn, yColumn);
  }

  formatDataSet(data) {
    const { name, xColumn, yColumn } = data;

    if (xColumn.values.length !== yColumn.values.length) {
      throw new Error("Arrays must be the same length.");
    }

    let chartCoordinatesData = [];
    let tableCoordinatesData = {
      name: "",
      coords: [],
    };

    for (let i in xColumn.values) {
      const coordinates = {
        x: xColumn.values[i],
        y: yColumn.values[i],
      };

      chartCoordinatesData.push(coordinates);
      tableCoordinatesData.coords.push([xColumn.values[i], yColumn.values[i]]);
    }

    tableCoordinatesData.name = name;

    return {
      chartCoordinatesData,
      tableCoordinatesData,
    };
  }

  /* Streaming API
   *
   * Start streaming x,y pairs
   *
   * @param {number} samples per second
   * @param {function} callback function(x,y) where x,y are numbers
   *
   */
  startStreaming(rate, callback) {
    const delayMS = 1000 / rate;
    const deltaX = (2 * Math.PI) / 100;
    let x = 0;

    const getNextSample = () => {
      const y = Math.sin(x);

      callback(x, y);
      x += deltaX;

      this._streamTimeout = setTimeout(getNextSample, delayMS);
    };

    this.stopStreaming();

    this._streamTimeout = setTimeout(getNextSample, 1000);
  }

  /*
   * Stop streaming
   */
  stopStreaming() {
    if (this._streamTimeout) {
      clearTimeout(this._streamTimeout);
      this._streamTimeout = 0;
    }
  }
}
