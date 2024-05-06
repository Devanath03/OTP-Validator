import logging
from flask_pymongo import pymongo
from flask import jsonify, request
import pandas as pd
import requests
import random
import vonage

def send_sms(from_number, to_number):
    
    random_number = str(random.randint(10000, 99999))  # Generate a random 4-digit number
    
    message = f"Your OTP number: {random_number}"

    client = vonage.Client(key="", secret="")  # my client key and secret 
    
    sms = vonage.Sms(client)
    
    responseData = sms.send_message(
    {
        "from": "Vonage APIs",#from_number
        "to": to_number,
        "text": message,
    })

    if responseData["messages"][0]["status"] == "0":

        print("Message sent successfully.")
    else:
        
        print(f"Message failed with error: {responseData['messages'][0]['error-text']}")

    return random_number


con_string = "mongodb+srv://devanath:devanath432@cluster0.8x4ss8e.mongodb.net/?retryWrites=true&w=majority"

client = pymongo.MongoClient(con_string)

db = client.get_database('database2')

user_collection = pymongo.collection.Collection(db, 'otp') #(<database_name>,"<collection_name>")

print("MongoDB connected Successfully")


def project_api_routes(endpoints):
    @endpoints.route('/hello', methods=['GET'])
    def hello():
        res = 'Hello world'
        # print("Hello world")
        return res

    @endpoints.route('/send', methods=['POST'])
    def register_user():
        global send_num
        resp = {}
        try:
            mobile_number = request.form['number']

            from_number = "919487128593"

            to_number = "91"+mobile_number

            # Calling send_sms function to send the SMS
            otp = send_sms(from_number, to_number)

            req_body = {
                 'Mobile Number': mobile_number,
                 'OTP': otp
                }

            user_collection.insert_one(req_body)
            
            print("User Data Stored Successfully in the Database.")
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Stored Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp

    @endpoints.route('/read-users',methods=['GET'])
    def read_users():
        resp = {}
        try:
            users = user_collection.find({})
            print(users)
            users = list(users)
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Retrieved Successfully from the Database."
            }
            output = [{'Name' : user['name'], 'Email' : user['email']} for user in users]   #list comprehension
            resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp
    

    @endpoints.route('/delete',methods=['DELETE'])
    def delete():
        resp = {}
        try:
            delete_id = request.args.get('delete_id')
            user_collection.delete_one({"id":delete_id})
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Deleted Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp
    
    @endpoints.route('/check-user', methods=['POST'])
    def check_user():
        resp = {}
        try:
            req_body = {
            'Mobile Number':request.form['number'], #ithukku ulla iruka name tha nee front end la variable name ahh send pananum 
            'OTP':request.form['otp']
            }
            user = user_collection.find_one(req_body)
            if user:
                status = {
                "statusCode": "200",
                "statusMessage": "User Found in the Database."
                }
                resp["data"] = True
            else:
                status = {
                "statusCode": "200",
                "statusMessage": "User Not Found in the Database."
                }
                resp["data"] = False
        
        except Exception as e:
            print(e+"error")
            status = {
            "statusCode":"400",
            "statusMessage":str(e)
            }
            resp["data"] = False
        
        resp["status"] = status
        return resp


    return endpoints