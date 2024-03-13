function buildReview() {
    retrieveFormData()
    const feedback = buildFeedback()
    saveReviewToEditor(feedback)
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
            feedbackText += `\n<b>${oneGroup.name}: </b>\n`
        } else {
            feedbackText += `\n`
        }

        for (const checklistItem of oneGroup.items) {

            if (checklistItem.grade == null) {
                continue;
            }

            gradeIcon = emojis[checklistItem.grade]
            gradeText = checklistItem[checklistItem.grade].replace("///", "")
            reviewPointResult = `${gradeIcon}⠀${gradeText}⠀`

            feedbackText += `${reviewPointResult}\n`

        }
    }

    return feedbackText

}

function createCriteriaResults() {

    const criteriaResults = [];
    const criteriaMap = {};

    // Перебор всего checklist для сбора информации о критериях и оценках
    for (const key in checklist) {

        const item = checklist[key];

        const { criteria, grade } = item;
        const gradeValue = parseInt(grade, 10);

        if (criteria === undefined) { continue }

        // Если критерий уже встречался, обновляем значение, если оно меньше
        if (criteriaMap[criteria] !== undefined) {
            criteriaMap[criteria] = Math.min(criteriaMap[criteria], gradeValue);
        } else {
            criteriaMap[criteria] = gradeValue;
        }
    }

    // Сбор данных в итоговую структуру
    for (const criteria in criteriaMap) {
        criteriaResults.push({ name: criteria, value: criteriaMap[criteria] });
    }   

    console.log(criteriaResults)

    return criteriaResults;

}



