const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    let likes = 0;
    for (let blog of blogs) {
        likes += blog.likes;
    }

    return likes;
};

const favoriteBlog = (blogs) => {
    blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)
    return blogs[0]
}

const mostBlogs = (blogs) => {
    blogs.sort((blogA, blogB) => blogB.author.localeCompare(blogA.author))
    let prevblog = blogs[0]
    let blogcount = 0
    for (let blog of blogs) {
        if (blog.author === prevblog.author) {
            blogcount += 1
            prevblog = blog
        } else {
            break
        }
    }
    const final = { author: prevblog.author, blogs: blogcount }
    console.log(final)
    return final
}

const mostLikes = (blogs) => {
    blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)
    let favblog = blogs[0]
    let totallikes = 0
    for (let blog of blogs) {
        if (blog.author === favblog.author) {
            totallikes += blog.likes
        } else {
            continue
        }
    }
    const final ={author: blogs[0].author, likes:totallikes}
    console.log(final)
    return final
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes   
};
