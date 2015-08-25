// js/services/todos.js
angular.module('demoServices', [])
        .factory('UserData', function($https, $window){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            addUser : function(userName,userEmail){
                var baseUrl = $window.sessionStorage.baseurl;
                return $https.post(baseUrl+'/api/users/', {name:userName, email: userEmail});
            }
        }
    })
    .factory('TaskData', function($https, $window){
        return{
            getUsers : function(){
                var baseUrl = $window.sessionStorage.baseurl;
                return $https.get(baseUrl+'/api/users');
            },
            createTask : function(taskName, tdescription, userId, userName, tdeadline){
                var baseUrl = $window.sessionStorage.baseurl;
                return $https.post(baseUrl+'/api/tasks/', {name:taskName, description:tdescription, assignedUser: userId, assignedUserName: userName, deadline: tdeadline});
            },
            updateUser : function(id, udata){
                var baseUrl = $window.sessionStorage.baseurl;
                return $https.put(baseUrl+'/api/users/'+id, udata);
            },
            editTask : function(id,task){
                var baseUrl = $window.sessionStorage.baseurl;
                return $https.put(baseUrl+'/api/tasks/'+id, task);
            }
        }
    })
    .factory('Users', function($https, $window){
        var baseUrl = $window.sessionStorage.baseurl;
        var userid;
        return{
            get : function(){
                return $https.get(baseUrl+'/api/users?select={"name":1}');
            },
            delete : function(id){
                return $https.delete(baseUrl+'/api/users/'+id);
            },
            setId : function(id){
                userid = id;
            },
            getId : function(){
                return userid;
            },
            getById : function(id){
                return $https.get(baseUrl+'/api/users/'+id);
            },
            getTasks : function(id){
                return $https.get(baseUrl+'/api/tasks?where={"assignedUser":"'+id+'"}');
            },
            completeTask : function(id, tdata){
                return $https.put(baseUrl+'/api/tasks/'+id, tdata);
            },

        }
    })
    .factory('Tasks', function($https, $window){
        var baseUrl = $window.sessionStorage.baseurl;
        var taskid;
        return{
            get : function(){
                return $https.get(baseUrl+'/api/tasks?select={"name":1}');
            },
            delete : function(id){
                return $https.delete(baseUrl+'/api/tasks/'+id);
            },
            setId : function(id){
                taskid = id;
            },
            getId : function(){
                return taskid;
            },
            getById : function(id){
                return $https.get(baseUrl+'/api/tasks/'+id);
            },
            completeTask : function(id, tdata){
                return $https.put(baseUrl+'/api/tasks/'+id, tdata);
            },
            getFiltered : function(sortBy, sortOrder, isCompleted, skipCounter){
                if(isCompleted === "2"){
                    return $https.get(baseUrl+'/api/tasks?limit=10&sort={"'+sortBy+'":'+ sortOrder + '}&skip='+skipCounter);
                }
                else{
                    return $https.get(baseUrl+'/api/tasks?sort={"'+sortBy+'":'+ sortOrder + '}&where={"completed":'+isCompleted+'}&select={"name":1, "assignedUserName":1}&limit=10&skip='+skipCounter);
                }
            }
        }
    })
    .factory('Llamas', function($https, $window) {      
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $https.get(baseUrl+'/api/llamas');
            }
        }
    })
    ;
