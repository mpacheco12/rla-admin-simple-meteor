Networks = new Mongo.Collection("networks");
Connections = new Mongo.Collection("connections");
if (Meteor.isServer) {
    Meteor.startup(function() {
        Network = {
            scanResults: false,
            listScanResults: false,
            scanning: false,
            exec: Npm.require('child_process').exec,
            scan: function() {
                    Network.scanning = true;
                    var e = Network.exec('nmcli dev wifi list', ['-s']);
                   

                    var results = '';
                    e.stdout.on('data', Meteor.bindEnvironment(function(data) {
                        var part = data.toString();
                        results += part;
                        Network.scanResults = results;
                        delete(e);
                    }));

                    e.stderr.on('data', Meteor.bindEnvironment(function(data) {
                        console.log(data);
                    }));

                    e.on('close', Meteor.bindEnvironment( function(code) {
                        var pretty = Network.list(Network.scanResults);
                        Networks.remove({})
                        Connections.remove({})
                        for(var i in pretty){
                            var network = pretty[i];
                            Networks.insert({ 
                                ssid: network['ssid'],
                                bssid:network['bssid'],
                                rssi:network['rssi'],
                                security:network['security'],
                                connected:network['connected']
                            });
                        }
                       return
                    }));
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
                var net = [];
                for (var j = 0; j < trimmedData.length; j++) {
                    var networkData = cutString(trimmedData[j]);
                    var indNetworkData = networkData.split(/\s\s+/g);
                    net.push({
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

                net.sort(function(a, b) {
                    if (a.rssi < b.rssi) {
                        return 1;
                    }
                    if (a.rssi > b.rssi) {
                        return -1;
                    }
                    return 0;
                });


                Network.listScanResults = net;
                Network.scanning = false;
                return net;
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

            c.stdout.on('data', Meteor.bindEnvironment(function(data) {
                console.log(data);
                errors = checkForErrors(data);
            }));

            c.on('close',Meteor.bindEnvironment( function(code) {
                Connections.remove({})
                if(code==0)
                    Connections.insert({
                        connected:true
                    })
                else{
                    Connections.insert({
                        connected:false
                    })
                }
              
            }));
        };

        function checkForErrors(data) {
            var result = data.split(/\n/);
            console.log(result)
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
                

                var Fiber = Npm.require('fibers');
                Fiber(function(){
                    var result = C(network, password);
                }).run();
            },

            'scan': function scan() {
                var Fiber = Npm.require('fibers');
                Fiber(function(){
                    Network.scan();
                }).run();
                return
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