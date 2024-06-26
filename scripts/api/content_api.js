SERVERURL = "https://skypro-reviewer.onrender.com"

function _convertListToIndexedObject(raw_checklist) {
    let previous = null;
    return raw_checklist.reduce((acc, item, index) => {
        const show_group = previous === null || previous.group !== item.group;
        acc[index] = {index, ...item, show_group};
        previous = item;
        return acc;
    }, {});
}


async function loadChecklistFromServer(sheet_id=null) {

    /**
     * Загружаем чеклист из гугл-дока через сервер
     * Формат [{title: ... , 5: ... , 4: ... , 3: ... ,  group: ... , hint: ... }]
     */

    let result = {};
    const ticketData = getTicketData()
    const url = new URL(SERVERURL+"/checklist")

    /* Если указан id документа – отправляем запрос  с ним, если нет – без него */

    const fetchData = sheet_id ? { ...ticketData, sheet_id } : { ...getTicketData() };

    if (sheet_id) {
        showAlertBox("Загружаем критерии по id чеклиста", "info")
    } else {
        showAlertBox("Загружаем критерии по названию задания", "info")
    }

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(fetchData)
        });

        if (response.status === 400) {
            showAlertBox("Не удалось загрузить критерии. Обратитесь к разработчику", "warning")
            console.log("Не удалось загрузить критерии.")
            console.log(await response.json())
            return null
        }

        else if (response.status === 404) {
            showAlertBox("Для этого задания еще нет чеклиста.", "warning")
            return null
        }

        result = await response.json(); // читать тело ответа в формате JSON

    } catch (error) {
        showAlertBox("Не удалось загрузить критерии. Обратитесь к разработчику", "warning")
        console.log("Не удалось загрузить критерии. Обратитесь к разработчику")
        return null
    }

    return _convertListToIndexedObject(result)

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
            console.log("Отчет принят сервером, получены данные:", jsonData);
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

async function reportSoftSkillsToServer(){

    const reportData = {
        ...getTicketData(),
        skills: retrieveSoftboxData()
    }

    const url = new URL(SERVERURL+"/report-soft-skills")

    const response = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(reportData)
    });


}



