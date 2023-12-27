import { runners, sm64Thresholds, smg1Thresholds, smsThresholds, smg2Thresholds, layer1, layer2 } from "./tables.js";

var prediction = [];

var weightedRoll = function(inputArray) {
    //console.log(inputArray);
    
    for (let i = 0; i < inputArray.length; i++) {
        if (i > 0) {
            inputArray[i] = inputArray[i-1] + inputArray[i];
        }
    }

    let randomNumber = Math.random();
    let continuing = true;
    let selection;
    for (let i = 0; i < inputArray.length; i++) {
        if (continuing) {
            if (randomNumber <= inputArray[i]) {
                selection = i;
                continuing = false;
            }
        }
    }

    return selection;
}

var sth = function(secondsNumber) {
    let hours = (secondsNumber - (secondsNumber % 3600)) / 3600;
    let minutes = (((secondsNumber % 3600) - ((secondsNumber % 3600) % 60)) / 60);
    let seconds = (secondsNumber % 3600) % 60;

    hours.toString();
    minutes.toString();
    seconds.toString();

    if (parseInt(minutes) < 10) {
        minutes = "0" + minutes;
    }
    if (parseInt(seconds) < 10) {
        seconds = "0" + seconds;
    }

    return (hours + ":" + minutes + ":" + seconds);
}

for (let i = 0; i < runners.length; i++) {

    let sm64;
    let smg1;
    let sms;
    let smg2;

    // layer 0

    let minmaxes = [];

    let continuing = true;
    for (let j = 0; j < sm64Thresholds.length; j++) {
        if (continuing) {
            if (runners[i][1] < sm64Thresholds[j][0]) {
                minmaxes.push(sm64Thresholds[j][1]);
                minmaxes.push(smsThresholds[j][2]);
                continuing = false;
            }
        }
    }

    continuing = true;
    for (let j = 0; j < smg1Thresholds.length; j++) {
        if (continuing) {
            if (runners[i][2] < smg1Thresholds[j][0]) {
                minmaxes.push(smg1Thresholds[j][1]);
                minmaxes.push(smg1Thresholds[j][2]);
                continuing = false;
            }
        }
    }

    continuing = true;
    for (let j = 0; j < smsThresholds.length; j++) {
        if (continuing) {
            if (runners[i][3] < smsThresholds[j][0]) {
                minmaxes.push(smsThresholds[j][1]);
                minmaxes.push(smsThresholds[j][2]);
                continuing = false;
            }
        }
    }

    continuing = true;
    for (let j = 0; j < smg2Thresholds.length; j++) {
        if (continuing) {
            if (runners[i][4] < smg2Thresholds[j][0]) {
                minmaxes.push(smg2Thresholds[j][1]);
                minmaxes.push(smg2Thresholds[j][2]);
                continuing = false;
            }
        }
    }
 
    // layer 1
    if (Math.random() <= layer1[i][1]) {
        // layer 2
        //console.log(minmaxes[0]);
        sm64 = runners[i][1] - (weightedRoll(layer2[minmaxes[0] - 1]) * 60) /* layer 4 */ +  Math.floor(Math.random() * 60);
    } else {
        // layer 3
        sm64 = runners[i][1] + ((Math.floor(Math.random() * minmaxes[1]) + 1) * 60) /* layer 4 */ +  Math.floor(Math.random() * 60);
    }

    if (Math.random() <= layer1[i][1]) {
        //console.log(minmaxes[2]);
        smg1 = runners[i][2] - (weightedRoll(layer2[minmaxes[2] - 1]) * 60) +  Math.floor(Math.random() * 60);
    } else {
        smg1 = runners[i][2] + ((Math.floor(Math.random() * minmaxes[3]) + 1) * 60) +  Math.floor(Math.random() * 60);
    }

    if (Math.random() <= layer1[i][1]) {
        //console.log(minmaxes[4]);
        sms = runners[i][3] - (weightedRoll(layer2[minmaxes[4] - 1]) * 60) +  Math.floor(Math.random() * 60);
    } else {
        sms = runners[i][3] + ((Math.floor(Math.random() * minmaxes[5]) + 1) * 60) +  Math.floor(Math.random() * 60);
    }

    if (Math.random() <= layer1[i][1]) {
        //console.log(minmaxes[6]);
        smg2 = runners[i][4] - (weightedRoll(layer2[minmaxes[6] - 1]) * 60) +  Math.floor(Math.random() * 60);
    } else {
        smg2 = runners[i][4] + ((Math.floor(Math.random() * minmaxes[7]) + 1) * 60) +  Math.floor(Math.random() * 60);
    }

    prediction.push([runners[i][0], sth(sm64), sth(smg1), sth(sms), sth(smg2)]);

}

var table = document.createElement("tbody");
	for (let i = 0; i < 20; i++) {
		var newRow = document.createElement("TR");
		for (let n = 0; n < 5; n++) {
			var newBox = document.createElement("TD");
			newBox.innerHTML = prediction[i][n];
			newRow.appendChild(newBox);
		}
		table.appendChild(newRow);
	}
document.getElementById("outerTable").appendChild(table);