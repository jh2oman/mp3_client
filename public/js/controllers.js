var demoControllers=angular.module("demoControllers",[]);demoControllers.controller("AddUserController",["$scope","UserData","$window",function($scope,UserData,$window){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com",$scope.name="",$scope.email="",$scope.displayText="",$scope.nameError=!1,$scope.emailError=!1,$scope.addUser=function(){0===$scope.name.length||0===$scope.email.length?($scope.displayText="Missing Required Field",0===$scope.name.length&&($scope.nameError=!0),0===$scope.email.length&&($scope.emailError=!0)):$scope.email.indexOf("@")<1?($scope.emailError=!0,$scope.displayText="Invalid Email Address"):($scope.nameError=!1,$scope.emailError=!1,UserData.addUser($scope.name,$scope.email).success(function(data){$scope.displayText=data.message}).error(function(data){$scope.displayText=data.message}))}}]),demoControllers.controller("UsersController",["$scope","Users","$http","$window","$location",function($scope,Users,$http,$window,$location){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com",$scope.baseurl=$window.sessionStorage.baseurl,Users.get().success(function(data){$scope.users=data.data}),$scope.deleteUser=function(id){Users["delete"](id).success(function(data){Users.get().success(function(data){$scope.users=data.data})})},$scope.getDetails=function(id){Users.setId(id),$location.path("userdetails")}}]),demoControllers.controller("UserDetailsController",["$scope","Users","Tasks","$http","$window","$location",function($scope,Users,Tasks,$http,$window,$location){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com";var userid=Users.getId();$scope.displayText="User details",$scope.showCompleted=!1,Users.getById(userid).success(function(data){$scope.users=data.data}),Users.getTasks(userid).success(function(data){$scope.userTasks=data.data,$scope.tasksDisplay=data.data}),$scope.completedTask=function(id,taskData){taskData.completed=!0,Users.completeTask(id,taskData).success(function(){Users.getTasks(userid).success(function(data){$scope.userTasks=data.data})}).error(function(data){$scope.displayText=data.message})},$scope.showCompleted=function(){$scope.tasksDisplay=$scope.userTasks.filter(function(arg){return arg.completed===!0})},$scope.showPending=function(){$scope.tasksDisplay=$scope.userTasks.filter(function(arg){return arg.completed===!1})},$scope.getDetails=function(id){Tasks.setId(id),$location.path("taskdetails")}}]),demoControllers.controller("TasksController",["$scope","Tasks","$http","$window","$location",function($scope,Tasks,$http,$window,$location){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com",$scope.sortBy="none",$scope.sortOrder=1,$scope.isCompleted="2",$scope.displayText="Tasks",$scope.skipCounter=0,Tasks.getFiltered($scope.sortBy,$scope.sortOrder,$scope.isCompleted,$scope.skipCounter).success(function(data){$scope.tasks=data.data}).error(function(data){$scope.displayText=data.message}),$scope.deleteTask=function(id){Tasks["delete"](id).success(function(data){Tasks.getFiltered($scope.sortBy,$scope.sortOrder,$scope.isCompleted,$scope.skipCounter).success(function(data){$scope.tasks=data.data}).error(function(data){$scope.displayText=data.message})})},$scope.getDetails=function(id){Tasks.setId(id),$location.path("taskdetails")},$scope.showNext=function(){$scope.skipCounter=$scope.skipCounter+10,Tasks.getFiltered($scope.sortBy,$scope.sortOrder,$scope.isCompleted,$scope.skipCounter).success(function(data){data.data.length>0?$scope.tasks=data.data:($scope.skipCounter=$scope.skipCounter-10,alert("There are no more Tasks to be displayed"))}).error(function(data){$scope.displayText=data.message})},$scope.showPrev=function(){$scope.skipCounter>0&&($scope.skipCounter=$scope.skipCounter-10,Tasks.getFiltered($scope.sortBy,$scope.sortOrder,$scope.isCompleted,$scope.skipCounter).success(function(data){$scope.tasks=data.data}).error(function(data){$scope.displayText=data.message}))},$scope.$watch("sortBy",function(){Tasks.getFiltered($scope.sortBy,$scope.sortOrder,$scope.isCompleted,$scope.skipCounter).success(function(data){$scope.tasks=data.data}).error(function(data){$scope.displayText=data.message})}),$scope.$watch("sortOrder",function(){Tasks.getFiltered($scope.sortBy,$scope.sortOrder,$scope.isCompleted,$scope.skipCounter).success(function(data){$scope.tasks=data.data}).error(function(data){$scope.displayText=data.message})}),$scope.$watch("isCompleted",function(){Tasks.getFiltered($scope.sortBy,$scope.sortOrder,$scope.isCompleted,$scope.skipCounter).success(function(data){$scope.tasks=data.data}).error(function(data){$scope.displayText=data.message})})}]),demoControllers.controller("AddTaskController",["$scope","TaskData","$http","$window",function($scope,TaskData,$http,$window){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com",$scope.name="",$scope.description="",$scope.date="",$scope.assignedUser=void 0,$scope.displayText="",$scope.nameError=!1,$scope.dateError=!1,$scope.assignedUserName="",$scope.assignedUserId="";var wasUserDefined=!0;TaskData.getUsers().success(function(data){$scope.users=data.data}).error(function(data){$scope.displayText=data.message}),$scope.createTask=function(){0===$scope.name.length||0===$scope.date.length?($scope.displayText="Missing Required Field",0===$scope.name.length&&($scope.nameError=!0),0===$scope.date.length&&($scope.dateError=!0)):($scope.nameError=!1,$scope.dateError=!1,void 0===$scope.assignedUser&&(wasUserDefined=!1,$scope.assignedUser={_id:"",name:"",pendingTasks:[]}),"object"!=typeof $scope.assignedUser&&($scope.assignedUser=JSON.parse($scope.assignedUser)),TaskData.createTask($scope.name,$scope.description,$scope.assignedUser._id,$scope.assignedUser.name,$scope.date).success(function(data){wasUserDefined&&($scope.assignedUser.pendingTasks.push(data.data._id),TaskData.updateUser($scope.assignedUser._id,$scope.assignedUser).success(function(){$scope.displayText=data.message}).error(function(data){$scope.displayText=data.message}))}).error(function(data){$scope.displayText=data.message}))}}]),demoControllers.controller("EditTaskController",["$scope","Tasks","TaskData","Users","$http","$window",function($scope,Tasks,TaskData,Users,$http,$window){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com";var taskid=Tasks.getId();$scope.displayText=taskid,Tasks.getById(taskid).success(function(data){$scope.tasks=data.data,$scope.name=data.data.name,$scope.description=data.data.description,$scope.deadline=data.data.deadline,$scope.assignedUserName=data.data.assignedUserName}).error(function(data){$scope.displayText=data.message}),$scope.assignedUser=void 0,$scope.nameError=!1,$scope.deadlineError=!1;var wasUserDefined=!0;TaskData.getUsers().success(function(data){$scope.users=data.data}).error(function(data){$scope.displayText=data.message}),$scope.editTask=function(){if(0===$scope.name.length||0===$scope.deadline.length)$scope.displayText="Missing Required Field",0===$scope.name.length&&($scope.nameError=!0),0===$scope.deadline.length&&($scope.deadlineError=!0);else{$scope.nameError=!1,$scope.deadlineError=!1,void 0===$scope.assignedUser&&(wasUserDefined=!1,$scope.assignedUser={_id:"",name:"",pendingTasks:[]}),"object"!=typeof $scope.assignedUser&&($scope.assignedUser=JSON.parse($scope.assignedUser));var oldUserId=$scope.tasks.assignedUser;Users.getById(oldUserId).success(function(data){$scope.oldUser=data.data}),$scope.tasks.name=$scope.name,$scope.tasks.description=$scope.description,$scope.tasks.deadline=$scope.deadline,$scope.tasks.assignedUser=$scope.assignedUser._id,$scope.tasks.assignedUserName=$scope.assignedUser.name,TaskData.editTask(taskid,$scope.tasks).success(function(data){if(wasUserDefined){var index=$scope.oldUser.pendingTasks.indexOf(data.data._id);index>-1&&$scope.oldUser.pendingTasks.splice(index,1),TaskData.updateUser($scope.oldUser._id,$scope.oldUser).success(function(){$scope.displayText=data.message}).error(function(data){$scope.displayText=data.message}),$scope.assignedUser.pendingTasks.push(data.data._id),TaskData.updateUser($scope.assignedUser._id,$scope.assignedUser).success(function(){$scope.displayText=data.message}).error(function(data){$scope.displayText=data.message})}}).error(function(data){$scope.displayText=data.message})}}}]),demoControllers.controller("TaskDetailsController",["$scope","Tasks","$http","$window","$location",function($scope,Tasks,$http,$window,$location){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com";var taskid=Tasks.getId();$scope.showingCompleted=!1,$scope.displayText="Task Details",Tasks.getById(taskid).success(function(data){$scope.tasks=data.data}),$scope.completeTask=function(){$scope.tasks.completed=!0,Tasks.completeTask(taskid,$scope.tasks).success(function(data){$scope.tasks=data.data}).error(function(data){$scope.tasks.completed=!1,$scope.displayText=data.message})},$scope.goToEdit=function(){$location.path("edittask")}}]),demoControllers.controller("LlamaListController",["$scope","$http","Llamas","$window",function($scope,$http,Llamas,$window){$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com",Llamas.get().success(function(data){$scope.llamas=data})}]),demoControllers.controller("SettingsController",["$scope","$window",function($scope,$window){$scope.url="http://jwaterman-todo.herokuapp.com",$window.sessionStorage.baseurl="http://jwaterman-todo.herokuapp.com",$scope.setUrl=function(){$window.sessionStorage.baseurl=$scope.url,$scope.displayText="URL set"}}]);