module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/user",
    "title": "User",
    "description": "A user in the system",
    "type": "object",
    "properties": {
        "displayName": {
            "description": "The user's display name",
            "type": "string"
        },

        "password": {
            "description": "Create user password",
            "type": "string",
            "minLength": 3,

        },
        "email": {
            "description": "Create user email",
            "type": "string",
            "format": "email"

        },
        "avatarUrl": {
            "description": "The avatar url of the user",
            "type": "string",
            "format": "uri",
            "pattern": "^(https?|wss?|ftp)://"

        },
        "role": {
            "description": "the role of user",
            "type": "string",

        },
        "fid": {
            "description": "for the firebase register user",
            "type": "string"
        },
        "companyCode": {
            "description": "the company register code",
            "type": "string",

        },


    },
     "required": ["password", "email", "role","fid"]

}
