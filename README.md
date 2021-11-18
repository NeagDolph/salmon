<p style="text-align: right">
Neil Agrawal</p>



# **The Salmon Panel**


### A student work management platform built for the Academy of Thought and Industry



<img src="https://raw.githubusercontent.com/NeagDolph/salmon/master/logoCropped.png" alt="Logo" width="400"/>



# Introduction

The Salmon App is an off campus management system for teachers to use and students to view. The idea is that the application will manage which students have all the work for their classes completed on time, if a student has all their work turned in on time then the teacher can set the student to green. The student will then be able to view it from a web panel which they can log into, eliminating drawbacks from other methods such as making the data public or hiding it from students altogether.


### 
    How it started


    The Idea for the Salmon App started from the moment I saw the ATI teachers using Excel as their off campus management system at the time. The teachers had to log into Microsoft and edit cell by cell the status of each individual student. Not only was this system inefficient but students had no way of finding out their off campus status while outside of school or even while their teachers were busy. I wanted to make this project but I didn’t have the right opportunity until the Life Design community stewardship began. Once it was announced I reached out to my classmate Jeremy to help with design mockups and began the development.


### 


### The tech behind it

The technology and languages I used for this project has changed over time and been adjusted based on what seemed right. The original idea was to make the backend with Python Flask and the frontend with the Vue.js framework along with Socket.io for instantaneous data transfer, versions of the product were made with those frameworks and it worked well but Python in the backend didn’t seem right and there were some compatibility issues with Socket.io so I moved the backend to Express.js.



### The functionality

The functionality of the application is split into three different sections, the student panel, teacher panel and admin panel. Each section has its own users and permissions needed for use.


### Student panel

<img src="https://raw.githubusercontent.com/NeagDolph/salmon/master/studentpanel.png" alt="student panel" width="400"/>


The student sees live-updated data for their classes.


### Teacher panel
<img src="https://raw.githubusercontent.com/NeagDolph/salmon/master/teacherpanel.png" alt="teacher panel" width="400"/>


Teachers can change the completion status of classes they have in common with students as well as add comments.


### Admin panel


### 

<img src="https://raw.githubusercontent.com/NeagDolph/salmon/master/adminpanel.png" alt="admin panel" width="400"/>

Admins can add and remove teachers as well as change the enrolled classes for students and the instructed classes for teachers
