// Repo: hoxton-js-hoxtagram-crud

// Description
// We're going to improve yesterday's app by adding more functionality to it!

// Instructions
// - Use this template as a reference. Work with your yesterday's code. => https://codesandbox.io/s/day-15-hoxtagram-ii-template-h54n0
// - Have the like button adding 1 like to the respective counter each time you click it
// - Have the comments form to add another comment to the respective post
// - Add a delete button to each comment and post. Setup these buttons to be able to delete respectively comments and posts, and persist the changes.
// - The data must be persisted in the server so that when you refresh the page it doesn't go away

// Tips
// - Try to think which kind of HTTP method you should use on each occasion
// - Keep your responses simple for ease of use
// - Try to use function scopes to your advantage

// Challenge 1
// Uncomment the form from index.html. Setup the form so that you can add posts to the page. They must persist after a refresh. Make sure you append the cards after the form

// Challenge 2
// Add error handling to the app. The user should have a notification if something goes wrong

const state = {
    images: []
}

function getImages() {
    return fetch("http://localhost:3000/images")
        .then(resp => resp.json())
}

function addLikes(imageID, newLikes) {
    return fetch(`http://localhost:3000/images/${imageID}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                likes: newLikes
            })
        })
        // .then(resp => resp.json())
}

function addComments(imgID, theComment) {
    return fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            imageId: imgID,
            content: theComment
        })
    }).then((resp) => {
        return resp.json()
    })
}

function deleteComment(commentID) {
    return fetch(`http://localhost:3000/comments/${commentID}`, {
        method: "DELETE",
    })
}


const imageContainer = document.querySelector('.image-container')

function renderImageArticle(image) {
    const articleEl = document.createElement('article')
    const titleEl = document.createElement('h2')
    const imgEl = document.createElement('img')
    const buttonDivEl = document.createElement('div')
    const likesEl = document.createElement('span')
    const buttonLikeEl = document.createElement('button')
    const commentsUlEl = document.createElement('ul')
    const commentFormEL = document.createElement('form')
    const commentInputEl = document.createElement('input')
    const addCommentButtonEl = document.createElement('button')


    articleEl.setAttribute('class', 'image-card')

    titleEl.setAttribute('class', 'title')
    titleEl.textContent = image.title

    imgEl.setAttribute('class', 'image')
    imgEl.setAttribute('src', image.image)

    buttonDivEl.setAttribute('class', 'likes-section')

    likesEl.setAttribute('class', 'likes')
    likesEl.textContent = `${image.likes} likes yet`

    buttonLikeEl.setAttribute('class', 'like-button')
    buttonLikeEl.textContent = "♥"
    buttonLikeEl.addEventListener('click', () => {
        image.likes += 1
        addLikes(image.id, image.likes)
        render()
    })

    commentsUlEl.setAttribute('class', 'comments')

    for (const comment of image.comments) {
        const commentLiEl = document.createElement('li')

        commentLiEl.textContent = comment.content

        const deleteCommentButtonEl = document.createElement('button')
        deleteCommentButtonEl.setAttribute('class', 'delete-comment-button')
        deleteCommentButtonEl.textContent = "✘"
        commentLiEl.append(deleteCommentButtonEl)

        deleteCommentButtonEl.addEventListener('click', () => {
            console.log('deleting gjasme')
            deleteComment(comment.id)
            console.log(comment.id)
            console.log(image.comments)
            image.comments = image.comments.filter((element) => {
                return element.id !== comment.id
            })
            console.log(image.comments)

            render()
        })
        commentsUlEl.append(commentLiEl)

    }

    commentFormEL.setAttribute('class', 'comment-form')

    commentInputEl.setAttribute('class', 'comment-input')
    commentInputEl.setAttribute('type', 'text')
    commentInputEl.setAttribute('name', 'comment')
    commentInputEl.setAttribute('placeholder', 'Add a comment')

    addCommentButtonEl.setAttribute('class', 'comment-button')
    addCommentButtonEl.setAttribute('type', 'submit')
    addCommentButtonEl.textContent = "Post"

    commentFormEL.append(commentInputEl, addCommentButtonEl)

    commentFormEL.addEventListener('submit', (event) => {
        event.preventDefault()
        addComments(image.id, commentInputEl.value)
            .then((newComment) => {
                image.comments.push(newComment)
                render()
            })
        render()
    })

    buttonDivEl.append(likesEl, buttonLikeEl)
    articleEl.append(titleEl, imgEl, buttonDivEl, commentsUlEl, commentFormEL)
    imageContainer.append(articleEl)
}



function renderImages() {
    imageContainer.innerHTML = ""

    for (const image of state.images) {
        renderImageArticle(image)
    }
}

function render() {
    renderImages()
}

render()

getImages().then(images => {
    state.images = images
    render()
})