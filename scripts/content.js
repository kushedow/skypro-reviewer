// глобальный объект для хранения чеклиста
checklist = {}

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        if (request.message === "show_checklist") {

            showSoftBox()

            // вытаскиваем из переданного события адрес чеклиста
            getReviewContainer(".review-assistant")

            const checklistURL =  request.source
            const sheet_id = checklistURL.split("/").reduce((a, b) => a.length > b.length ? a : b)

            // загружаем с сервера чеклист
            const checklistObject = await loadChecklistFromServer(sheet_id)
            
            // записываем в глобальную переменную чеклист
            checklist = checklistObject
            console.log(checklist)

            // отображаем чеклист в DOM
            await feedbackRender.renderChecklist(checklistObject)
            registerHandlers()

            // отдаем сигнал, что чеклист загружен
            sendResponse({result: "Block added"});

        }

        else if (request.message ==="autoload_checklist"){

            showSoftBox()

            // вытаскиваем из переданного события адрес чеклиста
            getReviewContainer(".review-assistant")

            // загружаем с сервера чеклист
            const checklistObject = await loadChecklistFromServer()

            if (checklistObject) {
                checklist = checklistObject
                // отображаем чеклист в DOM
                await feedbackRender.renderChecklist(checklistObject)
                registerHandlers()
            }

            sendResponse({result: true});

        }


        else if (request.message ==="detect_task_name"){
            const ticketData = getTicketData()
            sendResponse({result: ticketData});

        }

        return true

    });



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'urlChanged') {
        // Запрашиваем наличие критериев
        checkForCriteria()
    }
});
