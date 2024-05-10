function buildReview() {

    retrieveFormData()
    const feedback = buildFeedback()
    saveReviewToEditor(feedback)

    showSkillBox()

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


