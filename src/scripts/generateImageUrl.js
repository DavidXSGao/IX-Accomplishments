/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

var fs = require('fs');

/*
    This function reads users1.json - user8.json in src/data and creates and array of
    active users scraped from Namely's API. Each new user will have the fields: firstName,
    lastName, fullName, department and image as required by the model (src/model/users.js).

    To add a new json to be read first include the new json in src/data given the appropriate
    name based on the page number from Namely API (example of API call is in the README.md for this folder).
    Then simply call the function at the end with the path to the new json file.
*/

function removeOldImages() {
    fs.unlink('./src/data/images.txt', (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('./src/data/images.txt does not exist');
          return;
        }

        throw err;
      }
      console.log('./src/data/images.txt was deleted');
    });
}

function addAdditionalImages() {
    fs.appendFile('./src/data/images.txt', '\nhttps://openclipart.org/image/800px/svg_to_png/247319/abstract-user-flat-3.png', function (err) {
        if (err) throw err;
    });
    fs.appendFile('./src/data/images.txt', '\nhttps://image4.owler.com/logo/index-exchange_owler_20170206_200022_original.jpg', function (err) {
        if (err) throw err;
    });
    fs.appendFile('./src/data/images.txt', '\nhttps://indexexchange.namely.com/media/W1siZiIsIjIwMTcvMDgvMDQvMTIvNTMvMTUvOTQxMjUzMDItMDM2MC00NjJjLWE5MDAtNjFjY2NlYTRjYTIxLzExMjQuanBnIl1d/1124.jpg?sha=d4c184ae94a526d0', function (err) {
        if (err) throw err;
    });
}

function generateImageUrl(fileName) {
    const namelyResponse = JSON.parse(fs.readFileSync(fileName, 'utf8'));

    var profiles = namelyResponse.profiles;

    for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].image){
            fs.appendFile('./src/data/images.txt', '\nhttps://indexexchange.namely.com/files/'+profiles[i].image.id+'/image/'+profiles[i].image.filename, function (err) {
                if (err) throw err;
            });
        }
    }
}

removeOldImages();
addAdditionalImages();
generateImageUrl('./src/data/users1.json');
generateImageUrl('./src/data/users2.json');
generateImageUrl('./src/data/users3.json');
generateImageUrl('./src/data/users4.json');
generateImageUrl('./src/data/users5.json');
generateImageUrl('./src/data/users6.json');
generateImageUrl('./src/data/users7.json');
generateImageUrl('./src/data/users8.json');