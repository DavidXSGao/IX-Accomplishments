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

function renameImages (filename) {
	fs.readFile(filename, function(error, data) {
	    if (error) {
	        console.log(error);
	        return;
	    }

	    var obj = JSON.parse(data);
	    var profiles = obj.profiles;

	    for(var i=0;i<profiles.length;i++) {
	    	if (profiles[i].image){
	    		if (profiles[i].image.filename.includes(".jpg")){
			    	fs.rename('./public/images/' + profiles[i].image.filename, './public/images/' + profiles[i].full_name + '.jpg', function(err) {
			            if ( err ) console.log('ERROR: ' + err);
			        });
			            console.log(profiles[i].image.filename)
		    	}else if (profiles[i].image.filename.includes(".png")){
		    		fs.rename('./public/images/' + profiles[i].image.filename, './public/images/' + profiles[i].full_name + '.png', function(err) {
			            if ( err ) console.log('ERROR: ' + err);
			        });
			        console.log(profiles[i].image.filename)
		    	}
		    }
	    }
	});
}

renameImages('./src/data/users1.json');
renameImages('./src/data/users2.json');
renameImages('./src/data/users3.json');
renameImages('./src/data/users4.json');
renameImages('./src/data/users5.json');
renameImages('./src/data/users6.json');
renameImages('./src/data/users7.json');
renameImages('./src/data/users8.json');
