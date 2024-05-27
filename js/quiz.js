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

async function shareThisQuiz() {
    finalString = window.location.href
    let backupString = structuredClone(finalString)

    let response = await fetch(`https://tinyurl.com/api-create.php?url=${finalString}`)
    response = response.text()
    response = response.slice(20)
    finalString = "https://" + window.location.hostname + "/q/" + response

    let shareButtons = `<span style="color: silver;">Share on: </span><div id="share-buttons"><div class="facebook" title="Share this on Facebook"    onclick="window.open('http://www.facebook.com/share.php?u={{ safeurl }}','popup','width=600,height=600'); return false;"><svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"/></svg></div><div class="twitter"  title="Share this on Twitter"     onclick="window.open('https://twitter.com/intent/tweet?url={{ safeurl }}&text={{ safetitle }}&via={{ site.twitter_username }}','popup','width=600,height=600'); return false;"><svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z"/></svg></div><div class="linkedin" title="Share this on Linkedin"    onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url={{ safeurl }}','popup','width=600,height=600'); return false;"><svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z"/></svg></div><div class="gplus"    title="Share this on Google Plus" onclick="window.open('https://plus.google.com/share?url={{ safeurl }}','popup','width=600,height=600'); return false;"><svg viewBox="0 0 2304 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1437 913q0 208-87 370.5t-248 254-369 91.5q-149 0-285-58t-234-156-156-234-58-285 58-285 156-234 234-156 285-58q286 0 491 192l-199 191q-117-113-292-113-123 0-227.5 62t-165.5 168.5-61 232.5 61 232.5 165.5 168.5 227.5 62q83 0 152.5-23t114.5-57.5 78.5-78.5 49-83 21.5-74h-416v-252h692q12 63 12 122zm867-122v210h-209v209h-210v-209h-209v-210h209v-209h210v209h209z"/></svg></div><div class="mail"     title="Share this through Email"  onclick="window.open('mailto:?&body={{ safeurl }}&subject={{ safetitlepre }}{{ safetitle }}','popup','width=600,height=600'); return false;"><svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"/></svg></div></div>`

    Sweetalert2.fire({
        title: 'Share',
        html: `<span id="main-copy-text">${shareMessage}</span><br><input type="text" readonly="readonly" id="finished-url" onclick="copyQuizURL()" style="width: 400px;margin: 10px;font-size: 15px;"value="${finalString}"><br>${shareButtons}`,
        icon: 'success',
        confirmButtonText: 'Done'
    })
}
