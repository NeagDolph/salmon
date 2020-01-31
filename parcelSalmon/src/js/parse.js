import { sharedData, classnames } from './globals'
import { app } from '../main';


export function parseData(userObj) {
    console.log("Parsing Data")
    sharedData.teacher = userObj.teacher

    sharedData.admin = userObj.admin
    console.log("CLASS", userObj.classes, userObj)
    sharedData.tclasses = userObj.tclasses
    sharedData.comments = userObj.comments
    sharedData.classes = userObj.classes.split("").map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
    })

    if (userObj.teacher) parseUsers(userObj.users, userObj.tcomments)
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


