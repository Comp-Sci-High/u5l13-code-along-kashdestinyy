const form = document.querySelector("form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const bookData = new FormData(form)
    const req = Object.fromEntries(bookData)

    const response = await fetch("/add/teacher", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(req)
    })
    const data = await response.json()
    console.log(data)

    window.location.href = "/"
})

// Toggle edit form visibility
function toggleEditForm(index) {
    const editForm = document.querySelector(`#editForm${index}`)
    editForm.style.display = editForm.style.display === "none" ? "block" : "none"
}

// Cancel edit form and hide it
function cancelEdit(index) {
    const editForm = document.querySelector(`#editForm${index}`)
    editForm.style.display = "none"
}

// Handle edit form submission
document.addEventListener("submit", async (e) => {
    if (e.target.classList.contains("edit-form")) {
        e.preventDefault()
        const formIndex = e.target.id.replace("editForm", "")
        const teacherId = e.target.closest(".teacher-card").getAttribute("data-teacher-id")
        
        const formData = new FormData(e.target)
        const req = Object.fromEntries(formData)

        const response = await fetch("/teachers/" + teacherId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        })
        const data = await response.json()
        console.log(data)

        window.location.href = "/"
    }
})

// Delete teacher by ID
async function deleteTeacher(id){
    await fetch ('/teachers/' + id, {method:'DELETE'})
    window.location.href = "/"
}