async function improveReview() {
    /* Обрабатываем нажатие на "Улучшить с помощью AI" */

    // Получаем текущий текст рецензии
    const currentFeedback = getCurrentEditorValue()

    // Показываем случайный текст ожидания загрузки
    saveReviewToEditor(getRandomLoaderText())

    // Получаем мотивашку от нейронки
    const result = await fetchAIByConfiguredPromptName(currentFeedback)

    // Показываем сгенерированный
    renderImprovedReview(result, currentFeedback)

}


async function loadPromptNameFromOptions() {
    /*  Вспоминаем, какой активный промпт у наставника */
    const optionData = await chrome.storage.sync.get(["promptName"])
    return optionData["promptName"]

}

async function fetchAIByConfiguredPromptName(feedbackBody) {
    /*  Генерируем мотивирующий фидбек на сервере */

    let promptName = await loadPromptNameFromOptions()

    if (promptName === undefined) {
        alert("Промпт не настроен, перейдите в параметры. Правой кнопкой на иконке плагина >> Параметры")
        return null
    }

    const fetchData = {
        ...getTicketData(),
        prompt_name: promptName, // выбранный в настройках промпт
        feedback_body: feedbackBody  // что сейчас в фидбеке
    }

    console.log("Запрашивем у нейронки промпт")

    const response = await fetch(SERVERURL + "/generate-motivation", {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(fetchData)
    })

    if (response.status !== 200) {
        alert("Не удалось обратиться к нейронке. Обратитесь к разработчику")
        return null
    }

    const result = await response.json();

    return result.response

}