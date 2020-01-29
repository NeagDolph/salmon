import { sharedData, classnames } from './globals'
import { app } from '../main';


export function parseData(userObj) {
    console.log("Parsing Data")
    app.sharedData.teacher = userObj.teacher
    app.sharedData.admin = userObj.admin
    console.log("CLASS", userObj.classes, userObj)
    app.sharedData.tclasses = userObj.tclasses
    app.sharedData.comments = userObj.comments
    app.sharedData.classes = userObj.classes.split("").map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
    })
    app.mainClasses = sharedData.classes
    app.sharedData = sharedData

    if (userObj.teacher) parseUsers(userObj.users, userObj.tcomments)
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


