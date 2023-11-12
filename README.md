# fullstackopen2023part4
## Course Content
In this part, we will continue our work on the backend. Our first major theme will be writing unit and integration tests for the backend. After we have covered testing, we will take a look at implementing user authentication and authorization.

Writing Tests with Jest.
This project is for creating a blogging app.

click [here](https://fullstackopen.com/en/part4) for more details.

### Introduction to Testing ( Exercise 4.1 - 4.7 )
Created a simple node.js express backend with GET and POST endpoints for testing purposes. A utility function ``` listHelper ```(_\util\list_helper.js_) was created to help with testing. Do note that this section does not include any testing of the API. It is for familiarization of the Jest Testing Library using pre-defined JSON for blogs.

This section can be found in _\test\part4_3.test.js_

##  Testing the backend ( Exercise 4.8 - 4.14 ) 
Using the ```supertest``` package to simulate the app by sending HTTP request to the backend. The backend app code was also modified to use ```async\await``` instead of a Promise. Therefore, in order to eliminate additional ``` try\catch ``` from the code, an additional package ```express-async-errors``` was installed to automatically pass the errors ```next(error)``` to the error middleware.



