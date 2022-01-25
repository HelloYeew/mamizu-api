const fs = require("fs");
const dataApiRoutes = (app, fs) => {
    const defaultDataFolderPath = './data/';

    // Read operation
    const readFile = (
        callback,
        returnJson = false,
        filePath,
        encoding = 'utf8'
    ) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }
            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (
        fileData,
        callback,
        filePath,
        encoding = 'utf8'
    ) => {
        fs.writeFile(filePath, fileData, encoding, err => {
            if (err) {
                throw err;
            }
            callback();
        });
    };

    app.get('/:filename', (req, res) => {
        readFile(data => {
            res.send(data);
        }, true, defaultDataFolderPath + req.params['filename'] + '.json');
    });

    // TODO: Continue implementing the rest of the CRUD operations
    app.post('/:filename', (req, res) => {
        readFile(data => {
            // Just a random ID from date
            // TODO: Replace with a real ID
            // TODO: Add a check to see if the ID already exists
            // TODO: Make log more verbose
            const newDataId = Date.now().toString();

            if (fs.existsSync("./data/" + req.params['filename'] + ".json")) {
                console.log(`data filename:${req.params['filename']} updated`);
            } else {
                console.log(`data filename:${req.params['filename']} not found, create a new one...`);
                // Create database file
                fs.writeFile('./data/novel.json', '{}', (err) => {
                    if (err) throw err;
                    console.log('Database file created');
                });
            }

            // Add a new data
            data[newDataId] = req.body;

            // TODO: Make response more meaningful
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new data added');
            });
        }, true, defaultDataFolderPath + req.params['filename'] + '.json');
    });

    app.put('/:filename/:id', (req, res) => {
        readFile(data => {
            // Fetch data
            const dataId = req.params['id'];
            data[dataId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`data filename:${req.params['filename']} id:${dataId} updated`);
            });
        }, true, defaultDataFolderPath + req.params['filename'] + '.json');
    });
};

module.exports = dataApiRoutes;