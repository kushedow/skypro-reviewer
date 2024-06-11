function transliterate(title) {
    const cyrillicToLatinMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya'
    };

    return title.toLowerCase()
        .split('')
        .map(char => cyrillicToLatinMap[char] !== undefined ? cyrillicToLatinMap[char] : char)
        .join('')
        .replace(/[^a-z0-9 -]+/g, '')  // Удаление всех символов, кроме латинских букв, цифр, пробелов и дефисов
        .replace(/\s+/g, '-')          // Замена пробелов на дефисы
        .replace(/-+/g, '-');          // Замена нескольких дефисов одним
}

function getFailedSkills() {

    const result = {};
    // Обходим каждый элемент и добавляем в результат западающие скиллы

    for (let key in checklist) {

        const item = checklist[key];

        if (parseInt(item.grade) < 4) {

            const skill = item.skill.trim();

            if (skill === undefined ||skill === "no-skill") {continue}

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
            renderToCode("failedskills", {skills: failedSkills})

        }
    })
}

