/*
Ian Durra
INFO 343
07/12/15
Spotify HW
*/

var data;
var baseUrl = 'https://api.spotify.com/v1/search?q=year%3A';
var nestedBaseUrl = 'https://api.spotify.com/v1/search?type=track&query=';
var myApp = angular.module('myApp', []);
//used as random number throughout program
var r = 0;

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
    //declare scoped variables, defining state of game
    $scope.audioObject = {};
    $scope.a = ""
    $scope.r = "";
    $scope.d = 2;
    $scope.w = 0;
    $scope.l = 0;
    $scope.g = 0;
    $scope.h = 5;
    $scope.t = 5;
    $scope.diff = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    //used to give feedback of game state to user
    $scope.answer = "Fill Out the Form, Click to Guess!";

    //called when game has been lost
    //pauses the song, clears all data
    var youLose = function(){
        $scope.killSong();
        data = {};
        $scope.tracks = {};
        $scope.l++;
        $scope.answer = "Game Over"
    }

    //returns boolean values of inputs
    //used for form validation
    $scope.isDisabled = function(first, second, third){
        return (first || second || third);
    }

    //function called to load data
    //makes two ajax calls
    $scope.getSongs = function(){
        $scope.answer = "Click New Game to Begin!"
        $scope.t = $scope.h;
        //return hash value of input
        var hash = simpleHash();
        //use hash value to find an artist in given year
        $http.get(baseUrl + $scope.r + "&type=artist&limit=1&offset=" + 
            hash).success(function(response){
                $scope.name = response.artists.items[0]["name"];
            //use first character of artist name to perform new search
            $http.get(nestedBaseUrl + $scope.name.charAt(0) + "&limit=" + 
                (parseInt($scope.d))).success(function(response1){
                    data = $scope.tracks = response1.tracks.items;
            });
        });
    }

    //perform new search w/o resetting stats
    $scope.newQuery = function(){
        $scope.killSong();
        data = {};
        $scope.tracks = {};
    }

    //very simple hash function
    //returns ASCII value of String
    var simpleHash = function(){
        var a = $scope.a;
        var hash = 0
        for(var i = 0; i < a.length; i++){
            hash += a.charCodeAt(i);
        }
        return hash;
    }

    //resets all stats
    //pause song
    $scope.resetAll = function(){
        data = {};
        $scope.w = 0;
        $scope.l = 0;
        $scope.g = 0;
        $scope.t = 0;
        $scope.tracks = {};
        //pause song
        $scope.killSong();
    }

    //pauses the song
    $scope.killSong = function(){
        if($scope.audioObject.pause != undefined){
            $scope.audioObject.pause();
        } 
    }

    //begins a new game
    //play a random song
    $scope.begin = function(){
        //used to determine song to play
        r = Math.floor((Math.random() * data.length));
        $scope.t = $scope.h;
        var song = data[r].preview_url;
        //handles playing the song
        if($scope.audioObject.pause != undefined){
            $scope.audioObject.pause();
        } 
        $scope.audioObject = new Audio(song);
        $scope.audioObject.play(); 
        $scope.currentSong = song;
        $scope.g++;
    }

    //function called when a song is clicked
    //updates state of game
    $scope.play = function(song){
        //correct song is chosen
        //update state of game
        if($scope.currentSong == song) {
            $scope.audioObject.pause();
            $scope.currentSong = false;
            $scope.w++;
            $scope.t--; 
            $scope.answer = "You Win!" 
        } else {
            //wrong song is picked
            //or out of guesses
            //updates state of game
            if($scope.audioObject.pause != undefined){
                $scope.t--;
                if($scope.t == 0){
                    youLose();
                } else {
                    $scope.answer = "Try Again!";
                }
            }
        } 
    }
});

// Adds tool tips
$('body').tooltip({
    selector: '[title]'
});
