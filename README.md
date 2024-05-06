# Saffer Properties Webapp

## Purpose
Web application for the property management company "Saffer Properties LCC". The website displays information for users to read. Owners/employees of Saffer Properties can Create, Read, Update, and Delete information on the website - specifically property data.  

## Features
- User authentication
- CRUD operations for property data
- Displaying property listings with details
- Responsive design for mobile and desktop devices
  
## Technologies Used
- [React:](https://react.dev/) A JavaScript library for building user interfaces.
- [Firebase:](https://firebase.google.com/) A platform for building web and mobile applications, providing backend services such as authentication, database, and storage.
- [Squarespace Domain Management:](https://domains.squarespace.com/) Used for custom DNS records.

## Firebase Realtime Database / Storage
Firebase storage serves as a CDN (Content Delivery Network) to deliver dynamic images on the site. The Firebase Realtime Database is structured to store property data along with other information. Each property entry contains a list of image URLs pointing to the images stored in Firebase Storage.

### Realtime Database Structure
```json
{
    "admins": {
        "UID": "UID"
    },
    "newConstruction": {
        "address-id": {
            "address": "str", 
            "bedrooms": "str",
            "bathrooms": "str",
            "description": "str",
            "image_urls": [],
            "property_type": "str",
            "thumbnail_description": "str",
            "thumbnail_image_url": "str"
        }
    },
    "properties": {
        "address-id": {
            "address": "1108 Schoolhouse Lane Corolla, NC", 
            "bathrooms": "7.5",
            "bedrooms": "7",
            "currently_available": false,
            "description": "Situated on a large...",
            "image_urls": ["https://firebasestorage.googleapis.com/v0/b/...", "other urls"],
            "price": "$2,500-$10,000",
            "property_type": "Vacation",
            "thumbnail_description": "Oceanside Beach House...",
            "thumbnail_image_url": "https://firebasestorage.g..."
        }
    }
}
```


## Folder Structure
```
.
├── firebaseCustomClaims - scripts for managing custom claims
│   ├── addAdmin.js
│   ├── checkAdmin.js
│   ├── listAllAdmin.js
│   ├── removeAdmin.js
│   └── serviceAccountKey.json
├── public
└── src
    ├── Assets
    ├── Pages
    │   ├── AdminPages
    │   │   └── CSS
    │   └── CSS
    └── components
        └── CSS

```

## Setup, Installation, and Deployment 
1. Clone the repository: `git clone https://github.com/DavidSaffer/safferproperties-webapp.git`
2. Navigate to the project directory: `cd saffer-properties-webapp`
3. Install dependencies: `npm install`
4. Configure Firebase:
   - Create a Firebase project and obtain the necessary credentials.
   - Replace the placeholder values in Firebase configuration files.
5. Start the development server: `npm start`
6. Build the project: `npm run build`
7. Deploy to Firebase Hosting: `firebase deploy`

## Admin Management
Note: Requires a service account key. This can be found in the firebase console under Project Settings -> Service Accounts
### Adding admins
1. First the user must login with google on the website
2. Enter the user into the realtime databse
   1. Obtain their UID from firebase console, under Authentication
   2. Add their UID to "admins" in the Realtime Database
3. Create a custom claim for this user
   1. Navigate to the firebaseCustomClaims directory
   2. In "addAdmin.js" Set the UID on line 8 
   3. run ```node addAdmin.js```
   4. optional: run ```node listAllAdmin.js``` to verify

### Removing admins
1. Remove the user from the realtime database
   1. Find their UID from firebase console, under Authentication
   2. Remove that UID from "admins" in the realtime database
2. Remove their custom claim
   1. Navigate to the firebaseCustomClaims directory
   2. In "removeAdmin.js" Set the UID on line 8 
   3. run ```node removeAdmin.js```
   4. optional: run ```node listAllAdmin.js``` to verify