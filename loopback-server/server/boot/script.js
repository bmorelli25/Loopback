//at boot, create two users. One admin, one normal

module.exports = function(app) {
    var MongoDB = app.dataSources.MongoDB; //set MongoDB as our data source
    //loopback supported operation that allows us to do something before the service is booted up
    MongoDB.automigrate('Customer', function(err){
        if (err) throw (err);
        
        var Customer = app.models.Customer;
        //takes list of customers as the first parameter
        //takes callback as second parameter        
        Customer.create([
            {username: 'Admin', email: 'admin@admin.com', password: 'pass'},
            {username: 'regUser', email: 'regUser@gmail.com', password: 'pass'}
        ], function(err, users) { //returns user (an array of the users created)
            if (err) throw (err);
            
            //Get our Role and RoleMapping setup
            var Role = app.models.Role;
            var RoleMapping = app.models.RoleMapping;
            
            //create the Admin Role
            Role.create({
                name: 'admin'
            }, function(err, role) { //return the role that was just created
                if (err) throw (err);
                
                //make Admin
                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: users[0].id //assign the first user the role of admin
                }, function(err, principal) {
                    if (err) throw (err);
                });
            });
        });
    });
};