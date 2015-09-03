Template.networkList.helpers({
    networks: function() {
        var networks = Session.get('scanResults');
        return networks;
    }
});


// SignalStrength.helpers({
//   strength: function(a){
//     return a+'a';
//   }
// });