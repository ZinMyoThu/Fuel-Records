import { saveData, getData } from '/js/database.js';

const newData = {
    submitted_at: new Date(),
    date: "2026-07-11",
    sequence: "တတိယအကြိမ်",
    fillingType: "Full",
    fuelType: "95 Ron",
    odometer: 437804,
    price: 3250,
    fuelVolume: 15.38,
    cost: 50000,
    station: "Denko",
    notes: "Sample record 1"
};

await saveData(newData);

const recordsTableData = await getData();
console.log(recordsTableData)

