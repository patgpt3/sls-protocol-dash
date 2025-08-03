// import {
//   RecordVerboseResponsePayload,
//   RecordSlimResponsePayload,
//   RecordsSlimResponsePayload,
//   RecordSlimResponseData,
// } from 'types';
// import { padWithZeros } from 'utils';

// const PAD_LENGTH = 3;

// export const recordVerboseResponse = (
//   deploymentId: string,
//   ceramicRecordId: string,
//   index?: number
// ): RecordVerboseResponsePayload => {
//   return {
//     data: {
//       attributes: {
//         anon: {
//           data: {
//             wallet: '0x87c1a0b300e6adef8e67db0651eafe41b05b58fd',
//           },
//           salt: null,
//           sig: null,
//         },
//         deployment_id: '0x3261303833613865643264303439356562353161633834303532356163336633',
//         meta: {
//           data: {
//             fingerprint: 'b25349a973252a2a0134ac4e276cbbcf5deee13c',
//           },
//           salt: null,
//           sig: {
//             keyType: 'secp256k1',
//             sig: '0x7cb8b696effa8e113070ba961e4a612dd118fb63ba21931a3dc8bf15e72cb6fb5ba72717804229d3304ef426bbe4081dd60ded83e3ad2e912c301ba51a538b691b',
//           },
//         },
//         pii: {
//           data: {
//             email: 'pkearney06@gmail.com',
//           },
//           salt: null,
//           sig: {
//             keyType: 'secp256k1',
//             sig: '0x11ef023e03e6b6071bd1af45e910baa7e28590c21ce06cdfd039f281cb58231b7283d14865472d06de2c964a0e5dffebe3cc55640592647bd894bd8bd61fe4c31c',
//           },
//         },
//         source_id: 0,
//         store_id: 'ceramic://kjzl6cwe1jw14bgsfm8dn09eqgreui4x8ab5hzhfmrvsbgw7qcl1qn2w1khtem8',
//         timestamp: 'Fri, 09 Sep 2022 13:18:58 GMT',
//         transactionId: null,
//         uid: '0x3037646466373961646464363538383062366531646631633463303636386437',
//         v: 1,
//       },
//       id: 'ceramic://kjzl6cwe1jw14bgsfm8dn09eqgreui4x8ab5hzhfmrvsbgw7qcl1qn2w1khtem8',
//       links: {
//         self: `/deployments/2d0ef479-9713-4466-84a0-029d2f9c3ab9/records/${ceramicRecordId}`,
//       },
//       relationships: {},
//       type: 'records',
//     },
//     fingerprint: 'b25349a973252a2a0134ac4e276cbbcf5deee13c',
//     includes: [],
//     jsonapi: {
//       version: '1.0',
//     },
//     links: {
//       self: `/deployments/2d0ef479-9713-4466-84a0-029d2f9c3ab9/records/${ceramicRecordId}`,
//     },
//   };
// };
// // export const recordVerboseResponse = (
// //   deploymentId: string,
// //   ceramicRecordId: string,
// //   index?: number
// // ): RecordVerboseResponsePayload => {
// //   return {
// //     data: {
// //       type: 'records',
// //       attributes: {
// //         record: {
// //           record: {
// //             uid: 'mock@garbage.com',
// //             deploymentId,
// //             flags: 111,
// //             sourceId: 2,
// //             otherData: {
// //               values: {
// //                 email: 'mock@garbage.com',
// //                 phone_number: '19998887654',
// //                 first_name: 'Mock 1',
// //                 last_name: 'Mock 2',
// //               },
// //               private_values: {
// //                 street_address: '000 Mockingbird Ave',
// //                 zip_code: '10001',
// //               },
// //             },
// //             timestamp: 1654615270969,
// //           },
// //           signature: {
// //             signature:
// //               '0x599aeae41773388e945274cd429bfdb28ae9e11b7acc12d51c1b6d00a51b1483794a1d06110124bf030e78f4135f63fea597fb548b5c317df6870ec3b104e7341c',
// //             keyType: 'secp256k1',
// //           },
// //           recordId: index ? `ceramic://sample-${padWithZeros(index, PAD_LENGTH)}` : `${ceramicRecordId}`,
// //           transactionId:
// //             '3qhb9m4SKpeCa6VfaCHxD2Dc3yDWoDDoo1DmqPXz8oGU1T8pyFtiUfEd5uuovZKk6tbRq7fVVzTyrqDC7wKCx47',
// //         },
// //         record_id: index ? `ceramic://sample-${padWithZeros(index, PAD_LENGTH)}` : `${ceramicRecordId}`,
// //       },
// //       id: '2d0ef479-9713-4466-84a0-029d2f9c3ab9',
// //       links: {
// //         self: `/deployments/2d0ef479-9713-4466-84a0-029d2f9c3ab9/records/${ceramicRecordId}`,
// //       },
// //     },
// //     links: {
// //       self: `/deployments/2d0ef479-9713-4466-84a0-029d2f9c3ab9/records/${ceramicRecordId}`,
// //     },
// //     jsonapi: {
// //       version: '1.0',
// //     },
// //   };
// // };

// export const recordResponse: RecordSlimResponsePayload = {
//   data: {
//     type: 'records',
//     attributes: {
//       record_id: 'ceramic://kjzl6cwe1jw146um7iojomvw7w0ek2sgc6qu6unih9m6fj2qip528qd3u4vkyf5',
//       record: {
//         recordId: 'ceramic://kjzl6cwe1jw146um7iojomvw7w0ek2sgc6qu6unih9m6fj2qip528qd3u4vkyf5',
//         transactionId:
//           '3qhb9m4SKpeCa6VfaCHxD2Dc3yDWoDDoo1DmqPXz8oGU1T8pyFtiUfEd5uuovZKk6tbRq7fVVzTyrqDC7wKCx47',
//       },
//     },
//     id: '2d0ef479-9713-4466-84a0-029d2f9c3ab9',
//     links: {
//       self: '/deployments/2d0ef479-9713-4466-84a0-029d2f9c3ab9/records/ceramic://kjzl6cwe1jw146um7iojomvw7w0ek2sgc6qu6unih9m6fj2qip528qd3u4vkyf5',
//     },
//   },
//   links: {
//     self: '/deployments/2d0ef479-9713-4466-84a0-029d2f9c3ab9/records/ceramic://kjzl6cwe1jw146um7iojomvw7w0ek2sgc6qu6unih9m6fj2qip528qd3u4vkyf5',
//   },
//   jsonapi: {
//     version: '1.0',
//   },
// };

// const recordTemplate = (index: number, id: string): RecordSlimResponseData => {
//   const recordId = `ceramic://${padWithZeros(index, PAD_LENGTH)}`;
//   return {
//     type: 'records',
//     attributes: {
//       record_id: recordId,
//       record: {
//         recordId,
//         transactionId:
//           '3qhb9m4SKpeCa6VfaCHxD2Dc3yDWoDDoo1DmqPXz8oGU1T8pyFtiUfEd5uuovZKk6tbRq7fVVzTyrqDC7wKCx47',
//       },
//     },
//     id,
//     links: {
//       self: `/deployments/${id}/records/${recordId}`,
//     },
//   };
// };

// export const recordsResponse = (
//   deploymentId: string,
//   num: number
// ): RecordsSlimResponsePayload => {
//   // const data = dataExplorerSearchDecrypted.map((_, i) => recordTemplate(padWithZeros(i, 8), i));
//   const data = Array(num)
//     .fill('')
//     .map((_, i) => recordTemplate(i, deploymentId));
//   return {
//     data,
//     links: {
//       self: `http://api.waev-staging.com/deployments/${deploymentId}/records`,
//     },
//     meta: {
//       count: num,
//     },
//     jsonapi: {
//       version: '1.0',
//     },
//   };
// };
