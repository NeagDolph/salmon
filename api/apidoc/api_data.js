define({ "api": [
  {
    "type": "post",
    "url": "/api/auth/:idtoken",
    "title": "Authenticates user using Google ID token",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idtoken",
            "description": "<p>Google ID token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "403",
            "description": "<p>This google account is not in the alt.app gsuite</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Bad request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Auth",
    "name": "PostApiAuthIdtoken"
  },
  {
    "type": "put",
    "url": "/api/student/enroll",
    "title": "Modify classes a student is enrolled in",
    "group": "Students",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userid",
            "description": "<p>Salmon user identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "class",
            "description": "<p>Index of class to change enroll status of</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "new",
            "description": "<p>New enrollment status of class</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "404",
            "description": "<p>User not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Bad request</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "403",
            "description": "<p>No permission</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Students",
    "name": "PutApiStudentEnroll"
  },
  {
    "type": "put",
    "url": "/api/student/status",
    "title": "Edit student specific class status",
    "group": "Students",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userid",
            "description": "<p>Salmon user identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "class",
            "description": "<p>Index of class to change status of</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "new",
            "description": "<p>New status of class</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "404",
            "description": "<p>User not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Bad request</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "403",
            "description": "<p>No permission</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Students",
    "name": "PutApiStudentStatus"
  },
  {
    "type": "post",
    "url": "/api/teacher",
    "title": "Add a new teacher",
    "group": "Teachers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "404",
            "description": "<p>User not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Bad request</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "403",
            "description": "<p>No permission</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>Successfully made user a teacher</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "queue",
            "description": "<p>Added email to teacher queue</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Teachers",
    "name": "PostApiTeacher"
  },
  {
    "type": "put",
    "url": "/api/teacher",
    "title": "Edit teacher classes",
    "group": "Teachers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of teacher</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "404",
            "description": "<p>User not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Bad request</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "403",
            "description": "<p>No permission</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Teachers",
    "name": "PutApiTeacher"
  }
] });
