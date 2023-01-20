// To ensure Cypress tests work as expeded, add any code/functions that you would like to run on page load inside this function

function run() {
    // Add code you want to run on page load here
    var films = []
    var selectedFilm = undefined
    var len = undefined
    var filmTitles = document.getElementById("titles")
    var reviewList = document.querySelector("ul");
    var showPeopleBtn = document.getElementById("show-people")
    var submitBtn = document.getElementById("submit-btn")
    var resetBtn = document.getElementById("reset-reviews")


    var url = "https://resource-ghibli-api.onrender.com"

    fetch(url + "/films")
        .then((res) => res.json())
        .then((resJson) => {
            films = resJson
            films.forEach((film) => {
                filmTitles.add(new Option(film.title, film.id));
            });
        });

    for (var i = 0, len = localStorage.length; i < len; ++i) {
        if (localStorage.key(i).includes("rexiew")) {
            reviewList.innerHTML += `<li><strong>${ localStorage.key(i).replace("rexiew", "")}: </strong>${localStorage.getItem(localStorage.key( i ))}</li>`
        }
    }


    filmTitles.addEventListener('change', () => {
        var value = filmTitles.value;
        console.log(value)
        if (value == undefined || value == "" || value == false) {
            selectedFilm = undefined
        } else {
            selectedFilm = films.filter((film) => film.id == value)[0]
            document.getElementById("display-info").innerHTML = `<h3>${selectedFilm.title}</h3><p>${selectedFilm.release_date}</p><p>${selectedFilm.description}</p>`
            var orderedList = document.querySelector("ol")
            orderedList.innerHTML = ""
        }
    });

    showPeopleBtn.addEventListener('click', () => {
        if (selectedFilm != undefined) {
            var orderedList = document.querySelector("ol")
            orderedList.innerHTML = ""
            if (selectedFilm.people.length == 1) {
                selectedFilm.people.forEach((person) => {
                    console.log(person)
                    fetch(url + person)
                        .then((res) => res.json())
                        .then((personData) => {
                            personData.forEach(filmPerson => {
                                orderedList.innerHTML += `<li>${filmPerson.name}</li>`
                            })
                        });
                });

            } else {
                selectedFilm.people.forEach((person) => {
                    fetch(url + person)
                        .then((res) => res.json())
                        .then((personData) => {
                            console.log(personData)
                            orderedList.innerHTML += `<li>${personData.name}</li>`
                        });
                });
            }
        }
    });

    submitBtn.addEventListener('click', (event) => {
        event.preventDefault()
        if (selectedFilm == "" || selectedFilm == undefined) {
            alert("Please select a movie first")
        } else {
            var review = document.getElementById("review").value;

            localStorage.setItem(selectedFilm.title + "rexiew", review)

            reviewList.innerHTML += `<li><strong>${selectedFilm.title}: </strong> ${review}</li>`

            document.getElementById("review").value = ""
        }
    });

    resetBtn.addEventListener('click', () => {
        localStorage.clear();
        reviewList.innerHTML = "";
    });
}

// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now
// A non-hacky solution is being researched

setTimeout(run, 1000);