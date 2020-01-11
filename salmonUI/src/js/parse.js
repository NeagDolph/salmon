import { classnames } from './globals';
import { app } from '../main';


export function parseData({teacher, admin, users, classes, tclasses, comments, tcomments}) {
    console.log("Parsing Data")
    app.sharedData.teacher = teacher
    app.sharedData.admin = admin
    app.sharedData.tclasses = tclasses
    app.sharedData.comments = comments
    app.sharedData.classes = classes.split("").map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
    })

    if (teacher) parseUsers(users, tcomments)
}

export function parseUsers(users, tcomments) {
    app.sharedData.users = users.map(el => {
        return {email: el[0], name: el[1], userid: el[2], classes: el[3], comments: ["", "", "", "", "", "", "", "", "", ""]}
    });

    app.sharedData.tcomments = tcomments.map((el, idx) => {
        let comment = {userid: el[0], class: el[1], comment: el[2]}
        app.sharedData.users.find(x => x.userid == comment.userid).comments[parseInt(comment.class)] = comment.comment
        return comment
    })
}


