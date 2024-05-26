let questionList
let capitalList
let fullCountryList
let fullCapitalList
let remainingQuestions
let whereIs
let quizOver
let question_box
let feedback_box
let points_box
let guesses_box
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
let isCustomQuiz
let excludeData
const pointsPerQuestion = 4

window.onload = function() {
    console.log("setup...")
    setupData()
}

function setupData() {
    points_box = document.getElementById("points") // get points box
    question_count_box = document.getElementById("questions") // get questions box
    guesses_box = document.getElementById("guesses") // get guesses box
    guesses_box.innerHTML = "0/0 guesses correct"
    loadSettings()

    correctGuesses = 0
    incorrectGuesses = 0
    possibleQuizzes = [  // possible quizzes
                    "africa-countries", 
                    "africa-capitals", 
                    "south-america-countries", 
                    "south-america-captials",
                    "north-america-countries",
                    "north-america-capitals",
                    "central-america-countries",
                    "central-america-capitals",
                    "europe-countries",
                    "europe-capitals",
                    "middle-east-countries",
                    "middle-east-capitals"
                    ]
    searchParams = new URLSearchParams(window.location.search);
    quizName = searchParams.get("q")
    if (!searchParams.has("q")) { // if invalid url, redirect to home
        location.href = "/"
    }
    const urlToLoad = "/js/json/maps/" + quizName + ".json"
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

    let displayQuizName = structuredClone(quizName)
    displayQuizName = displayQuizName.replaceAll("-",  " ")
    displayQuizName = toTitleCase(displayQuizName)
    // console.log("quiz name fancy: " + displayQuizName)
    document.getElementsByTagName("title")[0].text = displayQuizName + " - Geography Genius"; // update page title
    
    let customQuizName = ""
    if (searchParams.has("t")) {
        let result = stringRegex.test(searchParams.get("t"))
        if (!(result)) {
            console.log("Error - failed to decode quiz title with atob")
            customQuizName = "[Invalid Quiz Title]"
        } else {
            try {
                customQuizName = atob(searchParams.get("t"))
            }
            catch {
                console.log("Error - failed to decode quiz title with atob")
                customQuizName = "[Invalid Quiz Title]"
            }
        }
    }

    if (!(customQuizName == "")) {
        document.getElementById("quiz-name").innerText = displayQuizName + " - " + customQuizName
    } else {
        document.getElementById("quiz-name").innerHTML = displayQuizName + " Quiz" // update quiz title on page
    }

    let customQuizDesc = ""
    if (searchParams.has("d")) {
        try {
            customQuizDesc = atob(searchParams.get("d"))
        }
        catch {
            console.log("Error - failed to decode quiz description with atob")
            customQuizDesc = "[Invalid Quiz Description]"
        }
    }    

    if (!(customQuizDesc == "")) {
        let descPieces = document.getElementsByClassName("gg-q-desc")
        descPieces[0].hidden = false
        descPieces[1].hidden = false
        descPieces[2].hidden = false
        document.getElementById("quiz-desc").innerText = customQuizDesc
    }

    let fancyInnerHTML = ""
    let dataMaphilight
    let extraStyles
    if (searchParams.has("c")) {
        isCustomQuiz = true
        excludeData = base64ToBinary(searchParams.get("c"), fullCountryList.length)
    } else {
        isCustomQuiz = false
    }

    // let sortedCountryList = structuredClone(fullCountryList)
    // sortedCountryList.sort()

    for (let i = 0, countryData = loadedData.countryData; i < countryData.length; i++) {
        if (isCustomQuiz) {
            if (excludeData.charAt(fullCountryList.indexOf(countryData[i].countryName)) == "1") {
                dataMaphilight = "data-maphilight='{\"stroke\":false,\"fillColor\":\"000000\",\"fillOpacity\":0.1,\"alwaysOn\":true}'";
                extraStyles = 'style="cursor:default" '
                
                const index = questionList.indexOf(countryData[i].countryName);
                if (index > -1) { // only splice array when item is found
                    questionList.splice(index, 1); // 2nd parameter means remove one item only
                    if (doCapitals) {
                        capitalList.splice(index, 1);
                    }
                }
            } else {
                dataMaphilight = ""
                extraStyles = ""
            }
        } else {
            dataMaphilight = ""
            extraStyles = ""
        }
        fancyInnerHTML = fancyInnerHTML + '<area onclick="submitCountry(' + "'" + countryData[i].countryName + "'" + ')" shape="poly"' + dataMaphilight + ' ' + extraStyles + 'coords="' + countryData[i].countryCoords + '" />'
    }
    document.getElementById("map-land").innerHTML = fancyInnerHTML
    document.getElementById("main_map").hidden = false
    document.getElementById("quiz-ui").hidden = false
    document.getElementById("quiz-footer").hidden = false // so footter isn't visible during loading
    document.getElementById("ui").hidden = false
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
        fullCountryList = structuredClone(questionList)
        if (loadedData.info.capitals == "true") {
            doCapitals = true
            capitalList = loadedData.capitalList
        }
        fullCapitalList = structuredClone(capitalList)
        // if (loadedData.info.custom == "true") {   // no more exclude list
        //     isCustomQuiz = true
        //     excludeList = loadedData.excludeList
        // }
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
    })

    .fail(function() {
        console.log("JSON request failed - quiz failed to load.");
        if (!possibleQuizzes.includes(quizName)) {
            var failText = "404 - Quiz not found"
        } else {
            var failText = "Hm, it looks like the quiz failed to load. Reload the page, or try again later?"
        }
        document.getElementById("quiz-name").innerHTML = failText;
        // document.getElementsByClassName("map")[0].remove()
    })
}

function changePointsBy(change) {
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
            if (doCapitals) {
                // feedback_box.innerHTML = "Correct, that's " + calcCapitalFromCountry(oldCountry) + ", the capital of " + oldCountry
                feedback_box.innerHTML = "Correct, that's " + oldCountry + ", whose capital is  " + calcCapitalFromCountry(oldCountry)
                question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
            } else {
                feedback_box.innerHTML = "Correct, that's " + oldCountry
                question_box.innerHTML = "Where is " + whereIs + "?"
            }

        } else {
            // feedback_box.innerHTML = "Click a country to start."
            if (doCapitals) {
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

        let extraText = ""
        if (guesses_box.hidden == false) {
            extraText += " You got " + correctGuesses + " guesses correct, and " + incorrectGuesses + " incorrect."
        }
        if (points_box.hidden == false) {
            extraText += " You got " + percent + "% score."
        }

        feedback_box.innerHTML = "Quiz over." + extraText
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
    if (quizOver) {
        alert("The quiz is over.")
        return
    }

    if (isCustomQuiz) {
        if (excludeData.charAt(fullCountryList.indexOf(country)) == "1") {
            if (doCapitals) {
                alert(calcCapitalFromCountry(country) + " is not part of this quiz.")
            } else {
                alert(country + " is not part of this quiz.")
            }
            return
        }
    }

    // console.log(country, whereIs)
    if (country == whereIs) {
        // console.log("right country")
        correctGuesses += 1
        updateGuessBox()

        changePointsBy(pointsPerQuestion)
        changeQuestionNumber()
        removeOldCountryFromList(country)
        setNewRandomCountry(whereIs)
    } else {
        // console.log("wrong country")
        incorrectGuesses += 1
        updateGuessBox()

        if (doCapitals) {
            feedback_box.innerHTML = "Incorrect, that's " + calcCapitalFromCountry(country) + ", the capital of " + country + ". Try again."
        } else {
            feedback_box.innerHTML = "Incorrect, that's " + country + ". Try again."
        }
        if (doCapitals) {
            question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
        } else {
            question_box.innerHTML = "Where is " + whereIs + "?"
        }
        
        changePointsBy(-1)
    }
}

function updateGuessBox() {
    guesses_box.innerHTML = correctGuesses + "/" + (correctGuesses + incorrectGuesses) + " guesses correct"
}

function calcCapitalFromCountry(country) {
    return(fullCapitalList[fullCountryList.indexOf(country)])
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
        values = [true, true, true]
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
    document.getElementById("show-score").checked = values[0]
    document.getElementById("show-questions").checked = values[1]
    document.getElementById("show-guesses").checked = values[2]

    updateSettings()
}

function updateSettings() {
    let values = []
    values.push(document.getElementById("show-score").checked)
    values.push(document.getElementById("show-questions").checked)
    values.push(document.getElementById("show-guesses").checked)
    localStorage.setItem("quiz-settings", values)

    if (values[0]) {
        points_box.hidden = false
    } else {
        points_box.hidden = true
    }

    if (values[1]) {
        question_count_box.hidden = false
    } else {
        question_count_box.hidden = true
    }

    if (values[2]) {
        guesses_box.hidden = false
    } else {
        guesses_box.hidden = true
    }
    
}

function customizeQuiz() {
    window.location.href = window.location.href.replace("quiz", "customize-quiz")
}
