if (Meteor.isServer) {
    Meteor.startup(function() {
        Network = {
            scanResults: false,
            listScanResults: false,
            scanning: false,
            exec: Npm.require('child_process').exec,
            scan: function(success) {
                Network.scanning = true;
                var e = Network.exec('nmcli dev wifi list', ['-s']);
                var results = '';
                e.stdout.on('data', function(data) {
                    var part = data.toString();
                    results += part;
                    Network.scanResults = results;
                    delete(e);
                });

                e.stderr.on('data', function(data) {
                    console.log(data);
                });

                e.on('close', function(code) {
                    success(false, Network.scanResults);
                    // console.log('child process exited with code ' + code);
                });
            },
            list: function(data) {

                var incomingData = data;
                // Split string on new line and store in array
                var dataArray = incomingData.split(/\n/);

                // Remove first line of headers
                dataArray.shift();
                dataArray.pop();
                // Remove white space from beginning and end of each element in the array
                var trimmedData = [];
                for (var i = 0; i < dataArray.length; i++) {

                    trimmedI = dataArray[i].trim();
                    trimmedData.push(trimmedI);
                }
                // Get SSID by matching regex to BSSID
                var networks = [];
                for (var j = 0; j < trimmedData.length; j++) {
                    var networkData = cutString(trimmedData[j]);
                    var indNetworkData = networkData.split(/\s\s+/g);
                    networks.push({
                        ssid: getSSID(trimmedData[j]),
                        bssid: indNetworkData[1],
                        rssi: parseInt(indNetworkData[5]),
                        security: indNetworkData[6],
                        connected: indNetworkData[7],
                    });

                }

                function getSSID(string) {
                    var ssid = string.split(/..:..:/)[0].trim();
                    ssid = ssid.replace(/'/g, '');
                    return ssid;
                }

                function getBSSID(string) {
                    var bssid = string.substring(string.indexOf(/..:..:..:..:..:../), string.indexOf(/..:../) + 17);
                    return bssid;
                }

                function cutString(string) {
                    return string.substring(getSSID(string).length);
                }

                networks.sort(function(a, b) {
                    if (a.rssi < b.rssi) {
                        return 1;
                    }
                    if (a.rssi > b.rssi) {
                        return -1;
                    }
                    return 0;
                });


                Network.listScanResults = networks;
                Network.scanning = false;
                return networks;
            }
        };

        var exec = Npm.require('child_process').exec;

        var C = function connectAirport(ssid, password, callback) {
            console.log("connecting with data: ", ssid, password);
            var command = "nmcli device wifi connect " + ssid;
            if (password != '')
                command += " password " + password;
            // c = exec('echo faju6uq6 | sudo -S networksetup -setairportnetwork en0 ' + '"' + ssid + '" ' + password);
            c = exec(command);
            var result = false;
            var errors = false;

            c.stdout.on('data', function(data) {
                console.log(data);
                errors = checkForErrors(data);
            });

            c.on('close', function(code) {
                if (!errors) {
                    result = "Connected";
                }
                if (callback) {
                    callback(errors, result);
                    console.log('child process exited with code ' + code);
                } else {
                    return result;
                }
            });
        };

        function checkForErrors(data) {
            var result = data.split(/\n/);
            if (result[0].match(/Failed to join network/)) {
                errors = {
                    error: true,
                    reason: result[0]
                };
                return errors;
            } else {
                return false;
            }
        }

        var connectWrapAsync = Meteor.wrapAsync(C);

        Meteor.methods({
            'connect': function connect(data) {
                console.log("data: ", data);
                var network;
                var password;

                if (data.password) {
                    password = data.password;
                } else {
                    password = '';
                }

                network = data.ssid;

                console.log("before wrapAsync: ", network, password);
                var result = connectWrapAsync(network, password);
                return result;
            },

            'scan': function scan() {
                syncFunc = Meteor.wrapAsync(Network.scan);
                var data = syncFunc();
                var pretty = Network.list(data);
                return pretty;
            },
            'saveLoginInfo': function(myData) {
                var fs = Npm.require('fs');
                var path = process.env["PWD"];
                var outputFilename = path + '/credentials.json';
                try {
                    fs.writeFileSync(outputFilename, JSON.stringify(myData));
                    return 'ok';
                } catch (err) {
                    return 'error';
                }
            },
            'renameCamera': function(myData) {
                var fs = Npm.require('fs');
                var path = process.env["PWD"];
                var outputFilename = path + '/credentials.json';
                var json = JSON.parse(fs.readFileSync(outputFilename));
                json['name'] = myData['name'];
                try {
                    fs.writeFileSync(outputFilename, JSON.stringify(json));
                    return 'ok';
                } catch (err) {
                    return 'error';
                }
            },

        });
    });
}