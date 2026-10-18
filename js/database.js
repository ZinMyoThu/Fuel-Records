const API_URL = "https://script.google.com/macros/s/AKfycbyHrNP4wruLsbJAGZ0ltP7q1hu5uh5jnUXHDR_gVb1dRAffooQse27DbbsQstwI_PKx/exec";

export async function saveData(data) {
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log("Save Result: ", result);
}

export async function getData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const dbRows = Array.from(data);
    const dbHeaders = dbRows[0];
    let recordItems = [];
    dbRows.forEach((row, index) => {
        if (index === 0) return;
        let itemObj = {};
        row.forEach((column, index) => {
            const key = dbHeaders[index];
            const value = column;
            itemObj[key] = value;
        });
        recordItems.push(itemObj);
    });
    return recordItems;
}


