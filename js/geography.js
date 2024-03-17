let questionList
let remainingQuestions
let whereIs
let quizOver
let question_box
let feedback_box
let points
let totalQuestionCount
let questionNumber
let loadedData
let possibleQuizzes
let searchParams
let quizName
const pointsPerQuestion = 4

window.onload = function() {
    console.log("setup...")
    setupData()
}

function setupData() {
    possibleQuizzes = [
                    "africa-countries", 
                    "africa-capitals", 
                    "south-america-countries", 
                    "south-america-captials", 
                    ]
    searchParams = new URLSearchParams(window.location.search);
    quizName = searchParams.get("quiz")
    const urlToLoad = "/js/json/" + quizName + ".json"
    document.getElementsByTagName("title")[0].text = "Geography Practice";
    loadFromJSON(urlToLoad)
    }

function finishSetup() {
    let mapScale = 1;
    let map = document.getElementById("main_map");
    if (map.width == 0) {
        location.reload()
    }
    map.width *= mapScale;
    scaleCoordinates(mapScale);

    totalQuestionCount = questionList.length
    remainingQuestions = questionList
    quizOver = false
    points = 0
    questionNumber = 0
    changeQuestionNumber()
    changePointsBy(0)

    setNewRandomCountry("none");
}

function mapLoaded() {
    console.log("map loaded")
    let fancyInnerHTML = ""
    for (let i = 0, countryData = loadedData.countryData; i < countryData.length; i++) {
        fancyInnerHTML = fancyInnerHTML + '<area onclick="submitCountry(' + "'" + countryData[i].countryName + "'" + ')" shape="poly" coords="' + countryData[i].countryCoords + '" />'
    }
    document.getElementById("map-land").innerHTML = fancyInnerHTML
    document.getElementById("main_map").hidden = false
    document.getElementById("quiz-ui").hidden = false
    finishSetup()

    $(function(){
    $('.map').maphilight({
       fillColor: 'fff4a1',
       fillOpacity:0.6,
       stroke:false,
    });
    })
}

function loadFromJSON(url) {
    $.getJSON(url)
    .done(function(data) {
        loadedData = data
        questionList = loadedData.countryList
        console.log("loaded question list")
        // let imageURL = loadedData.info.imgURL
        let imageURL = "/images/maps/" + quizName + ".png"
        document.getElementById("cool-image").innerHTML = '<img id="main_map" hidden="true" src="' + imageURL + '" alt="" usemap="#map-area" class="map" onload="mapLoaded()"/>'
    })

    .fail(function() {
        console.log("JSON request failed - quiz failed to load.");
        if (!possibleQuizzes.includes(quizName)) {
            var failText = "404 - Quiz not found. (Or maybe it just failed to load, in which case just reload the page.)"
        } else {
            var failText = "Hm, it looks like the quiz failed to load. Reload the page, or try again later?"
        }
        document.getElementById("map-land").innerHTML = failText;
        document.getElementsByClassName("map")[0].remove()
    })
}

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
