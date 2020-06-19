
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res =>  res.json() )
    .then( states => {
        for( const state of states ){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
        
    } )
}

populateUFs()


function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue  = event.target.value

    const indexofSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexofSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res =>  res.json() )
    .then( cities => {  
        for( const city of cities ){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    } )
}


document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// items de coleta

const itemsToCollet = document.querySelectorAll(".items-grid li")

for (let item of itemsToCollet) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem (event){
    const itemLi = event.target

    // Add or remove class in JavaScript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // console.log("Item ID: ", itemId)

    // Verificar se existem items selecionados.
    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId // True or False
        return itemFound
    })

    // remover items.
    if(alreadySelected >= 0) {
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems
    }else {
        // add items.
        selectedItems.push(itemId)
    }

    // console.log('SelectedItems: ', selectedItems)

    collectedItems.value = selectedItems

    
}