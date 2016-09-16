//showing current date and time on the webpage -- setting up for calculating time
	var currentTimeView = moment().format('LT');
	var currentDateView = moment().format('LL');

	$('#currentTime').append(currentTimeView);
	$('#currentDate').append(currentDateView);


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
	var firstTrainTimeConverted = moment(newTime, 'hh:mm').subtract(1, 'years');
	var diffTime = moment().diff(moment(firstTrainTimeConverted), 'minutes');
	var timeRemainder = diffTime % newFrequency;
	var timeMinutesUntilTrain = newFrequency - timeRemainder;
	var nextTrain = moment().add(timeMinutesUntilTrain, "hh:mm");

	console.log('time: ' + newTime);
	console.log('freq: ' + newFrequency);

	console.log("minute values: " + firstTrainTimeConverted);
	console.log("current Time: " + currentTimeView);
	console.log('difference in minutes: ' + diffTime);
	console.log("time remainder: " + timeRemainder);
	console.log("minutes til train: " + timeMinutesUntilTrain);
	console.log("arrival time: " + moment(nextTrain).format('LT'));

	
	$('#trainScheduale	> tbody').append('<tr><td>' + newTrainName + '</td><td>' + newDestination + '</td><td>' + newFrequency + '</td><td>' + moment(nextTrain).format('LT') + '</td><td>' + timeMinutesUntilTrain + '</td></tr>');
});






