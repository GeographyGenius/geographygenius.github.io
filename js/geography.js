function changePointsBy(change) {
    let points_box = document.getElementById("points")
    points += change
    points = Math.max(0, points)
    points_box.innerHTML = "Points: " + points + "/" + totalQuestionCount * pointsPerQuestion
}

function changeQuestionNumber() {
    questionNumber += 1
    questionNumber = Math.min(questionNumber, totalQuestionCount)
    let question_count_box = document.getElementById("questions")
    question_count_box.innerHTML = "Question " + questionNumber + "/" + totalQuestionCount
}

function getRandomCountry() {
    return(remainingQuestions[Math.floor(Math.random()*remainingQuestions.length)]);
}

function setNewRandomCountry(oldCountry) {
    question_box = document.getElementById("text_box")
    feedback_box = document.getElementById("feedback")

    whereIs = getRandomCountry()
    if (!(isQuizOver())) {
        if (!(oldCountry == "none")) {
            feedback_box.innerHTML = "Correct, that's " + oldCountry
            question_box.innerHTML = "Where is " + whereIs + "?"
        } else {
            // feedback_box.innerHTML = "Click a country to start."
            question_box.innerHTML = "Where is " + whereIs + "?"
        }
    }
    
}

function isQuizOver() {
    if (remainingQuestions.length == 0) {
        let percent = Math.round(points / (totalQuestionCount * pointsPerQuestion) * 100)
        feedback_box.innerHTML = "Quiz over. You scored " + points + "/" + totalQuestionCount * pointsPerQuestion + " (" + percent + "%)"
        question_box.innerHTML = ""
        quizOver = true
        return true
    } else {
        return false
    }
}

function removeOldCountryFromList(country) {
    const index = remainingQuestions.indexOf(country);
        if (index > -1) {
            remainingQuestions.splice(index, 1);
            console.log(remainingQuestions)
        }
}

function skipQuestion() {
    removeOldCountryFromList(whereIs)
    setNewRandomCountry('none')
    feedback_box.innerHTML = ""
    isQuizOver()
    changeQuestionNumber()
}

function submitCountry(country) {
    if (quizOver == true) {
        return
    }

    console.log(country, whereIs)
    if (country == whereIs) {
        console.log("right country")

        changePointsBy(pointsPerQuestion)
        changeQuestionNumber()
        removeOldCountryFromList(country)
        setNewRandomCountry(whereIs)
    } else {
        console.log("wrong country")
        feedback_box.innerHTML = "Incorrect, that's " + country + ". Try again."
        question_box.innerHTML = "Where is " + whereIs + "?"
        
        changePointsBy(-1)
    }
}

function scaleCoordinates(scaleAmount) {
    let map_areas = document.getElementsByTagName("area")
    for (let i = 0, area = "", coordinates = ""; i < map_areas.length; i++) {
        area = map_areas[i];
        coordinates = area.coords.split(", ");

        for (let coord = "", i2 = 0; i2 < coordinates.length; i2++) {
            coord = coordinates[i2];
            coord *= scaleAmount;
            coordinates[i2] = coord;
        }
        area.coords = coordinates;
    }
}

console.log();

$(function(){
   $('.map').maphilight({
       fillColor: 'fff4a1',
       fillOpacity:0.6,
       stroke:false,
   });
})
