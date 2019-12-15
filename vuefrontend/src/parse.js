import { sharedData, classnames } from './globals.js'


export function parseData({teacher, admin, users, classes, tclasses}) {
    console.log("Parsing Data")
    sharedData.teacher = teacher
    sharedData.admin = admin

    sharedData.users = users

    sharedData.classes = classes.split("")

    sharedData.tclasses = tclasses

    sharedData.classes = sharedData.classes.map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
    })
}