# fullstackopen2023part4
## Course Content
In this part, we will continue our work on the backend. Our first major theme will be writing unit and integration tests for the backend. After we have covered testing, we will take a look at implementing user authentication and authorization.

Writing Tests with Jest.
This project is for creating a blogging app.

click [here](https://fullstackopen.com/en/part4) for more details.

### Introduction to Testing ( Exercise 4.1 - 4.7 )
Created a simple node.js express backend with GET and POST endpoints for testing purposes. A utility function ``` listHelper ```(_\util\list_helper.js_) was created to help with testing. Do note that this section does not include any testing of the API. It is for familiarization of the Jest Testing Library using pre-defined JSON for blogs.

This section can be found in _\test\part4_3.test.js_.

###  Testing the backend ( Exercise 4.8 - 4.14 ) 
Using the ```supertest``` package to simulate the app by sending HTTP request to the backend. The backend app code was also modified to use ```async\await``` instead of a Promise. Therefore, in order to eliminate additional ``` try\catch ``` from the code, an additional package ```express-async-errors``` was installed to automatically pass the errors ```next(error)``` to the error middleware.

### User Administration and Token Authentication ( Exercises 4.15 - 4.23 )
The files for these exercises can be found in the branch `[part4.15to4.23]`. ```bcrypt``` and ```jsonwebtoken```(JWT) was used to password hashing and token generation respectively. 

## Repository Structure
This repository is also used for other exercises further down in the course such as part7 and part13 etc. These are seperated into their own individual branches as they consists of additional changes that are required in their respective parts.
```
[anecdoteBackend]
[part7backend]
[part13relationDBbackend]
```


