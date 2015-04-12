// js/services/todos.js
angular.module('demoServices', [])
        .factory('UserData', function($http, $window){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            addUser : function(userName,userEmail){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl+'/api/users/', {name:userName, email: userEmail});
            }
        }
    })
    .factory('TaskData', function($http, $window){
        return{
            getUsers : function(){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/users');
            },
            createTask : function(taskName, tdescription, userId, userName, tdeadline){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl+'/api/tasks/', {name:taskName, description:tdescription, assignedUser: userId, assignedUserName: userName, deadline: tdeadline});
            },
            updateUser : function(id, udata){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.put(baseUrl+'/api/users/'+id, udata);
            },
            editTask : function(id,task){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.put(baseUrl+'/api/tasks/'+id, task);
            }
        }
    })
    .factory('Users', function($http, $window){
        var baseUrl = $window.sessionStorage.baseurl;
        var userid;
        return{
            get : function(){
                return $http.get(baseUrl+'/api/users?select={"name":1}');
            },
            delete : function(id){
                return $http.delete(baseUrl+'/api/users/'+id);
            },
            setId : function(id){
                userid = id;
            },
            getId : function(){
                return userid;
            },
            getById : function(id){
                return $http.get(baseUrl+'/api/users/'+id);
            },
            getPendingTasks : function(){
                return $http.get(baseUrl+'/api/tasks?where={"assignedUser":"'+userid+'"}&where={"completed":false}');
            },
            completeTask : function(id, tdata){
                return $http.put(baseUrl+'/api/tasks/'+id, tdata);
            },
            showCompletedTasks : function(){
                return $http.get(baseUrl+'/api/tasks?where={"assignedUser":"'+userid+'"}&where={"completed":true}');
            }
        }
    })
    .factory('Tasks', function($http, $window){
        var baseUrl = $window.sessionStorage.baseurl;
        var taskid;
        return{
            get : function(){
                return $http.get(baseUrl+'/api/tasks?select={"name":1}');
            },
            delete : function(id){
                return $http.delete(baseUrl+'/api/tasks/'+id);
            },
            setId : function(id){
                taskid = id;
            },
            getId : function(){
                return taskid;
            },
            getById : function(id){
                return $http.get(baseUrl+'/api/tasks/'+id);
            },
            completeTask : function(id, tdata){
                return $http.put(baseUrl+'/api/tasks/'+id, tdata);
            },
            getFiltered : function(sortBy, sortOrder, isCompleted, skipCounter){
                if(isCompleted === "2"){
                    return $http.get(baseUrl+'/api/tasks?limit=10&sort={"'+sortBy+'":'+ sortOrder + '}&skip='+skipCounter);
                }
                else{
                    return $http.get(baseUrl+'/api/tasks?sort={"'+sortBy+'":'+ sortOrder + '}&where={"completed":'+isCompleted+'}&select={"name":1, "assignedUserName":1}&limit=10&skip='+skipCounter);
                }
            }
        }
    })
    .factory('Llamas', function($http, $window) {      
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/llamas');
            }
        }
    })
    ;
