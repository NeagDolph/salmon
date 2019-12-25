import { sharedData, classnames } from './globals'


export function parseData({teacher, admin, users, classes, tclasses, comments, tcomments}) {
    console.log("Parsing Data")
    sharedData.teacher = teacher
    sharedData.admin = admin
    sharedData.classes = classes.split("")
    sharedData.tclasses = tclasses
    sharedData.comments = comments
    sharedData.classes = sharedData.classes.map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
    })

    if (teacher) parseUsers(users, tcomments)
}

export function parseUsers(users, tcomments) {
    sharedData.users = users.map(el => {
        return {email: el[0], name: el[1], userid: el[2], classes: el[3], comments: ["", "", "", "", "", "", "", "", "", ""]}
    });

    sharedData.tcomments = tcomments.map((el, idx) => {
        let comment = {userid: el[0], class: el[1], comment: el[2]}
        sharedData.users.find(x => x.userid == comment.userid).comments[parseInt(comment.class)] = comment.comment
        return comment
    })
}


