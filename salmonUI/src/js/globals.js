export let sharedData = {
    logged: undefined,
    signFuncs: {},
    teacher: false,
    admin: false,
    users: [],
    shortnames: ["Soc", "Wr", "Geo", "Stats", "LD", "PS", "Phy", "HRI", "CW", "UM", "Maker", "Pract"]
}
export let userauth = {};
export let classnames = ["Socratic", "Writing", "Geometry", "Statistics", "Life Design", "Problem", "Physics", "HRI", "Creative", "Urban", "Makerspace", "Practicum"]
export let apiurl = {data: "/api/getdata", login: "/api/glogin", classes: "/api/editclasses"}