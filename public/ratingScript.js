const form = document.querySelector("form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const bookData = new FormData(form)
    const req = Object.fromEntries(bookData)

    const response = await fetch("/add/rating", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(req)
    })
    const data = await response.json()
    console.log(data)

    window.location.href = "/ratings"
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
       const ratingsId = e.target.closest(".ratings-card").getAttribute("data-ratings-id")
      
       const formData = new FormData(e.target)
       const req = Object.fromEntries(formData)


       const response = await fetch("/ratings/" + ratingsId, {
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


// write the async function deleteRating
// make sure it redirects to /ratings after


async function deleteRating(id){
    await fetch ('/ratings/' + id, {method:'DELETE'})
    window.location.href = "/ratings"
}
