function getCurrentEditorValue() {

    /* Вытаскиваем содержание контейнера ревью */
    const editorElement = document.querySelector(".message-request .ql-editor")
    return editorElement.innerHTML

}

function saveReviewToEditor(content) {

    /* Записывает текст в контейнер */
    const editorElement = document.querySelector(".message-request .ql-editor")
    editorElement.innerHTML = content
}

function showAlertBox(message="", status="info"){

    const container = getReviewContainer()

    let alertBox = container.querySelector(".review-assistant__alert")

    if (!alertBox) {
        alertBox = document.createElement("div")
        container.append(alertBox)
    }

    alertBox.innerHTML = message
    alertBox.className = "";
    alertBox.classList.add("review-assistant__alert")
    alertBox.classList.add("review-assistant__alert--"+status)

}


function retrieveFormData() {

    /* Загружает данные из формы в глобальный объект чеклиста  */

    const form = document.getElementById('checklist__form');
    const formData = new FormData(form);

    for (const checklistItem of Object.values(checklist)) {

        const radio_name = "checklist__" + checklistItem.index
        checklist[checklistItem.index].grade = formData.get(radio_name)

        const note_name = "note__" + checklistItem.index
        checklist[checklistItem.index].note = formData.get(note_name)
    }
}

function highlightCheckboxGroup(GroupIndex, grade) {

    /* Подсвечивает кружочек у критерия после простановки оценки */
    const detailsNode = document.getElementById('checklist__details__' + GroupIndex);
    detailsNode.removeAttribute("class");
    detailsNode.classList.add("checklist__grade--"+grade)

}

function getRandomLoaderText() {

    /* Случайное сообщение во время ожидания */
    const preloaders = [
        'Подождите несколько секунд, ставим свечку за здоровье техлида...',
        'Роемся в пачке с гугл-таблицами, еще несколько секунд...',
        'Ожидайте ... удаляем цитаты про волка...',
        'Подождите, получаем альтушку на госуслугах...',
        'Пару секунд ... Обучаем нейронку на цитатах Харитона...'
    ];
    const index = Math.floor(Math.random() * preloaders.length);
    return preloaders[index];
}


function getReviewContainer(querySelector = ".review-assistant") {

    /* Создает контейнер для критериев */
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
    reviewHeader.innerHTML = "<div class='review-assistant__alert review-assistant__alert--info'>Критерии загружаются ... </div>"
    reviewContainer.append(reviewHeader)

    return reviewContainer
}


function getTicketData(){

    /* Выгружаем все полезные данные со странички чтобы отправить на сервер */
    const dataNodes = document.querySelectorAll(".info > .info-item > span.info-value");
    // Имя студента - полное и короткое
    const studentFullName = dataNodes[0].innerHTML
    const studentFirstName = studentFullName.split(" ")[0].trim()

    // Название потока
    const taskName = dataNodes[1].innerHTML.split(" / ")[0].trim()
    // Название потока
    const streamName = dataNodes[1].innerHTML.split(" / ")[1].trim()
    // Имя ментора
    const mentorFullName = dataNodes[2].innerHTML.trim()
    // Ссылку на критерииы
    const criteriaNode = document.querySelector('a[href^="https://docs.google.com/spreadsheets"]');
    let criteriaURL = criteriaNode ? criteriaNode.attributes.getNamedItem("href").value : "";

    // ID ученика
    const PageViewNode = document.querySelector("app-ticket-page-view")
    const studentID = parseInt(PageViewNode.getAttribute("data-studentid"))


    return {
        ticket_id: window.location.pathname.split("/").pop(),
        student_full_name: studentFullName,
        student_first_name: studentFirstName,
        student_id: studentID,
        task_name: taskName,
        stream_name: streamName,
        mentor_full_name: mentorFullName,
        criteria_url: criteriaURL
    }
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

        reviewContainer.innerHTML = this.render(this.templateCode, checklistItems)
    }
}


function renderImprovedReview(AIFeedback, currentFeedback){

    /* Добавляем результат генерации мотивашки от нейронки*/

    const AIBlocks = AIFeedback.split("///")
    const AIFeedbackBefore = AIBlocks[0].trim()

    let AIFeedbackAfter = AIBlocks[1] ? AIBlocks[1].trim() : "";

    saveReviewToEditor(AIFeedbackBefore + "\n" + currentFeedback + "\n" + AIFeedbackAfter)

}

function updateHeight(node) {

    node.style.height = 'auto';
    node.style.height = node.scrollHeight + 'px';

}

function expandReview() {

    const details =  document.querySelectorAll("#checklist__form details")
    details.forEach(element => {
        element.setAttribute("open", "true");
    })

}