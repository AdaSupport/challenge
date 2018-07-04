let app = angular.module('TODOApp', []);
const server = io('http://localhost:3003/');
let timeStamp = undefined;

app.controller('test', function($scope, LocalStorage) {

    $scope.todoList = JSON.parse(LocalStorage.getStorage());

    //This function adds a todo
    $scope.add = function() {
        $scope.allCheck =false;
        server.emit('service', {
            record: {title: $scope.todo},
            service : 'Add'
        });
        $scope.todo = '';

        //refocus the element
        $scope.$broadcast('newItemAdded');
    };

    //This function checks all checkbox
    $scope.checkAll = function() {
        $scope.todoList.forEach((todo) => {
            todo.selected = $scope.allCheck;
        });
    };

    //This function gets the classname for the table display
    $scope.getClassName = function(todoStatus) {
        return (todoStatus === 'Completed') ? 'success':'info';
    };

    //This function deletes a todo
    $scope.delete = function() {
        $scope.allCheck =false;
        let selectedList = _.filter($scope.todoList, { 'selected': true });
        server.emit('service', {
            records: selectedList,
            service : 'Delete'
        });
    };

    //This function completes a todo
    $scope.complete = function() {
        $scope.allCheck =false;
        let selectedList = _.filter($scope.todoList, { 'selected': true });
        server.emit('service', {
            records: selectedList,
            service : 'Complete'
        });
    };

    //If socket disconnects, fetch from local storage
    server.on('disconnect', function() {
        $scope.todoList = JSON.parse(LocalStorage.getStorage());
    });

    //ON server load, execute the following
    server.on('load', (todos) => {
        if((todos.oldTS == null && timeStamp == undefined) || timeStamp == todos.oldTS){
            //first time load all or timestamp matched
            if(todos.status == 'Add'){
                if(timeStamp == undefined){
                    $scope.todoList = [];
                }

                todos.db.forEach((todo) => {
                    $scope.todoList.push(todo);
                });
                timeStamp = todos.currentTS;
                $scope.$apply();
            }
            else if(todos.status == 'Delete'){
                //after delete operation
                todos.db.forEach((todo) => {
                    let index = _.findIndex($scope.todoList, function(o) { return o.id == todo.id; });
                    if(index > -1){
                        $scope.todoList.splice(index, 1);
                    }
                });
                timeStamp = todos.currentTS;
                $scope.$apply();
            }
            else if(todos.status == 'Complete'){
                //after todo completes
                todos.db.forEach((todo) => {
                    let index = _.findIndex($scope.todoList, function(o) { return o.id == todo.id; });
                    if(index > -1){
                        $scope.todoList[index].status = 'Completed';
                        $scope.todoList[index].selected = false;
                    }
                });
                timeStamp = todos.currentTS;
                $scope.$apply();
            }
        }
        else {
            //connection lost pull from local storage
            $scope.todoList = JSON.parse(LocalStorage.getStorage());
        }

        LocalStorage.setStorage(JSON.stringify($scope.todoList))

    });
});

//Local storage to store todo's
app.service('LocalStorage', function() {

    let setStorage = function(todoList) {
        delete window.localStorage.todoList;
        window.localStorage.todoList = todoList;
    };

    let getStorage = function(){
        return window.localStorage.todoList || '[]';
    };

    return {
        getStorage: getStorage,
        setStorage: setStorage
    };
});

//directory to focus the textfield after adding a todo
app.directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on(attr.focusOn, function(e) {
            elem[0].focus();
        });
    };
});