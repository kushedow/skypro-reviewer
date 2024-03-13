SERVERURL = "https://skypro-reviewer.onrender.com"

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


async function loadPromptFromOptions() {
    /**
     * Загружающем сохраненное значение промпта из синхронного хранилища Chrome и возвращающем его, если оно есть.
     * Если значение не найдено, возвращаем промпт по умолчанию
     */
    const promptSavedData = await chrome.storage.sync.get(["promptValue"])
    promptValue = promptSavedData["promptValue"] || promptDefault;
    return promptValue
}


async function improveReview() {

    const userName = getTicketData().student_first_name

    promptCurrent = await loadPromptFromOptions()
    promptBefore = "<НАЧАЛО>"
    promptAfter = "<КОНЕЦ>"

    retrieveFormData()
    const currentFeedback = getCurrentEditorValue()
    // Показываем случайный текст ожидания загрузки
    saveReviewToEditor(getRandomLoaderText())
    // Загружаем промпт из настроек

    promptFull = promptCurrent + ` \n\n Имя ученика: ${userName} \n\n` + promptBefore + currentFeedback + promptAfter

    const result = await fetchAI(promptFull)
    saveReviewToEditor(result + "\n" + currentFeedback)

}

async function fetchAI(prompt) {

    /**
     * Передаем чеклист вместе с настроенным промптом на сервер
     * Сервер отправляет запрос на OPEN AI, запрос синхронный, работает долго
     */


    const fetchData = {
        ...getTicketData(),
        q: prompt
    }

    console.log("Запрашивем у нейронки промпт")
    console.log(fetchData)

    const response = await fetch(SERVERURL+"/generate", {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(fetchData)
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


async function loadChecklistFromServer(sheet_id) {

    function _convertListToIndexedObject(raw_checklist) {
        const indexedChecklist = raw_checklist.reduce((acc, item, index) => {
            acc[index] = {index, ...item};
            return acc;
        }, {});
        return indexedChecklist
    }

    /**
     * Загружаем чеклист из гугл-дока через сервер
     * Формат [{title: ... , 5: ... , 4: ... , 3: ... , topic: ... , group: ... , solution: ... }]
     */

    let result = {};

    const url = new URL(SERVERURL+"/checklist")

    const fetchData = {
        ...getTicketData(),
        sheet_id: sheet_id
    }

    console.log("Запрашиваем чеклист с сервера")
    console.log(fetchData)

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(fetchData)
        });

        if (response.status !== 200) {
            alert("Не удалось загрузить критерии. Обратитесь к разработчику")
            return null
        }

        result = await response.json(); // читать тело ответа в формате JSON

    } catch (error) {
        alert("Ошибка при загрузке критериев. Обратитесь к разработчику")
        return null
    }

     const indexedChecklist = _convertListToIndexedObject(result)

     return indexedChecklist

}


async function reportChecklistToServer(event) {

    /**
     * Отправляем результат проверки на сервер в формате полного чеклиста
     * Там на сервере разберемся, что за данные пришли
     */

    const reportData = {
        ...getTicketData(),
        checklist_data: checklist
    }

    const url = new URL(SERVERURL+"/report")

    console.log("Sending report to server", url)
    console.log(reportData)


    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(reportData)
        });

        // Проверка статуса HTTP ответа
        if (response.ok) { // Если статус код в диапазоне 200-299
            // Попытка прочитать и вывести тело ответа как JSON
            const jsonData = await response.json();
            console.log("Отчет принят сервером, полученф данные:", jsonData);
        } else {
            // Вывод ошибки, если статус код !=200
            console.error("Ошибка:", response.status);
            // Попытка прочитать тело ответа для получения дополнительной информации
            try {
                const errorData = await response.json(); // Предполагается, что сервер отправляет ошибку в формате JSON
                console.error("Данные ошибки:", errorData);
            } catch (errorParsingError) {
                console.error("Не удалось распарсить данные ошибки.");
            }
        }
    } catch (error) {
        // Если возникла ошибка при отправке запроса или во время выполнения кода обработчика
        console.error("Ошибка при оправке отчета:", error);
    }

}

