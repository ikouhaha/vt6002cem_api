module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/product",
    "title": "Product",
    "description": "product's information",
    "type": "object",
    "properties": {
        "name":{
            "description": "The name of product",
            "type": "string",
            "minLength": 1,
        },
        "about":{
            "description": "The description of product",
            "type": "string"
        },
        "imageBase64":{
            "description": "The base64 format of image",
            "type": "string"
        },
        "createdBy":{
            "description": "The product information create by",
            "type": "integer?"
        },
        "companyCode":{
            "description": "The product information company code",
            "type": "String"
        },
        
    },
    "required": ["name","about","imageBase64"]
}
