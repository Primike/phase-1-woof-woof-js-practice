let dogs 
let filter = false

document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:3000/pups`)
    .then(function(response) {
        return response.json();
    })
    .then(function(json){
        dogs = json
        addDog(json)
        let filterButton = document.getElementById('good-dog-filter')
        filterButton.addEventListener('click', filterDogs)
    })
});

function addDog(array) {
    let dogsDiv = document.getElementById('dog-bar')
    dogsDiv.innerHTML = ''

    for(const i of array) {
        let dogSpan = document.createElement('span')
        dogSpan.innerHTML = i.name
        dogSpan.id = `${i.id}`
        dogSpan.addEventListener('click', showDogInfo)

        dogsDiv.appendChild(dogSpan)
    }
}

function showDogInfo(e) {
    let doginfo = document.getElementById('dog-info')
    doginfo.innerHTML = ''

    let dogImage = document.createElement('img')
    dogImage.src = dogs[e.target.id - 1].image

    let dogName = document.createElement('h2')
    dogName.innerHTML = dogs[e.target.id - 1].name

    let dogButton = document.createElement('button')
    dogButton.className = e.target.id
    dogButton.innerHTML = dogs[e.target.id - 1].isGoodDog ? 'Good Dog!': 'Bad Dog!'
    dogButton.addEventListener('click', toggleGoodDog)

    doginfo.appendChild(dogImage)
    doginfo.appendChild(dogName)
    doginfo.appendChild(dogButton)
}

function toggleGoodDog(e) {
    dogs[e.target.className - 1].isGoodDog = dogs[e.target.className - 1].isGoodDog ? false : true
    fetch(`http://localhost:3000/pups/${e.target.className}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
            isGoodDog: dogs[e.target.className - 1].isGoodDog,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
            let dogButton = document.getElementsByClassName(`${e.target.className}`)[0]
            dogButton.innerHTML = dogs[e.target.className - 1].isGoodDog ? 'Good Dog!': 'Bad Dog!'
        });
}

function filterDogs() {
    let goodDogFilter = document.getElementById('good-dog-filter')

    if(filter == false) { 
        filter = true
        goodDogFilter.innerHTML = "Filter good dogs: ON"

        let dogsCopy = [...dogs]
        dogsCopy = dogsCopy.filter(x => x.isGoodDog == true)

        addDog(dogsCopy)
    } else {
        filter = false
        goodDogFilter.innerHTML = "Filter good dogs: OFF"

        addDog(dogs)
    }
}