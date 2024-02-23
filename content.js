promptDefault = "Преставь что ты преподаватель программирования на Python и провряшь работу студента. Между словами \"Начало\" и \"Конец\" приведен результат проверки ученика по чеклисту. Тебе нужно написать дружелюбную, профессиональную обратную связь. Начни с приветствия. Во время написания обратной связи, обращайся к студенту только на \"ты\". Обратная связь должна содержать 3 предложения.\n" +
    "\n" +
    "\n" +
    "Если в тексте все пункты отмечены значком \"✅\" назови работу отличной, блестящей или напиши что тебе было приятно ее проверять.\n" +
    "\n" +
    "Если в тексте есть значки \"✴️\", назови работу неплохой и скажи, что, хотя решение в целом выполнено верно, ты можешь предложить варианты, как его можно улучшить.\n" +
    "\n" +
    "Если в тексте присутствует значок ❌, назови работу хорошей и скажи, что нужно исправить совсем немного недочетов и сдать работу снова и ты сразу ее примешь.\n" +
    "\n" +
    "Если в тексте несколько значков \"❌\", назови работу неплохой и скажи, что нужно приложить еще немного усилий, чтобы выполнить задание, скажи, что ждешь новую версию и всегда готов ответить на вопросы или помочь со сложностями.\n" +
    "\n" +
    "\n"


checklist = {}

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

function registerHandlers() {
    generateButton = document.getElementById("checklist__form__generate")
    generateButton.addEventListener("click", buildReview)

    improveButton = document.getElementById("checklist__form__improve")
    improveButton.addEventListener("click", improveReview)

}

async function loadPromptFromOptions(){

    const promptSavedData = await chrome.storage.sync.get(["promptValue"])
    promptValue =  promptSavedData["promptValue"] || promptDefault;
    return promptValue
}

async function improveReview(){

    promptCurrent = await loadPromptFromOptions()
    promptBefore = "<НАЧАЛО>"
    promptAfter = "<КОНЕЦ>"

    retrieveFormData()
    const currentFeedback = getCurrentEditorValue()
    // Показываем случайный текст ожидания загрузки
    saveReviewToEditor(getRandomLoaderText())
    // Загружаем промпт из настроек

    promptFull = promptCurrent + " \n\n " + promptBefore + currentFeedback + promptAfter

    const result = await fetchAI(promptFull)
    saveReviewToEditor(result+"\n\n\n"+currentFeedback)

}

function buildReview() {
    retrieveFormData()
    feedback = buildFeedback()
    saveReviewToEditor(feedback)
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


async function fetchAI(prompt) {

    console.log("Запрашивем у нейронки промпт")

    const response = await fetch("https://skypro-reviewer.onrender.com/generate", {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({q: prompt})
    });

    if (response.status !== 200) {
        alert("Не удалось обратиться к нейронке. Обратитесь к разработчику")
        return null
    }

    const result = await response.json();

    console.log("Получен ответ от нейронки")
    console.log(result.response)

    return result.response


}


async function loadChecklist(checklistURL) {

    let result = {};

    try {
        const response = await fetch(checklistURL); // завершается с заголовками ответа
        if (response.status !== 200) {
            alert("Не удалось загрузить критерии. Обратитесь к разработчику")
            return null
        }
        result = await response.json(); // читать тело ответа в формате JSON
    }
    catch (error) {
        alert("Ошибка при загрузке критериев. Обратитесь к разработчику")
        return null
    }

    const indexedChecklist = result.reduce((acc, item, index) => {
        acc[index] = {index, ...item};
        return acc;
    }, {});

    return indexedChecklist

}

function buildFeedback() {

    emojis = {5: "✅", 4: "✴️", 3: "❌"}

    feedbackPoints = []

    for (const checklistItem of Object.values(checklist)) {

        if (checklistItem.grade == null) {
            continue;
        }

        gradeIcon = emojis[checklistItem.grade]
        gradeText = checklistItem[checklistItem.grade]
        reviewPointResult = `${gradeIcon} ${gradeText}`
        feedbackPoints.push(reviewPointResult)
    }

    return feedbackPoints.join('\n')

}

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


chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        if (request.message === "show_checklist") {

            console.log(`Showing Review Checklist ${request.source}`)

            getReviewContainer(".review-assistant")

            const checklistObject = await loadChecklist(request.source)
            checklist = checklistObject
            console.log(checklist)
            await feedbackRender.renderChecklist(checklistObject)

            registerHandlers()
            sendResponse({result: "Block added"});
            return true
        }
    });

// загружаем шаблон проверки


console.log("content scripts initialised")
