//showing current date and time on the webpage -- setting up for calculating time
	
//function displayTime() {
	var currentTimeView = moment().format('LTS');
	var currentDateView = moment().format('LL');

	//currentTimeView(update, 1000);

	$('#currentTime').append(currentTimeView);
	$('#currentDate').append(currentDateView);
//}
//9/17-----------trying to add time that updates every second/minute


// Initialize firebase
var config = {
	apiKey: "AIzaSyBjjNPRDXKAntvJnoE1d7n9qAeTOEc8sbA",
	authDomain: "train-ing.firebaseapp.com",
	databaseURL: "https://train-ing.firebaseio.com",
	storageBucket: "train-ing.appspot.com",
};

firebase.initializeApp(config);
var database =firebase.database();

var trainName = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = 0;


//adding a new train
$("#submitTrain").on("click", function() {
	trainName = $('#trainName').val().trim();
	trainDestination = $('#trainDestination').val().trim();
	firstTrainTime = $('#firstTrainTime').val().trim();
	trainFrequency = $('#trainFrequency').val().trim();

	//checking what values i pulled
	console.log(trainName);
	console.log(trainDestination);
	console.log(firstTrainTime);
	console.log(trainFrequency);

	//pushing these values to firebase in a new varible newTrain
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		beginTime: firstTrainTime,
		frequency: trainFrequency
	}
	database.ref().push(newTrain);

	//clearing input fields after us
	$('#trainName').val('');
	$('#trainDestination').val('');
	$('#firstTrainTime').val('');
	$('#trainFrequency').val('');

	//making sure it doesn't start a new page
	return false;
});

//pulling data from firebase, and throwing it on to the HTML
database.ref().on("child_added", function(childSnapshot, prevChildKey){
	var newTrainName = childSnapshot.val().name;
	var newDestination = childSnapshot.val().destination;

	var newFrequency = childSnapshot.val().frequency;
	var newTime = childSnapshot.val().beginTime;

	console.log(childSnapshot.val());

	//Calculating time 
	//var trainFrequency = 15;
	//var firstTrainTime = "4:30";
	console.log("current Time: " + currentTimeView);
	console.log('freq: ' + newFrequency);

	var firstTrainTimeConverted = moment(newTime, 'hh:mm').subtract(1, 'years');
	console.log("minute values: " + firstTrainTimeConverted);

	var diffTime = moment().diff(moment(firstTrainTimeConverted), 'minutes');
	console.log('difference in minutes: ' + diffTime);


	var timeRemainder = diffTime % newFrequency;
	console.log("time remainder: " + timeRemainder);

	var timeMinutesUntilTrain = newFrequency - timeRemainder;
	console.log("minutes til train: " + timeMinutesUntilTrain);


	var nextTrainAdded = moment().add(timeMinutesUntilTrain, 'minutes');
	console.log("next arrival time in minutes: " + nextTrainAdded);
	
	var nextTrain = moment(nextTrainAdded).format('hh:mm');

	console.log('moment: ' + moment());
	console.log("next arrival time: " + moment(nextTrainAdded).format('LT'));
	console.log('next train: ' + nextTrain);

	
	

	
	

	

	
	$('#trainScheduale	> tbody').append('<tr><td>' + newTrainName + '</td><td>' + newDestination + '</td><td>' + newFrequency + '</td><td>' + nextTrain + '</td><td>' + timeMinutesUntilTrain + '</td></tr>');
});






