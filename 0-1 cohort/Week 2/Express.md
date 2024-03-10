# Express and HTTP with real world examples Postman

- HTTP is a protocol you can write it in any language of your choice.

## Example of single threaded

- Doctors are single threaded, they check one patient at a time.
- Your logic is like doctor
- But what if you want to expose this logic to the world?
  This is where HTTP (Hyper Text Transfer Protocol: This lets you transfer your data from one computer to another ) comes into the picture
  It lets you create a ~hostpital where people can
  Come and find you
- Question - How do I create an HTTP Server?
  Ans - Express
  ![alt text](Express-Img/image.png)
- Express is a library that let's you create a HTTP server.
  ![alt text](Express-Img/image-1.png)
  ![alt text](Express-Img/image-2.png)
  ![alt text](Express-Img/image-3.png)

- Whatever port the HTTP server is listening on it needs to be unique for every process.
- How the user will access this code?
  ![alt text](Express-Img/image-4.png)

# Hospital App Backend Example

## Flow

- Creating an http server
- express
- node default library => no
  ![alt text](Express-Img/image-5.png)

- Try `ifconfig` in terminal

## Sending data to server

- Query parameter
- Path parameter

## In memory data

![alt text](Express-Img/image-6.png)
![alt text](Express-Img/image-8.png)
![alt text](Express-Img/image-7.png)

- Look for hoppscotch.io it is open source version of postman.
- Look about the middlewares, you can create your own middlewares.
- Default response code is 200
  ![alt text](Express-Img/image-9.png)

## FS Server

![alt text](Express-Img/image-10.png)

- path parameters
  ![alt text](Express-Img/image-11.png)
- Remote file getter
  ![alt text](Express-Img/image-12.png)
