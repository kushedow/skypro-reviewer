
function buildReview() {
    retrieveFormData()
    const feedback = buildFeedback()
    saveReviewToEditor(feedback)
}


// function getGroupsFromChecklist(){
//     const unique = new Set(checklist.map(item => item.group));
//     return Array.from(unique);
// }


function buildFeedback() {

    emojis = {5: "✅", 4: "✴️", 3: "❌"}

    feedbackPoints = []

    for (const checklistItem of Object.values(checklist)) {

        if (checklistItem.grade == null) {
            continue;
        }

        gradeIcon = emojis[checklistItem.grade]
        gradeText = checklistItem[checklistItem.grade]
        reviewPointResult = `${gradeIcon} ${gradeText}`
        feedbackPoints.push(reviewPointResult)
    }

    return feedbackPoints.join('\n')
}

