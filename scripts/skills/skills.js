function getFailedSkills() {

    const result = {};
    // Обходим каждый элемент и добавляем в результат западающие скиллы

    for (let key in checklist) {
        const item = checklist[key];

        if (parseInt(item.grade) < 4) {
            const skill = item.skill;

            if (skill === undefined) {continue}

            if (result[skill]) {
                result[skill].count ++
            } else {
                result[skill] = {name: skill, count: 1}
            }
        }
    }

    return Object.values(result);
}

function showSkillBox(){

    chrome.storage.sync.get('skillsOn', function(items) {

        const skillsOn = items.softboxOn

        if (skillsOn === "true") {

            const failedSkills = getFailedSkills()
            console.log(failedSkills)
            renderFromTemplate(".review__skillbox", "failedskills", {skills: failedSkills}).then()
        }
    })
}

