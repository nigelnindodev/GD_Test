- Struggled a bit to set up the project, had run into this weired bug where the scaffold I used generated a wrong TypeScript version. Found and a solution [here](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/53397)

https://stackoverflow.com/questions/49251749/tslint-not-excluding-node-modules-in-angular-project also had some nice insights that shoud have worked but was pointing towards the wrong thing. I'll update this stack overflow post as well.

It turns out the issue I was having was running the wrong version of Typescript, as created by the Scaffold. Will raise an issue with Yeoman on that.

On top of the scaffold we have also created some additional folders

#### Models
Will hold DB models and queries

#### Utils
Hold any ad hoc functions we need i.e email validator

#### Services
In order to maintain thin controllers, we'll define business logic in services

### Running the project

Was a bit conflicted on how to set this up easily. Especially where to host the database. Wanted to not use docker due to ephemeral storage. So decided to use SQLite.
To run the project, just have node and npm installed. Install dependencies with `npm install` Then run with `npm run build-run`

### SQLite browser
Haven't used SQLite in a while, but found [this tool](https://sqlitebrowser.org/dl/) to help browse through the created db. Might be a better tool out there, but due to time constraints cannot check.
Found out it's very important to close the DB connection via the tool when running the application code. 

I have seeded the database (data.db) with some test data but created an endpoint to make it easier to if you want to create more titles `curl -X POST http://localhost:3000/title -H 'Content-Type: application/json' -d '{"title":"Title 1"}'`. You can even delete `data.db` file and start seeding with new data.


### Improvements
- Add a proper logger instead of console.log to STDOUT
- USe a proper DB rather than SQLite. Maybe a managed DB hosted by a cloud provider
- Indexes for columns specified in where clauses. Fast now because of small set of data
- Add authentication/authorization
- Had some models logic spill over to the service logic
- Addition for unit tests
- Not actually delete titles from the database, but place them in a "finished" state so that we remain with a history of all finished reservations
- Properly ISO format dates returned with maybe moment.js. Also maybe localize dates.

### Other notes
- Might have validated emails via regex (~actually was not working~) but looks like there is a quite popular library for that on npm: https://www.npmjs.com/package/email-validator
- If time allowed, would have refactored some functions like `getAllReservations` to the models folder to maintain a cleaner services implementation
- Wasted some time setting up the DB, since I set up not with my [usual scaffold](https://github.com/javieraviles/node-typescript-koa-rest). Wanted the take home test to be a bare bones as possible.
- With more time, would have created foreign key relationships for the two tables to find reservations based on id in a more efficient manner. Currently, first selecting id if available then checking from reservations if exists.
- Wanted to have mutiple branches into merge conflict hell that couldn't resolve in the last hour: This [StackOverflow Post](https://stackoverflow.com/a/17903155) was able to help me consolidate all the work

### Assumptions
- We can have multiple titles, and the same email can reserve the same title multiple times as long as there is availability
