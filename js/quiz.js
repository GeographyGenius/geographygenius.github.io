let gg = {}
gg.pointsPerQuestion = 4

window.onload = setupData

async function setupData() {
    console.log("setup...")
    gg.points_box = document.getElementById("points") // get points box
    gg.question_count_box = document.getElementById("questions") // get questions box
    gg.guesses_box = document.getElementById("guesses") // get guesses box
    gg.guesses_box.innerHTML = "0/0 guesses correct"
    loadSettings()

    gg.correctGuesses = 0
    gg.incorrectGuesses = 0

    // loadPossibleQuizList()
    // possibleQuizzes = [  // possible quizzes
    //                 "africa-countries", 
    //                 "africa-capitals", 
    //                 "south-america-countries", 
    //                 "south-america-captials",
    //                 "north-america-countries",
    //                 "north-america-capitals",
    //                 "central-america-countries",
    //                 "central-america-capitals",
    //                 "europe-countries",
    //                 "europe-capitals",
    //                 "middle-east-countries",
    //                 "middle-east-capitals"
    //                 ]
    gg.searchParams = new URLSearchParams(window.location.search);
    gg.quizName = gg.searchParams.get("q")
    if (!gg.searchParams.has("q")) { // if invalid url, redirect to home
        if (gg.searchParams.has("quiz")) {
            let tempQuiz = gg.searchParams.get("quiz")
            gg.searchParams.delete("quiz")
            gg.searchParams.set("q", tempQuiz)

            var newurl = window.location.protocol + "//" + window.location.host + "/geography/quiz?" + gg.searchParams.toString();
            window.history.pushState({path:newurl},'',newurl);
            window.location.reload()
        } else {
            location.href = "/"
        }
    }
    const urlToLoad = "/js/json/maps/" + gg.quizName + ".json"

    let r = await fetch(urlToLoad)
    if (r.ok) {
        let data = await r.json()
        gg.loadedData = data
        gg.questionList = gg.loadedData.countryList
        gg.fullCountryList = structuredClone(gg.questionList)
        if (gg.loadedData.info.capitals == "true") {
            gg.doCapitals = true
            gg.capitalList = gg.loadedData.capitalList
        }
        gg.fullCapitalList = structuredClone(gg.capitalList)
        console.log("loaded question list")
        let headerLinks = document.getElementsByClassName("h-a")
        let areaOfWorld = gg.loadedData.info.area
        
        if(areaOfWorld == "Americas") {
            headerLinks[3].classList = "h-a active"
        }
        if(areaOfWorld == "Africa") {
            headerLinks[4].classList = "h-a active"
        }
        if(areaOfWorld == "Europe") {
            headerLinks[5].classList = "h-a active"
        }
        if(areaOfWorld == "Asia") {
            headerLinks[6].classList = "h-a active"
        }
        if(areaOfWorld == "Oceania") {
            headerLinks[7].classList = "h-a active"
        }

        let imageURL = "/images/maps/" + gg.loadedData.info.imgUrl
        document.getElementById("cool-image").innerHTML = '<img id="main_map" hidden="true" src="' + imageURL + '" alt="" usemap="#map-area" class="map" onload="mapLoaded()"/>'
    } else {
        console.error("JSON request failed - quiz failed to load.");
        var failText = "Hm, it looks like the quiz failed to load. It might not exist. Reload the page, or try again later."
        document.getElementById("quiz-name").style.textAlign = "left"
        document.getElementById("loading-spinner").hidden = true
        document.getElementById("quiz-name").innerHTML = failText;
    }
}

function finishSetup() {
    // scaling doesn't seem to work
    // let mapScale = 1;
    // let map = document.getElementById("main_map");
    // if (map.width == 0) {
    //     location.reload()
    // }
    // map.width *= mapScale;
    // scaleCoordinates(mapScale);

    gg.totalQuestionCount = gg.questionList.length
    gg.remainingQuestions = structuredClone(gg.questionList)
    gg.quizOver = false
    gg.points = 0
    gg.questionNumber = 0
    changeQuestionNumber()
    changePointsBy(0)

    setNewRandomCountry("none");
}

function mapLoaded() {
    console.log("map loaded")
    document.getElementById("quiz-name").style.textAlign = "left"
    document.getElementById("loading-spinner").hidden = true

    let displayQuizName = structuredClone(gg.quizName)
    displayQuizName = displayQuizName.replaceAll("-",  " ")
    displayQuizName = toTitleCase(displayQuizName)
    // console.log("quiz name fancy: " + displayQuizName)
    document.getElementsByTagName("title")[0].text = displayQuizName + " - Geography Genius"; // update page title
    
    let customQuizName = ""
    if (gg.searchParams.has("t")) {
        let result = stringRegex.test(gg.searchParams.get("t"))
        if (!(result)) {
            console.log("Error - failed to decode quiz title with atob")
            customQuizName = "[Invalid Quiz Title]"
        } else {
            try {
                customQuizName = atob(gg.searchParams.get("t"))
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
    if (gg.searchParams.has("d")) {
        try {
            customQuizDesc = atob(gg.searchParams.get("d"))
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
    if (gg.searchParams.has("c")) {
        gg.isCustomQuiz = true
        gg.excludeData = base64ToBinary(gg.searchParams.get("c"), gg.fullCountryList.length)
    } else {
        gg.isCustomQuiz = false
    }

    // let sortedCountryList = structuredClone(fullCountryList)
    // sortedCountryList.sort()

    let countryData = gg.loadedData.countryData
    for (let country of countryData) {
        if (gg.isCustomQuiz) {
            if (gg.excludeData.charAt(gg.fullCountryList.indexOf(country.countryName)) == "1") {
                dataMaphilight = "data-maphilight='{\"stroke\":false,\"fillColor\":\"000000\",\"fillOpacity\":0.1,\"alwaysOn\":true}'";
                extraStyles = 'style="cursor:default" '
                
                const index = gg.questionList.indexOf(country.countryName);
                if (index > -1) { // only splice array when item is found
                    gg.questionList.splice(index, 1); // 2nd parameter means remove one item only
                    if (gg.doCapitals) {
                        gg.capitalList.splice(index, 1);
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
        fancyInnerHTML += '<area onclick="submitCountry(' + "'" + country.countryName + "'" + ')" shape="poly"' + dataMaphilight + ' ' + extraStyles + 'coords="' + country.countryCoords + '" />'
    }
    document.getElementById("map-land").innerHTML = fancyInnerHTML
    document.getElementById("main_map").hidden = false
    document.getElementById("quiz-ui").hidden = false
    document.getElementById("quiz-footer").hidden = false // so footer isn't visible during loading
    document.getElementById("ui").hidden = false
    document.getElementById("green-circle-click").hidden = false
    finishSetup()

    $(function(){
        $('.map').maphilight({
            fillColor: 'cff0cc',//'4ead45',//'fff4a1',
            fillOpacity: 0.6,
            stroke: false,
        });
    })
}

function changePointsBy(change) {
    gg.points += change
    gg.points = Math.max(0, gg.points)
    gg.points_box.innerText = "Points: " + gg.points + "/" + gg.totalQuestionCount * gg.pointsPerQuestion
    // points_box.innerHTML = ""
}

function changeQuestionNumber() {
    gg.questionNumber += 1
    gg.questionNumber = Math.min(gg.questionNumber, gg.totalQuestionCount)
    gg.question_count_box.innerText = "Question " + gg.questionNumber + "/" + gg.totalQuestionCount
}

function getRandomCountry() {
    return(gg.remainingQuestions[Math.floor(Math.random()*gg.remainingQuestions.length)]);
}

function setNewRandomCountry(oldCountry) {
    gg.question_box = document.getElementById("text_box")
    gg.feedback_box = document.getElementById("feedback")

    gg.whereIs = getRandomCountry()
    if (!(isQuizOver())) {
        if (!(oldCountry == "none")) {
            // correctGuesses += 1
            if (gg.doCapitals) {
                // feedback_box.innerHTML = "Correct, that's " + calcCapitalFromCountry(oldCountry) + ", the capital of " + oldCountry
                gg.feedback_box.innerHTML = "Correct, that's " + oldCountry + ", whose capital is  " + calcCapitalFromCountry(oldCountry)
                gg.question_box.innerHTML = "What country is " + calcCapitalFromCountry(gg.whereIs) + " the capital of?"
            } else {
                gg.feedback_box.innerHTML = "Correct, that's " + oldCountry
                gg.question_box.innerHTML = "Where is " + gg.whereIs + "?"
            }

        } else {
            // feedback_box.innerHTML = "Click a country to start."
            if (gg.doCapitals) {
                gg.question_box.innerHTML = "What country is " + calcCapitalFromCountry(gg.whereIs) + " the capital of?"
            } else {
                gg.question_box.innerHTML = "Where is " + gg.whereIs + "?"
            }
        }
    }
    
}

function isQuizOver() {
    if (gg.remainingQuestions.length == 0) {
        let percent = Math.round(gg.points / (gg.totalQuestionCount * gg.pointsPerQuestion) * 100)
        // You scored " + points + "/" + totalQuestionCount * pointsPerQuestion + " (" + percent + "%)

        let extraText = ""
        if (gg.guesses_box.hidden == false) {
            extraText += " You got " + gg.correctGuesses + " guesses correct, and " + gg.incorrectGuesses + " incorrect."
        }
        if (gg.points_box.hidden == false) {
            extraText += " You got " + percent + "% score."
        }

        gg.feedback_box.innerHTML = "Quiz over." + extraText
        gg.question_box.innerHTML = ""
        gg.quizOver = true
        return true
    } else {
        return false
    }
}

function removeOldCountryFromList(country) {
    // console.log("removing " + country)
    const index = gg.remainingQuestions.indexOf(country);
        if (index > -1) {
            gg.remainingQuestions.splice(index, 1);
            // console.log(remainingQuestions)                  //for debugging
            // console.log("question list" + questionList)
        }
}

function skipQuestion() {
    removeOldCountryFromList(gg.whereIs)
    setNewRandomCountry('none')
    gg.feedback_box.innerHTML = ""
    isQuizOver()
    changeQuestionNumber()
}

function submitCountry(country) {
    if (gg.quizOver) {
        alert("The quiz is over.")
        return
    }

    if (gg.isCustomQuiz) {
        if (gg.excludeData.charAt(gg.fullCountryList.indexOf(country)) == "1") {
            if (gg.doCapitals) {
                alert(calcCapitalFromCountry(country) + " is not part of this quiz.")
            } else {
                alert(gg.country + " is not part of this quiz.")
            }
            return
        }
    }

    // console.log(country, whereIs)
    if (country == gg.whereIs) {
        // console.log("right country")
        gg.correctGuesses += 1
        updateGuessBox()

        changePointsBy(gg.pointsPerQuestion)
        changeQuestionNumber()
        removeOldCountryFromList(country)
        setNewRandomCountry(gg.whereIs)
    } else {
        // console.log("wrong country")
        gg.incorrectGuesses += 1
        updateGuessBox()

        if (gg.doCapitals) {
            gg.feedback_box.innerHTML = "Incorrect, that's " + calcCapitalFromCountry(country) + ", the capital of " + country + ". Try again."
        } else {
            gg.feedback_box.innerHTML = "Incorrect, that's " + country + ". Try again."
        }
        if (gg.doCapitals) {
            gg.question_box.innerHTML = "What country is " + calcCapitalFromCountry(gg.whereIs) + " the capital of?"
        } else {
            gg.question_box.innerHTML = "Where is " + gg.whereIs + "?"
        }
        
        changePointsBy(-1)
    }
}

function updateGuessBox() {
    gg.guesses_box.innerHTML = gg.correctGuesses + "/" + (gg.correctGuesses + gg.incorrectGuesses) + " guesses correct"
}

function calcCapitalFromCountry(country) {
    return(gg.fullCapitalList[gg.fullCountryList.indexOf(country)])
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
        gg.points_box.hidden = false
    } else {
        gg.points_box.hidden = true
    }

    if (values[1]) {
        gg.question_count_box.hidden = false
    } else {
        gg.question_count_box.hidden = true
    }

    if (values[2]) {
        gg.guesses_box.hidden = false
    } else {
        gg.guesses_box.hidden = true
    }
    
}

function customizeQuiz() {
    window.location.href = window.location.href.replace("quiz", "customize-quiz")
}

async function shareThisQuiz() {
    let finalString = window.location.href
    let backupString = structuredClone(finalString)

    let response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(finalString)}`)
    response = await response.text()
    response = response.slice(20)
    finalString = "https://" + window.location.hostname + "/q/" + response
    let shareMessage = "Copy the link below to share this quiz"

    let shareButtons = `<span style="color: black;">Share on: </span><div id="share-buttons" style="color:silver;"><span class="facebook" title="Share this on Facebook" onclick="openInNewTab('http://www.facebook.com/share.php?u=${finalString}'); return false;"><svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" width="25px"><path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path></svg></span><span class="twitter" title="Share this on Twitter" onclick="openInNewTab('https://twitter.com/intent/tweet?url=${finalString}&amp;text=Amazing%20site%20for%20learning%20geography'); return false;"><svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" width="25px"><path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z"></path></svg></span><span class="linkedin" title="Share this on Linkedin" onclick="openInNewTab('https://www.linkedin.com/sharing/share-offsite/?url=${finalString}'); return false;"><svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" width="25px"><path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z"></path></svg></span><span class="gplus" title="Share this on Google Plus" onclick="openInNewTab('https://plus.google.com/share?url=${finalString}'); return false;"> <svg viewBox="0 0 2304 1792" xmlns="http://www.w3.org/2000/svg" width="25px"><path d="M1437 913q0 208-87 370.5t-248 254-369 91.5q-149 0-285-58t-234-156-156-234-58-285 58-285 156-234 234-156 285-58q286 0 491 192l-199 191q-117-113-292-113-123 0-227.5 62t-165.5 168.5-61 232.5 61 232.5 165.5 168.5 227.5 62q83 0 152.5-23t114.5-57.5 78.5-78.5 49-83 21.5-74h-416v-252h692q12 63 12 122zm867-122v210h-209v209h-210v-209h-209v-210h209v-209h210v209h209z"></path></svg></span><span class="mail" title="Share this through Email" onclick="openInNewTab('mailto:?&amp;body=${finalString}&amp;subject=Share%20Geography%20Genius%20quiz'); return false;"> <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" width="25px"><path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path></svg></span></div>`

    Sweetalert2.fire({
        title: 'Share',
        html: `<span id="main-copy-text2">${shareMessage}</span><br><input type="text" readonly="readonly" id="finished-url2" onclick="copyQuizURL()" style="width: 400px;margin: 10px;font-size: 15px;"value="${finalString}"><br><br>${shareButtons}`,
        icon: 'success',
        confirmButtonText: 'Done'
    })
}

function copyQuizURL() {
    let copyText = document.getElementById("finished-url2")
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    
    // Alert the copied text
    document.getElementById("main-copy-text2").innerHTML = "Copied to clipboard!"
}