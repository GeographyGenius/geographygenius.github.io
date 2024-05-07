if (window.location.pathname.includes("/q/")) {
    document.getElementsByTagName("title")[0].innerHTML = "Redirecting..."
    document.getElementById("redirect-message").hidden = false
    let redirectURL = "https://tinyurl.com/" + window.location.pathname.slice(3)
    location.href = redirectURL
    // try {
    //     let response = httpGet(redirectURL)
    //     if (response.includes("Geography Genius - Quiz") && response.includes("Loading quiz...")) {
    //         window.location.href = redirectURL
    //     } else {
    //         window.location.href = "/404"
    //     }
    // }
    // catch(err) {
    //     console.log("Error - " + err)
    //     window.location.href = "/404"
    // }
} else {
    document.getElementById("actually-everything").hidden = false
    document.getElementsByTagName("title")[0].innerHTML = "404 - Page Not Found - Geography Genius"
}