module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/user_profile",
    "title": "User profile",
    "description": "A user profile in the system",
    "type": "object",
    "properties": {
        "avatarUrl": {
            "description": "The avatar url of the user",
            "type": "string",
            "format": "uri",
            "pattern": "^(https?|wss?|ftp)://"

        },
        "googleId": {
            "description": "for the google register user",
            "type": "string"
        }
    },
    "required": ["googleId"]

}
