window.onload = requestData()

async function requestData() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxuVE78lEri1BvpA6tPom8iBDRx40BQodrbtUInENdoBa3WUWWj5wahjWT9XG33C_IUTQ/exec?action=getlist"/*"https://script.google.com/macros/s/AKfycbyB0uZhfFaNyIQIsxz1KhxvyOE7ooXlWp4GVpZOljasiKOm2rGI7cxSuS0FFZqArX1E_w/exec?action=getlist"*/)
        let json = await response.json()
        let quizList = json.urlList
        let dateList = json.datesList
        console.log(`Quiz list: ${quizList}`)

        let listTable = document.getElementById("quiz-list-table")
        let url
        let date
        let title
        for (let i = 0; i < quizList.length; i++) {
            url = quizList[i]
            date = dateList[i]
            var searchParams = new URLSearchParams(url.slice(url.indexOf("?")))
            let baseTitle = toTitleCase(searchParams.get("q").replaceAll("-", " "))
            if (searchParams.has("t")) {
                title = baseTitle + " - " + atob(searchParams.get("t"))
            } else {
                title = baseTitle + " - Custom Quiz"
            }
            let link = document.createElement("a")
            link.classList = "a-list"
            link.href = url
            link.innerText = title
            newRow = document.createElement("tr")
            dateElement = document.createElement("td")
            dateElement.innerText = date
            listTable.appendChild(dateElement)
            linkElement = document.createElement("td")
            linkElement.appendChild(link)
            newRow.appendChild(dateElement)
            newRow.appendChild(linkElement)
            listTable.appendChild(newRow)
            // listTable.innerHTML += `<tr><td>${date}</td><td><a class="a-list" href="${url}">${title}</a></td></tr>`
            // unsafe because quiz title could be dangerous - changed to use innerText instead of innerHTML
        }

        listTable.hidden = false
        document.getElementById("fetching-data").hidden = true
        document.getElementById("custom-quizzes-footer").hidden = false
    }
    catch {
        document.getElementById("fetching-data").innerHTML = "Failed to load custom quizzes - Check back later"
    }
}