// import { createServer, Model, Factory } from "miragejs";
// import { faker } from '@faker-js/faker';
// import { Person } from "types";

// export function makeServer({ environment = "test" }) {
//   return createServer({
//     environment,

//     factories: {
//       person: Factory.extend<Partial<Person>>({
//         get firstName() {
//           return faker.name.firstName();
//         },
//         get lastName() {
//           return faker.name.lastName();
//         },
//         get name() {
//           return faker.name.findName(this.firstName, this.lastName);
//         },
//         get streetAddress() {
//           return faker.address.streetAddress();
//         },
//         get cityStateZip() {
//           return faker.fake(
//             "{{address.city}}, {{address.stateAbbr}} {{address.zipCode}}"
//           );
//         },
//         get phone() {
//           return faker.phone.phoneNumber();
//         },
//         get username() {
//           return faker.internet.userName(this.firstName, this.lastName);
//         },
//         get password() {
//           return faker.internet.password();
//         },
//         get email() {
//           return faker.internet.email(this.firstName, this.lastName);
//         },
//         get avatar() {
//           return faker.internet.avatar();
//         },
//       }),
//     },

//     models: {
//       person: Model.extend<Partial<Person>>({}),
//     },

//     routes() {
//       this.namespace = "api";
//       this.urlPrefix = 'http://localhost:3000';

//       this.get("people");

//       this.get("/movies", () => {
//         return {
//           movies: [
//             { id: 1, name: "Inception", year: 2010 },
//             { id: 2, name: "Interstellar", year: 2014 },
//             { id: 3, name: "Dunkirk", year: 2017 },
//           ],
//         }
//       })
//     },

//     seeds(server) {
//       server.createList("person", 20);
//     },
//   });
// }

export * from './server';
