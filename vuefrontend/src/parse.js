import { sharedData, classnames } from './globals.js'


export function parseData(data) {
    console.log("Parsing Data:", data)
    sharedData.teacher = data.teacher
    sharedData.admin = data.admin

    sharedData.users = data.users

    console.log("BPOO", data)

    sharedData.classes = data.classes.split("")

    sharedData.classes = sharedData.classes.map((val, idx) => {
        console.log(classnames[idx], val, "BEE")
        return {"name": classnames[idx], "status": parseInt(val)}
    })
}