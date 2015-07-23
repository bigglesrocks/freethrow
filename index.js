#! /usr/bin/env node

// --rotate INT --tiltshift 
var userArgs = process.argv.slice(2),
	file =  userArgs[userArgs.indexOf('--image') +1] || userArgs[0],
	processedName = userArgs[userArgs.indexOf('--rename') +1] || userArgs[1],
	rotate = userArgs.indexOf('--rotate'),
	deg = 0,
	filePath,
	lwip = require('lwip'),
	fs = require('fs');

if(rotate > -1) {
	deg = parseInt(userArgs[rotate+1]);
}

if(file.indexOf('/') > -1) {
	filePath = file.replace(/[^\/]*$/, '');
}

if(!processedName || processedName.indexOf('--') > -1) {
	processName == 'dribble';
}

var newFile = filePath+processedName;

console.log('Dribbbling '+file+'...');
console.log('File: '+file);
console.log('Rotation: '+deg);
console.log('Rename: '+processedName);
console.log('FilPath: '+filePath);
console.log('New File: '+newFile);

fs.readFile(file, function(err, data) {
	fs.writeFile(newFile, data, function(err) {
		if(err) { console.log(err); return false; } else {
			console.log('Copied file "'+file+'"" to "'+processedName+'"');

			lwip.open(newFile, function(err, image){
				if(err) { console.log(err); return false; }
				else if(!image) {
					console.log("Could not open "+filePath);
				}
				else {

					image.rotate(deg, 'white', function(err, image) {

						if(err) { console.log(err); return false; }
						else {

							var factor = 1 + Math.abs(90-deg)/100;

							image.scale(factor, factor, function(err, image) {

								if(err) { console.log(err); return false; }
								else {
							 		image.crop(800, 600, function(err, image){

										if(err) { console.log(err); return false; }
										else {
											// Write file to disk
											image.writeFile(newFile, function(err) {
												if(err) { console.log(err); return false; }
												else { console.log('Finished! Wrote '+processedName+' to disk'); }
											});
										}
							 		});
								}
							});
						}
					});
				}
			});
		}
	});
});


