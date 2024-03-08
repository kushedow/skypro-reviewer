function getCurrentEditorValue() {
    const editorElement = document.querySelector(".message-request .ql-editor")
    return editorElement.innerHTML

}

function saveReviewToEditor(content) {
    const editorElement = document.querySelector(".message-request .ql-editor")
    editorElement.innerHTML = content
}


function retrieveFormData() {

    // Сначала получаем ссылку на форму по её идентификатору
    const form = document.getElementById('checklist__form');
    // Затем создаём новый экземпляр объекта FormData, передавая ему нашу форму
    const formData = new FormData(form);
    for (const checklistItem of Object.values(checklist)) {
        field_name = "checklist__" + checklistItem.index
        value = formData.get(field_name)
        checklist[checklistItem.index].grade = value
    }

}

function getRandomLoaderText() {
    const preloaders = ['Подождите несколько секунд, ставим свечку за здоровье техлида...', 'Роемся в пачке с гугл-таблицами, еще несколько секунд...', 'Ожидайте ... удаляем цитаты про волка...', 'Подождите, получаем альтушку на госуслугах...', 'Пару секунд ... Обучаем нейронку на цитатах Харитона...'];
    const index = Math.floor(Math.random() * preloaders.length);
    return preloaders[index];
}


function getReviewContainer(querySelector = ".review-assistant") {

    let reviewContainer = document.querySelector(querySelector)

    // Если контейнер уже есть – возвращаем
    if (reviewContainer) {
        return reviewContainer
    }

    // Если контейнера нет – создаем его
    const pageContentContainer = document.querySelector(".page-content")
    reviewContainer = document.createElement('section');
    pageContentContainer.prepend(reviewContainer);
    reviewContainer.classList.add("review-assistant")

    //  Добавляем заголовок к контейнеру
    const reviewHeader = document.createElement('h3');
    reviewHeader.innerHTML = "Критерии загружаются ..."
    reviewContainer.append(reviewHeader)

    return reviewContainer
}


function getCheckListLink() {
    const links = document.querySelectorAll('a[href^="https://docs.google.com/spreadsheets"]');
    for (const linkNode of links) {
        if (linkNode.textContent.includes('Чеклист решения')) {
            return linkNode.attributes.getNamedItem("href").value; // Возвращаем найденную ссылку и останавливаем поиск
        }
    }
}

function getUserName() {
    // Вытаскиваем имя ученика
    const nameNode = document.querySelector(".info > .info-item > span.info-value");

    const fullName = nameNode.innerHTML.split(" ")
    return {first: fullName[0], full: `${fullName[0]} ${fullName[1]}`}

}

function getTicketID(){
    return window.location.pathname.split("/").pop();
}


feedbackRender = {

    templateCode: null,
    render: render,

    loadTemplate: async function () {
        const response = await fetch(chrome.runtime.getURL('templates/checklist.html'))
        return await response.text()
    },

    renderChecklist: async function (checklistObject = {}, querySelector = ".review-assistant",) {

        const reviewContainer = getReviewContainer(querySelector)
        if (!this.templateCode) {
            this.templateCode = await this.loadTemplate();
        }

        const checklistItems = {items: Object.values(checklistObject)}

        const checklistRendered = this.render(this.templateCode, checklistItems)
        reviewContainer.innerHTML = checklistRendered
    }
}

function getCriteriaContainer(){

    const parentSelector = ".mark-container"
    const containerSelector = ".mark-container .message-container__criteria"

    let criteriaContainer = document.querySelector(containerSelector)

    // Если контейнер уже есть – возвращаем
    if (criteriaContainer) {
        return criteriaContainer
    }

    // Если контейнера нет – создаем его
    const parentContainer = document.querySelector(parentSelector)

    criteriaContainer = document.createElement('div');
    criteriaContainer.classList.add("message-container__criteria")
    parentContainer.prepend(criteriaContainer)

    return criteriaContainer

}

function renderCriteria(criteriaResults, container) {

    const emojis = {5: "✅", 4: "⚠️️", 3: "❌"}

    /** Выводит критерии под кнопками */

    container.innerHTML=""

    if (criteriaResults.length === 0) { return }

    const criteriaHeader = document.createElement("h3")
    criteriaHeader.innerHTML = "Критерии для рубрикатора"
    container.append(criteriaHeader)

    criteriaResults.forEach((criteria) => {
        const elementToPush = document.createElement("div");
        elementToPush.classList.add("message-container__criteria__item")
        elementToPush.innerHTML = `${emojis[criteria.value]} ${criteria.name}: ${criteria.value}`
        container.append(elementToPush)
    })

}