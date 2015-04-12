var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('AddUserController', ['$scope', 'UserData'  , function($scope, UserData) {
  $scope.name ="";
  $scope.email = "";
  $scope.displayText="";
  $scope.nameError=false;
  $scope.emailError=false;

  $scope.addUser = function(){
    //No Name or Email 
    if($scope.name.length ===0 || $scope.email.length===0){
      $scope.displayText="Missing Required Field";
      if($scope.name.length===0)
        $scope.nameError=true;
      if($scope.email.length===0)
        $scope.emailError=true;
    }

    //Invalid Email
    else if($scope.email.indexOf('@')<1){
      $scope.emailError=true;
      $scope.displayText="Invalid Email Address";
    }
    else{
      $scope.nameError=false;
      $scope.emailError=false;
      UserData.addUser($scope.name, $scope.email).success(function(data){
        $scope.displayText=data.message;
      }).error(function(data){
        $scope.displayText=data.message;
      });
    }

  }

}]);

demoControllers.controller('UsersController', ['$scope', 'Users', '$http', '$window', '$location'  , function($scope, Users, $http, $window, $location) {
  
  $scope.baseurl= $window.sessionStorage.baseurl;

  Users.get().success(function(data){
    $scope.users = data.data;
  });

  $scope.deleteUser = function(id){
    Users.delete(id).success(function(data){
      Users.get().sucess(function(data){
        $scope.users = data.data;

      });
    });
  }

  $scope.getDetails = function(id){
    Users.setId(id);
    $location.path('userdetails');
  }

}]);
demoControllers.controller('UserDetailsController', ['$scope', 'Users', '$http', '$window', '$location'  , function($scope, Users, $http, $window, $location) {
  
  var userid=Users.getId();
  $scope.showCompleted = false;
  $scope.displayText="User details";

  Users.getById(userid).success(function(data){
    $scope.users= data.data;
  });

  Users.getPendingTasks(userid).success(function(data){
    $scope.tasks=data.data;
  });

  $scope.completedTask = function(id, taskData){
    taskData.completed = true;
    Users.completeTask(id, taskData).success(function(){
      Users.getPendingTasks(userid).success(function(data){
        $scope.tasks=data.data;
      });
      Users.showCompletedTasks().success(function(data){
        $scope.completeTasks=data.data;
      }).error(function(data){
        $scope.displayText=data.message;
      });
    }).error(function(data){
      $scope.displayText=data.message;
    });
  };
   $scope.showCompleted = function(){
        $scope.showCompleted = true;
        Users.showCompletedTasks().success(function(data){
            $scope.completedTasks = data.data;
        }).error(function(data){
            $scope.displayText = data.message;
        });
    }

}]);

demoControllers.controller('TasksController', ['$scope', 'Tasks', '$http', '$window', '$location'  , function($scope, Tasks, $http, $window, $location) {
  
  $scope.sortBy = "none";
  $scope.sortOrder=1;
  $scope.iscompleted=0;
  $scope.displayText="Tasks";
  $scope.skipCounter = 0;

  Tasks.get().success(function(data){
    $scope.tasks=data.data;
  });

  $scope.deleteTask = function(id){
    Tasks.delete(id).success(function(data){
      Tasks.get().success(function(data){
        $scope.tasks=data.data;
      });
    });
  };
  $scope.getDetails = function(id){
    Tasks.setId(id);
    $location.path('taskdetails');
  }

  $scope.showNext = function(){
    $scope.skipCounter = $scope.skipCounter + 10;
    Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
        $scope.tasks = data.data;
        }).error(function(data){
          $scope.displayText = data.message;
    });
  };

  $scope.showPrev = function(){
    if($scope.skipCounter>0){
    $scope.skipCounter = $scope.skipCounter - 10;
    Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
        $scope.tasks = data.data;
        }).error(function(data){
          $scope.displayText = data.message;
    });
    }
  };

  $scope.$watch('sortBy', function(){
      
      Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
          $scope.tasks = data.data;
      }).error(function(data){
          $scope.displayText = data.message;
      });
  });

  $scope.$watch('sortOrder', function(){
      
      Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
          $scope.tasks = data.data;
      }).error(function(data){
          $scope.displayText = data.message;
      });
  });

  $scope.$watch('isCompleted', function(){
      Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
          $scope.tasks = data.data;
      }).error(function(data){
          $scope.displayText = data.message;
      });
  });


}]);

demoControllers.controller('AddTaskController', ['$scope', 'TaskData'  , '$http', '$window', function($scope, TaskData, $http, $window) {
    $scope.name = "";
    $scope.description = "";
    $scope.date = "";
    $scope.assignedUser = undefined;
    $scope.displayText = "";
    $scope.nameError = false;
    $scope.dateError = false;
    $scope.assignedUserName = "";
    $scope.assignedUserId= "";
    var wasUserDefined = true;

    TaskData.getUsers().success(function(data){
        $scope.users = data.data;
    }).error(function(data){
        $scope.displayText = data.message;
    });

    $scope.createTask = function(){
        
        if($scope.name.length ===0 || $scope.date.length===0){
          $scope.displayText="Missing Required Field";
          if($scope.name.length===0)
            $scope.nameError=true;
          if($scope.date.length===0)
            $scope.dateError=true;
        }
        else{
            //$scope.displayText = "made it";
            $scope.nameError = false;
            $scope.dateError = false;
            if($scope.assignedUser === undefined){
                wasUserDefined = false;
                $scope.assignedUser = {"_id": "", "name": "", "pendingTasks": []};
            }
            //$scope.displayText = "made it";
            if(typeof $scope.assignedUser !=='object')
            $scope.assignedUser = JSON.parse($scope.assignedUser);
            TaskData.createTask($scope.name, $scope.description, $scope.assignedUser._id, $scope.assignedUser.name, $scope.date).success(function(data){
    
                 if (wasUserDefined){
                     $scope.assignedUser.pendingTasks.append(data.data._id);
                     TaskData.updateUser($scope.assignedUser._id, $scope.assignedUser).success(function(){
                      $scope.displayText = data.message;
                     }).error(function(data){
                         $scope.displayText = data.message;
                     });
                 }
            }).error(function(data){
                $scope.displayText = data.message;
            });
        }
    };

}]);

demoControllers.controller('EditTaskController', ['$scope' , 'Tasks', 'TaskData', '$http', '$window' , function($scope, Tasks, TaskData, $http, $window) {
    var taskid = Tasks.getId();
    $scope.displayText = taskid;


    Tasks.getById(taskid).success(function(data){
        $scope.tasks = data.data;
        $scope.name = data.data.name;
        $scope.description = data.data.description;
        $scope.deadline = data.data.deadline;
        $scope.assignedUserName = data.data.assignedUserName;
    }).error(function(data){
        $scope.displayText = data.message;
    });



    $scope.assignedUser = undefined;
    $scope.nameError = false;
    $scope.deadlineError = false;
    var wasUserDefined = true;

    TaskData.getUsers().success(function(data){
        $scope.users = data.data;
    }).error(function(data){
        $scope.displayText = data.message;
    });


    $scope.createTask = function(){
        if($scope.name.length ===0 || $scope.date.length===0){
          $scope.displayText="Missing Required Field";
          if($scope.name.length===0)
            $scope.nameError=true;
          if($scope.date.length===0)
            $scope.dateError=true;
        }
        else{
            
            $scope.nameError = false;
            $scope.deadlineError = false;
            if($scope.assignedUser === undefined){
                wasUserDefined = false;
                $scope.assignedUser = {"_id": "", "name": "", "pendingTasks": []};
                //$scope.assignedUser = JSON.parse($scope.assignedUser);
            }
            if(typeof $scope.assignedUser !=='object')
            $scope.assignedUser = JSON.parse($scope.assignedUser);
            
            $scope.tasks.name = $scope.name;
            $scope.tasks.description = $scope.description;
            $scope.tasks.deadline = $scope.deadline;
            $scope.tasks.assignedUser = $scope.assignedUser._id;
            $scope.tasks.assignedUserName = $scope.assignedUser.name;
            TaskData.editTask(taskid, $scope.tasks).success(function(data){
                if (wasUserDefined){
                    $scope.assignedUser.pendingTasks.append(data.data._id);
                    TaskData.updateUser($scope.assignedUser._id, $scope.assignedUser).success(function(){
                      $scope.displayText = data.message;
                    }).error(function(data){
                        $scope.displayText = data.message;
                    });
                }
            }).error(function(data){
                $scope.displayText = data.message;
            });
        }
    };

}]);

demoControllers.controller('TaskDetailsController', ['$scope', 'Tasks' , '$http', '$window', '$location', function($scope, Tasks, $http, $window, $location) {
    var taskid = Tasks.getId();
    $scope.showingCompleted = false;
    $scope.displayText = "Task Details";
    Tasks.getById(taskid).success(function(data){
        $scope.tasks = data.data;
    });
    $scope.completeTask = function(){
        $scope.tasks.completed = true;
        Tasks.completeTask($scope.tasks).success(function(data){
            $scope.tasks = data.data;
        }).error(function(data){
            $scope.tasks.completed = false;
            $scope.displayText = data.message;
        });
    };

    $scope.goToEdit = function(){
        $location.path('edittask');
    };

}]);

demoControllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";

  };

}]);


