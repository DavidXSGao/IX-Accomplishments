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
var users = [];

function scapeNamely (filename) {
    const namelyResponse = JSON.parse(fs.readFileSync(filename, 'utf8'));

    var profiles = namelyResponse.profiles;

    for (var i = 0; i < profiles.length; i++) {
        var newUser = {};
        newUser.firstName = profiles[i].first_name;
        newUser.lastName = profiles[i].last_name;
        newUser.fullName = profiles[i].full_name;
        newUser.fullName = newUser.fullName.replace("  ", " ");
        newUser.department = profiles[i].links.groups[0].name;
        newUser.email = profiles[i].email;
        if (profiles[i].image){
            if (profiles[i].image.filename.includes(".jpg")){
                newUser.image = profiles[i].full_name + '.jpg';
            }else if(profiles[i].image.filename.includes(".png")) {
                newUser.image = profiles[i].full_name + '.png';
            }
        } else {
            newUser.image = 'abstract-user-flat-3.png';
        }
        users.push(newUser);
    }
}

function replaceOldSeedUsers (){
    fs.unlink('./src/data/seedUsers.js', (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('./src/data/seedUsers.js does not exist');
          return;
        }

        throw err;
      }
      console.log('./src/data/seedUsers.js was deleted');
    });
    fs.writeFile('./src/data/seedUsers.js', 'const seedUsers = '+JSON.stringify(users)+';'+'module.exports = seedUsers;', (err) => {
      if (err) throw err;
      console.log('New ./src/data/seedUsers.js has been saved!');
    });
}

scapeNamely('./src/data/users1.json');
scapeNamely('./src/data/users2.json');
scapeNamely('./src/data/users3.json');
scapeNamely('./src/data/users4.json');
scapeNamely('./src/data/users5.json');
scapeNamely('./src/data/users6.json');
scapeNamely('./src/data/users7.json');
scapeNamely('./src/data/users8.json');
replaceOldSeedUsers();
