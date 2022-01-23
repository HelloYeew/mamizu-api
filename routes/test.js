const testRoutes = (app, fs) => {
    // File path variable
    const dataPath = './data/test.json';

    // Read operation
    const readFile = (
        callback,
        returnJson = false,
        filePath = dataPath,
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
        filePath = dataPath,
        encoding = 'utf8'
    ) => {
        fs.writeFile(filePath, fileData, encoding, err => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    app.get('/test', (req, res) => {
        readFile(data => {
            res.send(data);
        }, true);
    });

    app.post('/test', (req, res) => {
        readFile(data => {
            // Just a random ID from date
            const newTestId = Date.now().toString();

            // Add a new test
            data[newTestId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new test added');
            });
        }, true);
    });

    app.put('/test/:id', (req, res) => {
        readFile(data => {
            // add the new test
            const testId = req.params['id'];
            data[testId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`tests id:${testId} updated`);
            });
        }, true);
    });
};

module.exports = testRoutes;