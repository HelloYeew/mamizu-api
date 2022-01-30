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
                logger.info('Creating file ' + filePath);
                fs.writeFile(filePath, '{}', (err) => {
                    if (err) {
                        logger.error("Error in writeFile operation " + dataApiRoutes.name + " after creating file in readFile");
                        logger.error('Filename : ' + filePath)
                        logger.error('Detail : ' + err)
                    } else {
                        logger.info('Database file created');
                    }
                });
                callback(err, null);
            }
            try {
                callback(returnJson ? JSON.parse(data) : data);
            } catch(err) {
                logger.error("Error in readFile operation " + dataApiRoutes.name);
                logger.error('Filename : ' + filePath);
                logger.error('Detail : ' + err);
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
            } else {
                // If the data has error details in it, it will try to parse it
                if (fileData.includes("errno")){
                    fs.writeFile(filePath, fileData, encoding, err => {
                        if (err) {
                            logger.error(err);
                        }
                        logger.warn("fileData contains error detail, trying to fix it");
                        logger.warn("Warning detail : " + fileData);
                        try {
                            readFile(data => {
                                delete data["errno"];
                                delete data["code"];
                                delete data["syscall"];
                                delete data["path"];
                                writeFile(JSON.stringify(data, null, 2), () => {
                                    logger.info("fileData fixed");
                                }, filePath);
                                callback();
                            }, true, filePath)
                        } catch (err) {
                            logger.warn("Fix failed, trying to write it as is");
                            logger.warn("Filename : " + filePath);
                            logger.warn("Error detail : " + err);
                        }
                    });
                } else {
                    logger.info("fileData written");
                    callback();
                }
            }
        });
    };

    app.get('/:filename', (req, res) => {
        const filePath = defaultDataFolderPath + req.params['filename'] + '.json';
        try {
            // We need to escape favicon.ico request to avoid error
            // and prevent the file creation from read operation
            if (req.params['filename'] === 'favicon.ico' || !fs.existsSync(filePath)) {
                res.status(404).send('Not found');
                logger.info("(GET) " + filePath + " not found, returning 404");
            } else {
                readFile(data => {
                    res.json(data);
                }, true, filePath);
                logger.info("(GET) Response sent from " + req.params['filename'])
            }
        } catch (error) {
            logger.error("Error in GET request")
            logger.error('Filename : ' + req.params['filename'])
            logger.error('Detail : ' + error)
            if (process.env.DEBUG) {
                res.status(500).send(error, '\n You are in debug mode, check the logs for more details');
            } else {
                res.status(500).send('Internal Server Error');
            }
        }

    });

    app.post('/:filename', (req, res) => {
        let ApiFilePath = "./data/" + req.params['filename'] + ".json"
        try {
            readFile(data => {

                let newID = Object.keys(data).length + 1;

                if (data.toString().includes("Error")) {
                    newID = 1;
                }

                if (!fs.existsSync(ApiFilePath)) {
                    logger.warn(`data filename:${req.params['filename']} not found, create a new one...`);
                }

                // Get new ID from the data file
                data[newID] = req.body;

                // TODO: Make response more meaningful
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send('new data added');
                    logger.info("(POST) Data added to " + req.params['filename'] + " with data id " + newID);
                }, ApiFilePath);
            }, true, ApiFilePath);
        } catch (e) {
            logger.error("Error in POST request")
            logger.error('Filename : ' + req.params['filename'])
            logger.error('Detail : ' + e)
            if (process.env.DEBUG) {
                res.status(500).send(e, '\n You are in debug mode, check the logs for more details');
            } else {
                res.status(500).send('Internal Server Error');
            }
        }
    });

    app.put('/:filename/:id', (req, res) => {
        let ApiFilePath = "./data/" + req.params['filename'] + ".json"
        try {
            readFile(data => {
                // Find the index of the data to be updated
                // If that data doesn't exist, return 404
                let index = Object.keys(data).findIndex(key => key === req.params['id']);
                if (index === -1) {
                    res.status(404).send('data not found');
                    logger.warn("(PUT) Data not found in " + req.params['filename'] + " with data id " + req.params['id']);
                } else {
                    // Update the data
                    data[req.params['id']] = req.body;

                    // Write the data to the file
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send('data updated');
                        logger.info("(PUT) Data updated in " + req.params['filename'] + " with data id " + req.params['id']);
                    }, ApiFilePath);
                }
            }, true, ApiFilePath);
        } catch (e) {
            logger.error("Error in PUT request")
            logger.error('Filename : ' + req.params['filename'])
            logger.error('Detail : ' + e)
            if (process.env.DEBUG) {
                res.status(500).send(e, '\n You are in debug mode, check the logs for more details');
            } else {
                res.status(500).send('Internal Server Error');
            }
        }
    });
};

module.exports = dataApiRoutes;