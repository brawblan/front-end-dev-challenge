# Front-end developer interview challenge

The purpose of this challenge is to build a small application that can pull data from the simple data service via a user action, plot the data on a graph and display the data in a data table.

You are provided the data service and a simple graph component.
Your job is to build in the ability to pull data from the data service via a user action, and then display the data in a data table built by you.

The data service provides three different datasets of different sizes.
Each dataset consists of two columns of data which contain the column name and an array of numeric values.

```
ChallengeDataColumn:
  name: string
  values: Array<number>

ChallengeDataSet:
  name: string
  xColumn: ChallengeDataColumn
  yColumn: ChallengeDataColumn

ChallengeDataService:
  getDataSet(which): Promise<ChallengeDataSet>
```

## Conditions of acceptance:

- Provide a way for the user to pull in any one of the three datasets (small, medium and large).
- Provide responsive UI (particularly mobile and desktop) to display the current displayed dataset.
- Build a data table to display the given data sets.
  - The data table must have a header displaying the column name
  - a skeleton lit component table (`challenge-table`) has been added as an example. You may modify it in any way or create a new table entirely.
- We have provided a charting component for you to use for this example. You'll only need to import this into your application and provide data to be graphed.
  - You won't need to modify this code. Documentation for this component can be found in `./challenge-chart/README.md`.
- You will not need to modify the ChallengeDataService code, but can augment it if necessary.
- Feel free to use any approach, framework, or tools you need to meet the acceptance criteria.

Please keep accessibility in mind while participating in this challenge.

While these are the conditions of acceptance, if they're not all met, we can still go through your solution together.
That won't automatically disqualify you. We don't expect you to spend hours on this.

However, that being said, if you do get these wrapped up quickly, feel free to add any new and interesting features you can think of that might make this application better.

## Setup

Install dependencies:

```
npm install
```

## Dev Server

To run the dev server and open the project in a new browser tab:

```
npm run serve
```

[http://localhost:8000/](http://localhost:8000/)

## Bonus Challenge

The ChallengeDataService also provides a simple streaming API:

```
ChallengeDataService:
  startStreaming(rate, callback)
  stopStreaming()
```

Where `callback` is of the form `function(x,y)` where `x` and `y` are numbers.
`callback` will be called every `rate` samples per second.

The goal here is to ensure that your application can handle dynamically generated data.
