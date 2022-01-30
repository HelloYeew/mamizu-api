const fs = require("fs");
const logger = require('../log')

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
                logger.error("Error in readFile operation " + dataApiRoutes.name);
                logger.error('Filename : ' + filePath);
                logger.error('Detail : ' + err);
                callback(null);
            } else {
                callback(returnJson ? JSON.parse(data) : data);
            }
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
        try {
            if (req.params['filename'] === 'favicon.ico') {
                res.sendStatus(404);
            } else {
                const filePath = defaultDataFolderPath + req.params['filename'] + '.json';
                readFile(data => {
                    res.json(data);
                }, true, filePath);
                logger.info("Response sent from " + req.params['filename'])
            }
        } catch (error) {
            logger.error("Error in GET request")
            logger.error('Filename : ' + req.params['filename'])
            logger.error('Detail : ' + error)
        }

    });

    // TODO: Continue implementing the rest of the CRUD operations
    app.post('/:filename', (req, res) => {
        let ApiFilePath = "./data/" + req.params['filename'] + ".json"
        readFile(data => {
            // Just a random ID from date
            // TODO: Replace with a real ID
            // TODO: Add a check to see if the ID already exists
            // TODO: Make log more verbose
            const newDataId = Date.now().toString();

            if (fs.existsSync(ApiFilePath)) {
                console.log(`data filename:${req.params['filename']} updated`);
                logger.info(ApiFilePath)

                // Add a new data
                data[newDataId] = req.body;

                // TODO: Make response more meaningful
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send('new data added');
                    logger.info("Data added")
                }, ApiFilePath);
            } else {
                console.log(`data filename:${req.params['filename']} not found, create a new one...`);
                // Create database file
                fs.writeFile(ApiFilePath, '{}', (err) => {
                    if (err) {
                        logger.error("Error in POST request")
                        logger.error('Filename : ' + req.params['filename'])
                        logger.error('Detail : ' + err)
                    } else {
                        logger.info('Database file created');
                    }
                });
            }
        }, true, ApiFilePath);
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