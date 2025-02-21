- There are two types of databases - NoSQL and SQL
- There are multiple NoSQL databases and multiple SQL databases 

- One of such NoSQL database is MONGODB


--- Try to get a free mongoDB instance ---

+ go to mongoDB.com --> do the signup/signin things
+ Click on create a database
+ Select MO - free one's 
+ provider - aws
+ select any region 
+ Name anything you want 
+ Create 


+ + select Username and Password
+ + Create username and Password ---> create user 

+ + Inside IP address --> give port 0.0.0.0/0 and description as everywhere

- This is so that our Database could get connected from everywhere and from any device (our IP can change very often, so chhosing this is better)

+ + add entry

+ + Finish and Close
+ preview 


- Once its done, we should see a cluster 0 database over there.


- then click on connect 
- and click on compass here 
- click on I dont have compass installed locally - and download compass
- This is basically a GUI that lets us visualise our mongoDB instance (super helpful in debugging)


- we should get mongoDB compass locally - then open it 


- Before opening, copy the connection string
[mongodb+srv://username:<db_password>@cluster0.6k4iz.mongodb.net/]

    + + mySetPassword - new password 
    replace the <db_password> in the URL with this password. 

- open the compass and start a new connection 
- put this URL in this there and connect 

(copy the long connection string - keep it handy.)


(mongodb+srv://anandnaman02:v9jPNDcVAXn0QXxN@cluster0.6k4iz.mongodb.net/)


- mongodb compass lets us visualise the data very quickly.


- database access - is where we can update our password

- network access - is where we can set our IP address - make sure its set as 0.0.0.0/0

--------------------------------------------

open compass 
after we are connected to our mongoDB cluster - we can create a new Database.

we can create a bunch of collection inside the database if we want.


NOTE: this way, we are using mongoDB from their cloud offering online. We can even bring them online and do these thingy.

