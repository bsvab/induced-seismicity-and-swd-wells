# Line 9, Line 24, and Line 28 need to be adjusted according to your informaton in order for this to run properly

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# *****Path to your credentials JSON file - change to your personal 
credentials_file = r'C:\Users\thesa\OneDrive\Desktop\Project 3\code\GoogleAPI\JSONFile.json'

# Define the scopes for the API request
scopes = ['https://www.googleapis.com/auth/drive']

# Create the authorization flow object
flow = InstalledAppFlow.from_client_secrets_file(credentials_file, scopes=scopes)

# Run the OAuth2 flow to obtain credentials with offline access
credentials = flow.run_local_server()

# Create a service object for interacting with the API
service = build('drive', 'v3', credentials=credentials)

# ******Path to the large text file you want to upload - change to your personal
file_path = r'C:\Users\thesa\OneDrive\Desktop\Project3\data\ndb_deep_oct2023_Pressure_allLayers_starting20170101.txt'

# Define the metadata for the file, including the parent folder ID
file_metadata = {
    'name': 'AlejandroEditFile.txt',  # ***** Change the name as needed
    'parents': ['1w07-FbN-Yy-67IGp6v_Ek2voVIzICVc4'
    ]
}

# Create a MediaFileUpload object with the file path and MIME type
media = MediaFileUpload(file_path, mimetype='text/plain', resumable=True)

# Create a request to insert the file
request = service.files().create(body=file_metadata, media_body=media)

# Execute the request to upload the file
response = None
while response is None:
    status, response = request.next_chunk()
    if status:
        print(f"Uploaded {int(status.progress() * 100)}%")

print("Upload Complete!")

# List files in Google Drive
response = service.files().list().execute()
files = response.get('files', [])

if not files:
    print('No files found.')
else:
    print('Files:')
    for file in files:
        print(f"{file['name']} ({file['id']})")