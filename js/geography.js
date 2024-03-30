let questionList
let capitalList
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
let doCapitals
let correctGuesses
let incorrectGuesses
const pointsPerQuestion = 4

window.onload = function() {
    console.log("setup...")
    setupData()
}

function setupData() {
    loadSettings()

    correctGuesses = 0
    incorrectGuesses = 0
    possibleQuizzes = [
                    "africa-countries", 
                    "africa-capitals", 
                    "south-america-countries", 
                    "south-america-captials",
                    "north-america-countries",
                    "north-america-capitals",
                    "central-america-countries",
                    "central-america-capitals",
                    ]
    searchParams = new URLSearchParams(window.location.search);
    quizName = searchParams.get("quiz")
    if (!searchParams.has("quiz")) {
        location.href = "/"
    }
    const urlToLoad = "/js/json/" + quizName + ".json"
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
    remainingQuestions = structuredClone(questionList)
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
       fillColor: 'cff0cc',//'4ead45',//'fff4a1',
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
        if (loadedData.info.capitals == "true") {
            doCapitals = true
            capitalList = loadedData.capitalList
        }
        console.log("loaded question list")
        let headerLinks = document.getElementsByClassName("h-a")
        let areaOfWorld = loadedData.info.area
        
        if(areaOfWorld == "Americas") {
            headerLinks[1].classList = "h-a active"
        }
        if(areaOfWorld == "Africa") {
            headerLinks[2].classList = "h-a active"
        }
        if(areaOfWorld == "Europe") {
            headerLinks[3].classList = "h-a active"
        }
        if(areaOfWorld == "Asia") {
            headerLinks[4].classList = "h-a active"
        }
        if(areaOfWorld == "Oceania") {
            headerLinks[5].classList = "h-a active"
        }

        let imageURL = "/images/maps/" + loadedData.info.imgUrl
        // let imageURL = "/images/maps/" + quizName + ".png"
        document.getElementById("cool-image").innerHTML = '<img id="main_map" hidden="true" src="' + imageURL + '" alt="" usemap="#map-area" class="map" onload="mapLoaded()"/>'

        let displayQuizName = structuredClone(quizName)
        displayQuizName = displayQuizName.replaceAll("-",  " ")
        displayQuizName = toTitleCase(displayQuizName)
        // console.log("quiz name fancy: " + displayQuizName)
        document.getElementsByTagName("title")[0].text = displayQuizName + " - Geography Genius"; // update page title
    })

    .fail(function() {
        console.log("JSON request failed - quiz failed to load.");
        if (!possibleQuizzes.includes(quizName)) {
            var failText = "404 - Quiz not found"
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
    // points_box.innerHTML = ""
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
            // correctGuesses += 1
            if (doCapitals == true) {
                // feedback_box.innerHTML = "Correct, that's " + calcCapitalFromCountry(oldCountry) + ", the capital of " + oldCountry
                feedback_box.innerHTML = "Correct, that's " + oldCountry + ", whose capital is  " + calcCapitalFromCountry(oldCountry)
                question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
            } else {
                feedback_box.innerHTML = "Correct, that's " + oldCountry
                question_box.innerHTML = "Where is " + whereIs + "?"
            }

        } else {
            // feedback_box.innerHTML = "Click a country to start."
            if (doCapitals == true) {
                question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
            } else {
                question_box.innerHTML = "Where is " + whereIs + "?"
            }
        }
    }
    
}

function isQuizOver() {
    if (remainingQuestions.length == 0) {
        let percent = Math.round(points / (totalQuestionCount * pointsPerQuestion) * 100)
        // You scored " + points + "/" + totalQuestionCount * pointsPerQuestion + " (" + percent + "%)
        feedback_box.innerHTML = "Quiz over." + " You got " + correctGuesses + " guesses correct, and " + incorrectGuesses + " incorrect."
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
            // console.log(remainingQuestions)                  //for debugging
            // console.log("question list" + questionList)
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

    // console.log(country, whereIs)
    if (country == whereIs) {
        // console.log("right country")
        correctGuesses += 1

        changePointsBy(pointsPerQuestion)
        changeQuestionNumber()
        removeOldCountryFromList(country)
        setNewRandomCountry(whereIs)
    } else {
        // console.log("wrong country")
        incorrectGuesses += 1
        if (doCapitals == true) {
            feedback_box.innerHTML = "Incorrect, that's " + calcCapitalFromCountry(country) + ", the capital of " + country + ". Try again."
        } else {
            feedback_box.innerHTML = "Incorrect, that's " + country + ". Try again."
        }
        if (doCapitals == true) {
            question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
        } else {
            question_box.innerHTML = "Where is " + whereIs + "?"
        }
        
        changePointsBy(-1)
    }
}

function calcCapitalFromCountry(country) {
    return(capitalList[questionList.indexOf(country)])
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

function loadSettings() {
    let values = localStorage.getItem("quiz-settings")
    if (values == null) {
        values = [true, false, false, false]
    } else {
        values = values.split(",")
        for(let i = 0;i < values.length;i++) {
            if(values[i] == "true") {
                values[i] = true
            } else {
                values[i] = false
            }
        }
    }
    console.log(values)
    getElement("show-score").checked = values[0]
    getElement("show-timer").checked = values[1]
    getElement("show-num-correct-guesses").checked = values[2]
    getElement("show-num-incorrect-guesses").checked = values[3]
}

function updateSettings() {
    let values = []
    values.push(getElement("show-score").checked)
    values.push(getElement("show-timer").checked)
    values.push(getElement("show-num-correct-guesses").checked)
    values.push(getElement("show-num-incorrect-guesses").checked)

    localStorage.setItem("quiz-settings", values)
    console.log(localStorage.getItem("quiz-settings"))
    getElement("message").innerHTML = "Settings updated"

}