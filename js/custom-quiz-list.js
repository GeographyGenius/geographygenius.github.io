window.onload = requestData()

async function requestData() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyB0uZhfFaNyIQIsxz1KhxvyOE7ooXlWp4GVpZOljasiKOm2rGI7cxSuS0FFZqArX1E_w/exec?action=getlist")
        let quizList = await response.json()
        quizList = quizList.urlList
        console.log(`Quiz list: ${quizList}`)

        let listTable = document.getElementById("quiz-list-table")
        let url
        let title
        for (let i = 0; i < quizList.length; i++) {
            url = quizList[i]
            var searchParams = new URLSearchParams(url.slice(url.indexOf("?")))
            let baseTitle = toTitleCase(searchParams.get("quiz").replaceAll("-", " "))
            if (searchParams.has("t")) {
                title = baseTitle + " - " + searchParams.get("title")
            } else {
                title = baseTitle + " - Custom Quiz"
            }
            listTable.innerHTML += `<tr><td><a class="a-list" href="${url}">${title}</a></td></tr>`
        }

        listTable.hidden = false
        document.getElementById("fetching-data").hidden = true
        document.getElementById("custom-quizzes-footer").hidden = false
    }
    catch {
        document.getElementById("fetching-data").innerHTML = "Failed to load custom quizzes - Check back later"
    }
}