let app = angular.module('TODOApp', []);
const server = io('http://localhost:3003/');
let timeStamp = undefined;

app.controller('test', function($scope) {

    $scope.add = function() {
        server.emit('service', {
            record: {title: $scope.todo},
            service : 'Add'
        });
        $scope.todo = '';
        // TODO: refocus the element
    };

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
        }
        else {
            //connection lost
        }
    });
});