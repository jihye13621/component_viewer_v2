const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const FILES_FOLDER = path.join(__dirname, 'files');
const GIF_FOLDER = path.join(FILES_FOLDER, 'gif');
const JSON_FOLDER = path.join(FILES_FOLDER, 'json');

app.use(express.static(__dirname));

app.get('/files', (req, res) => {
  fs.readdir(GIF_FOLDER, (err, gifFiles) => {
    if (err) return res.status(500).send('Error reading gif folder');
    
    const gifNames = gifFiles
      .filter(f => f.endsWith('.gif'))
      .map(f => path.basename(f, '.gif'));

    fs.readdir(JSON_FOLDER, (err, jsonFiles) => {
      if (err) return res.status(500).send('Error reading json folder');
      
      const jsonNames = jsonFiles
        .filter(f => f.endsWith('.json'))
        .map(f => path.basename(f, '.json'));

      const files = gifNames.map(gifName => {
        let jsonName = jsonNames.find(name => name === gifName);
        
        if (!jsonName) {
          jsonName = jsonNames.find(name => name.includes(gifName) || gifName.includes(name));
        }

        return {
          gif: gifName,
          json: jsonName || null
        };
      });

      res.json(files);
    });
  });
});

app.listen(3000, () => console.log('Running at http://localhost:3000'));
