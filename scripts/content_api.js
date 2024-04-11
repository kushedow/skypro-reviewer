SERVERURL = "https://skypro-reviewer.onrender.com"


function _convertListToIndexedObject(raw_checklist) {
    const indexedChecklist = raw_checklist.reduce((acc, item, index) => {
        acc[index] = {index, ...item};
        return acc;
    }, {});
    return indexedChecklist
}

async function loadChecklistFromServer(sheet_id=null) {

    /**
     * Загружаем чеклист из гугл-дока через сервер
     * Формат [{title: ... , 5: ... , 4: ... , 3: ... ,  group: ... , hint: ... }]
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
            console.log("Не удалось загрузить критерии. Обратитесь к разработчику")
            console.log(await response.json())
            return null
        }

        result = await response.json(); // читать тело ответа в формате JSON

    } catch (error) {
        console.log("Ошибка при загрузке критериев. Обратитесь к разработчику")
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

