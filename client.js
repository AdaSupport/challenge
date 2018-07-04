let app = angular.module('TODOApp', []);
const server = io('http://localhost:3003/');
let timeStamp = undefined;

app.controller('test', function($scope, LocalStorage) {

    $scope.todoList = JSON.parse(LocalStorage.getStorage());;
    $scope.add = function() {
        $scope.allCheck =false;
        server.emit('service', {
            record: {title: $scope.todo},
            service : 'Add'
        });
        $scope.todo = '';
        // TODO: refocus the element
    };

    $scope.checkAll = function() {
        $scope.todoList.forEach((todo) => {
            todo.selected = $scope.allCheck;
        });
    };

    $scope.getClassName = function(todoStatus) {
        return (todoStatus === 'Completed') ? 'success':'info';
    };

    $scope.delete = function() {
        $scope.allCheck =false;
        let selectedList = _.filter($scope.todoList, { 'selected': true });
        server.emit('service', {
            records: selectedList,
            service : 'Delete'
        });
    };

    $scope.complete = function() {
        $scope.allCheck =false;
        let selectedList = _.filter($scope.todoList, { 'selected': true });
        server.emit('service', {
            records: selectedList,
            service : 'Complete'
        });
    };

    server.on('disconnect', function() {
        $scope.todoList = JSON.parse(LocalStorage.getStorage());
    });

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