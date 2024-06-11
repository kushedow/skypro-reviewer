const COURSEWORKREVIEWS = {

          "Курсовая 4. ООП" :  "Поздравляю тебя с успешным прохождением модуля по ООП! Ты уже прошел половину пути к освоению профессии Python-разработчик.\n" +
            "\n" +
            "Модуль был непростым, но ты справился!\n" +
            "\n" +
            "Мы подготовили для тебя индивидуальный список освоенных и неосвоенных навыков по пройденному модулю. В нем ты найдешь не только оценку своих достижений, но и полезные ссылки, которые помогут тебе прокачать те навыки, которые еще требуют доработки.\n" +
            "\n" +
            "Не расстраивайся, если в списке есть неосвоенные навыки – это абсолютно нормально! Обучение – это непрерывный процесс, и каждый день ты будешь делать шаг вперед. Используй предоставленные материалы, чтобы закрепить пройденные темы и уверенно двигаться к цели.\n" +
            "\n" +
            "Уверены, что ты справишься со всеми трудностями и освоишь все необходимые навыки. Ведь ты уже на полпути к цели!",

          "Курсовая 5. Работа с базами данных": "Модуль \"Работа с базами данных\" позади! Давай посмотрим, как ты справился.\n" +
              "\n" +
              "Я подготовил список твоих навыков: какие ты уже освоил, а над чем еще стоит поработать. Не бойся, если что-то не получилось – это нормально! Обучение – это как прокачка персонажа: чем больше опыта, тем ты круче.\n" +
              "\n" +
              "В списке ты найдешь ссылки на материалы, которые помогут тебе прокачать нужные скиллы. Не стесняйся их использовать!\n" +
              "\n" +
              "Удачи в дальнейшем обучении и не переставай верить в себя!",

          "Курсовая 6. Основы веб-разработки на Django": "Ты просто молодец, тебе удалось справиться с модулем по Django! Ну как, уже чувствуешь себя настоящим разработчиком?\n" +
              "\n" +
              "Мы подготовили чек-лист твоих крутых достижений: список того, что  уже освоено на отлично, и что можно еще подтянуть. Помни, что западающие навыки – это не повод расстраиваться, а возможность прокачаться!\n" +
              "\n" +
              "Ты уже совсем близок к диплому, осталось всего пара модулей. Уверены, у тебя получится ь преодолеть все препятствия на своем пути!\n" +
              "\n" +
              "Верь в себя и вперед, к новым вершинам!",

         "1.3 Функции и объекты": "Ты молодец, а я – мотивашка по скиллам для тестов! Продолжай в том же духе"
}



async function buildReview() {

    retrieveFormData()

    const criteriaFeedback = buildFeedback()
    const skills = getSkillByChecklist()
    let skillFeedback = ""
    const taskName = getTicketData().task_name

    if (Object.keys(COURSEWORKREVIEWS).includes(taskName)) {
        alert("Это работа в эксперименте по добавлению теории к ОС, в рецензию добавится блок с навыками и ссылками, пожалуйста, не удаляйте его!")
        skillFeedback = await buildSkillsFeedback(skills)
        skillFeedback = skillFeedback.replace(/\r?\n|\r/g, "");
        skillFeedback = COURSEWORKREVIEWS[taskName] + "\n\n" + skillFeedback
    }

    saveReviewToEditor(criteriaFeedback + "\n" + skillFeedback)

}

function getSkillByChecklist() {

    const skills = {};

    Object.keys(checklist).forEach(key => {

        const entry = checklist[key];
        const skill_name = entry.skill_name.trim();
        const grade = entry.grade;

        if (grade && skill_name !== "no-skill" && skill_name !== "") {

            skills[skill_name] ? skills[skill_name]["grades"].push(grade) : skills[skill_name] = {skill: skill_name, grades: [grade]};
            skills[skill_name].ok = skills[skill_name].grades.every(number => parseInt(number) === 5)
            skills[skill_name].failed = !skills[skill_name].ok
            skills[skill_name].slug = entry.skill_slug

        }

    });

    return skills;

}

async function buildSkillsFeedback(skills) {

    const listOfSkills = Object.values(skills)
    return await renderToCode("skillstable" , {skills:listOfSkills})

}


function getGroupsFromChecklist() {
    return new Set(Object.values(checklist).map(item => item.group))
}

function groupChecklist() {

    const group_names = getGroupsFromChecklist()
    let groups = []

    for (const groupName of group_names) {
        const groupCheckboxes = Object.values(checklist).filter(obj => obj.group === groupName && obj.grade !== null);
        const one_group = {"name": groupName, "items": groupCheckboxes}
        groups.push(one_group)
    }

    return groups

}

function buildFeedback() {

    const emojis = {5: "✅", 4: "✴️", 3: "❌"}

    const checklistGroups = groupChecklist()

    let feedbackText = ""

    for (const oneGroup of checklistGroups) {

        if ((oneGroup.name !== undefined) && (oneGroup.items.length !== 0)) {
            feedbackText += `\n<b>${oneGroup.name}: </b>`
        } else {
            feedbackText += `\n`
        }

        for (const checklistItem of oneGroup.items) {

            // Игнорим пункты, где нет оценок
            if (checklistItem.grade == null) { continue; }

            let gradeIcon = emojis[checklistItem.grade]
            let gradeText = checklistItem[checklistItem.grade].split("///")[0]
            let reviewPointResult = `${gradeIcon}⠀${gradeText}⠀`

            // Добавляем заметки, написанные ментором
            if (checklistItem.note) {
                reviewPointResult += `\n${checklistItem.note}`
            }

            feedbackText += `${reviewPointResult}\n`

        }
    }

    return feedbackText.replace("\n\n", "\n")

}


