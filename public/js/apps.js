/**
 * Created by user on 23/10/2016.
 */
var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json'
});


myapp.controller('gethistory',function($scope,$http){
    var url=window.location.href;
    var userName=(url.substr(53)).replace("%20"," ");
    console.log("It is angular get profile !!!!!!!!!!!"+userName);
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }
    // // var req = $http.get('http://127.0.0.1:8081/getData');
    $http.get('http://127.0.0.1:5000/getHistoryData?keywords='+userName).then(function(d)
        {
            // console.log("document is ok"+document);
            console.log("val "+JSON.stringify({d: d}));

            var document=[];
            for (i=0;i<d.data.length;i++)
            {
                // console.log("it is "+d.data[i].classID);
                // console.log("it is "+d.data[i].major);
                document.push(new Array(d.data[i].username+'!!!'+d.data[i].destination+'@@@'+d.data[i].from+'###'+d.data[i].to));
            }

            $scope.fullDocument =[];
            for(var x=0;x<document.length;x++) {
                var val= document[x];
                console.log('Data is '+document[x]);
                $scope.fullDocument.push(val.toString());
            }

        },function(err)
        {
            console.log(err);
        }
    )


    $scope.deletedoc = function() {
        var url=window.location.href;
        var userName=(url.substr(53)).replace("%20"," ");
        console.log("It is angular get profile !!!!!!!!!!!"+userName);
        $http.get('http://127.0.0.1:5000/deleteData?keywords='+userName).success(function(d)
            {
                console.log("Deleted");
                // $window.location.href = 'profile.html?'+'userName';
            },function(err)
            {
                console.log(err);
            }
        )
    };


});


myapp.controller('getprofile',function($scope,$http){
    var url=window.location.href;
    var userName=(url.substr(53)).replace("%20"," ");
    console.log("It is angular get profile !!!!!!!!!!!"+userName);
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }
    // // var req = $http.get('http://127.0.0.1:8081/getData');
    $http.get('http://127.0.0.1:5000/getData?keywords='+userName).then(function(d)
        {
            console.log("document is ok"+document);
            console.log("val "+JSON.stringify({d: d}));
            console.log("Before "+$scope.zzzname);
            $scope.zzzname= d.data[0].firstname;
            $scope.lname= d.data[0].lastname;
            $scope.uname= d.data[0].username;
            $scope.phone= d.data[0].mobile;
            console.log("After "+d.data[0].phone);
            // $window.location.href = 'profile.html';
        },function(err)
        {
            console.log(err);
        }
    )

    $scope.updatedoc = function() {
        var url=window.location.href;
        var userName=(url.substr(53)).replace("%20"," ");
        console.log("It is angular get profile !!!!!!!!!!!"+userName);
        $http.get('http://127.0.0.1:5000/updateData?keywords='+userName+'@@@'+$scope.phone).success(function(d)
            {
                console.log("Updated");
                // $window.location.href = 'profile.html?'+'userName';
            },function(err)
            {
                console.log(err);
            }
        )
    };

});


myapp.controller('indexctrl', function($scope, $http,$window) {


    $scope.getSearchResult = function() {
        $http.get('http://127.0.0.1:5000/kg?query='+$scope.searchDestination).success(function (data) {
            try {
                console.log(data);
                $scope.searchDescription = data.itemListElement[0].result.detailedDescription.articleBody;
                $scope.description = "Description:";
                $scope.wiki = data.itemListElement[0].result.detailedDescription.url;
                $scope.wikiheading = "Explore " + $scope.searchDestination + " wiki in the following link";
                $scope.searchimage = data.itemListElement[0].result.image.contentUrl;
            }
            catch (err) {
                // document.getElementById("errormsg").innerHTML = "Please Correct your search item";
            }
        })

        var url=window.location.href;
        var userName=(url.substr(50)).replace("%20"," ");
        console.log("It is angular nsert history profile !!!!!!!!!!!"+userName);

        var dataParams = {
            'username' : userName,
            'destination' : $scope.searchDestination,
            'from' : $scope.from,
            'to' : $scope.to,
            'interest' : $scope.interest
        };
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        var req = $http.post('http://127.0.0.1:5000/insdata',dataParams);
        req.success(function(data, status, headers, config) {
            $scope.message = data;
            console.log("here "+data);
            // $window.location.href = 'getData.html';
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }
})

myapp.controller('MongoRestController',function($scope,$http,$window){

    $scope.focusfn = function () {
        $scope.focus = true;
        $scope.alreadyExists="";
    };

    $scope.blurfn = function () {
        $scope.focus = false;

        $http.get('http://127.0.0.1:5000/getData?keywords='+$scope.uname).then(function(d)
            {
                console.log("Len is already present"+d.data.length);
                console.log("val already present"+JSON.stringify({d: d}));
                if(d.data.length!=0) {
                    console.log("it is already present" + d.data[0].username);
                    $scope.alreadyExists="User Name Already Exists";
                }
                else
                {
                    $scope.alreadyExists="";
                }
            },function(err)
            {
                console.log(err);
            }
        )

    };
    $scope.insertData = function(){
        // console.log($scope.formData.lname);
        console.log($scope.fname);


        // $scope.formData.confirmpassword= "tst";
        var dataParams = {
            'firstname' : $scope.fname,
            'lastname' : $scope.lname,
            'username' : $scope.uname,
            'password' : $scope.password,
            'confirmpassword' : $scope.confirmpassword,
            'mobile' : $scope.mobile
        };
        x=true;
        if (!($scope.fname)  || !($scope.uname) || !($scope.password) || !($scope.confirmpassword) || !($scope.mobile))
        {
            $scope.finalErr = '              Mandatory columns should be entered';
            x=false;
            console.log("In mandatory error");
        }
        var alpha= new RegExp('.*\\d.*');
        if ((alpha.test($scope.fname)) && ($scope.fname)) { // not email
            $scope.finalErr = '              Numbers are not allowed in First Name';
            x=false;
        }
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!(re.test($scope.uname)) && ($scope.uname)) {
            $scope.finalErr = '                  Please enter correct Email Address';
            x=false;
        }
        if (!($scope.confirmpassword==$scope.password)) {
            $scope.finalErr = '                  Passwords should be same';
            x=false;
        }
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        if(x==true) {
            $http.get('http://127.0.0.1:5000/getData?keywords='+$scope.uname).then(function(d)
                {
                    console.log("Len is "+d.data.length);
                    console.log("val "+JSON.stringify({d: d}));
                    if(d.data.length!=0) {
                        console.log("it is " + d.data[0].username);
                        var eamilAdd = d.data[0].username;
                        if (eamilAdd != "")
                        {
                            $scope.finalErr = '                         User Name Already Exists';
                            console.log("User Name Already Exists");
                        }
                    }
                    else
                    {
                        var req = $http.post('http://127.0.0.1:5000/enroll', dataParams);
                        req.success(function (data, status, headers, config) {
                            $scope.message = data;
                            console.log("here " + data);
                            $scope.finalMsg = "Registration Successful";
                            $window.location.href = 'index.html';
                        });
                        req.error(function (data, status, headers, config) {
                            // alert( "failure message: " + JSON.stringify({data: data}));
                            console.log("failure message: " + JSON.stringify({data: data}));
                        });
                    }
                },function(err)
                {
                    console.log(err);
                }
            )
        }
    };
});
myapp.controller('getController',function($scope,$http,$window){
    $scope.getDbData = function(){
        console.log($scope.uname);
        // $localStorage.unameStorage = $scope.uname;
        // console.log("uname local storage is ",$localStorage.unameStorage);
        $scope.finalErr = "";

        x=true;
        if (!($scope.uname) || !($scope.password) )
        {
            $scope.finalErr = '              Mandatory columns should be entered';
            x=false;
            console.log("In mandatory error");
        }

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        // var req = $http.get('http://127.0.0.1:8081/getData');

        if(x==true) {
            $http.get('http://127.0.0.1:5000/getData?keywords=' + $scope.uname).then(function (d) {
                    console.log(typeof(d));
                    console.log("length is " + d.data.length);
                    if (d.data.length != 0) {
                        var document = [];
                        for (i = 0; i < d.data.length; i++) {
                            if (d.data[i].password == $scope.password) {
                                console.log("matched");
                                localStorage.setItem("userid123",d.data[i].username);
                                $window.location.href = 'home.html?'+d.data[i].username;
                            }
                            else {
                                $scope.finalErr = "            Please enter valid user name and password";
                                console.log("Not matched");
                            }
                            document.push(new Array(d.data[i].username + '-' + d.data[i].password));
                        }
                        console.log("document is " + document);
                    }
                    else {
                        $scope.finalErr = "                       Username is not available";
                        console.log("Username is not available");
                    }
                }, function (err) {
                    console.log(err);
                }
            )
        }
    };
});