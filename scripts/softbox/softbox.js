function showSoftBox(){

    softSkills = [
        {key: "soft_1", title: "Не сдается и ищет решения", hint: "✅ Не сдается, ищет решения, сохраняет вовлеченность и не поддается фрустрации, понимает как его действия и бездействия отражаются на результате. \n❌ говорит что у него лапки"},
        {key: "soft_2", title: "Понятно и вежливо пишет", hint: ""},
        {key: "soft_3", title: "Норм реагирует на критику", hint: ""},
        {key: "soft_4", title: "Находит нестандартные решения", hint: ""},
        {key: "soft_5", title: "Читает и понимает инструкции", hint: ""},
        {key: "soft_6", title: "Системный, без бардака в голове", hint: "Наставник всегда может оценить отсутсвие системного подхода, но не всегда может оценить его наличие. Наставник по заданию может может видеть - есть ли в голове студента фарш?"},
    ]

    // only if setting is activated

    chrome.storage.sync.get('softboxOn', function(items) {
        softboxOn = items.softboxOn

        if (softboxOn === "true") {

            const parentContainer = document.querySelector("skypro-message-request")
            const SoftBoxContainer = document.createElement('div');
            SoftBoxContainer.classList.add("softbox")
            parentContainer.append(SoftBoxContainer)
            renderFromTemplate(".softbox", "softbox", {skills: softSkills}).then()

        }
    });

}


function retrieveSoftboxData() {

    /* Загружает данные из софтбокса и возврашает в виде объекта ключ-значение */

    const form = document.getElementById('softbox__form');
    const formData = new FormData(form);
    let skills = {}

    for (let [key, value] of formData.entries()) {
        skills[key]= value
    }

    return skills
}


