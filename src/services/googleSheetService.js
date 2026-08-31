
const { google } = require("googleapis");
const { auth } = require("./../../config/google");

async function syncSheet(spreadsheetId, data) {
    try {
        const sheets = google.sheets({
            version: "v4",
            auth
        });
        let values = [];
        for(let i = 0;i<data.length;i++) {
            let innerValues = [];
            for(let j = 0;j<data[i].length;j++) {
                innerValues.push(data[i][j].response);
            }
            values.push(innerValues);
        }
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: values
            }
        });

        console.log("Row added successfully!");
        console.log(
            "Updated range:",
            response.data.updates.updatedRange
        );
        return true;

    } catch (err) {
        console.error("Failed to append row:");

        if (err.response?.data) {
            console.error(
                JSON.stringify(err.response.data, null, 2)
            );
        } else {
            console.error(err);
        }
        return false;
    }

}


const clearSheet = async(spreadsheetId) => {
    try {
        const response = await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: "Sheet1"
        });
        return true;
    } catch(err) {
        console.log(err);
    }

}

const initializeSheet = async(spreadsheetId, row) => {
    console.log(row);
    try {
        const sheets = google.sheets({
            version: "v4",
            auth
        });
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [row]
            }
        });
        // ab format karengeee
        await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    repeatCell: {
                        range: {
                            sheetId: 0,
                            startRowIndex: 0,
                            endRowIndex: 1,
                            startColumnIndex: 0,
                            endColumnIndex: row.length
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: {
                                    red: 0.2,
                                    green: 0.2,
                                    blue: 0.2
                                },
                                textFormat: {
                                    bold: true,
                                    foregroundColor: {
                                        red: 1,
                                        green: 1,
                                        blue: 1
                                    }
                                },
                                horizontalAlignment: "CENTER",
                                verticalAlignment: "MIDDLE",
                                wrapStrategy: "WRAP"
                            }
                        },
                        fields: "userEnteredFormat"
                    }
                },
                {
                    updateSheetProperties: {
                        properties: {
                            sheetId: 0,
                            gridProperties: {
                                frozenRowCount: 1
                            }
                        },
                        fields: "gridProperties.frozenRowCount"
                    }
                }
            ]
        }
    });
    return true;
    } catch(err) {
        console.log(err);
        return false;
    }
};

const addAccess = async(emailAccess, spreadsheetId) => {
    try {
    const drive = google.drive({
                version: "v3",
                auth
            });
    
    await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
            type: "user",
            role: "writer",
            emailAddress: emailAccess
        },
        sendNotificationEmail: true
    });
    return true;
}catch(err) {
    console.log(err);
    return false;}
};

module.exports = {syncSheet, clearSheet, initializeSheet, addAccess};

