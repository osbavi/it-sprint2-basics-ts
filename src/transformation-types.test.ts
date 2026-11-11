import { describe, expect, it } from "vitest";
import { Equal, Expect } from "./helpers/type-utils";

describe("Transformació: obtenir el tipus de retorn d'una funció", () => {
  const myFunc = () => {
    return "hello";
  };

  type MyFuncReturn = ReturnType<typeof myFunc>;

  type tests = [Expect<Equal<MyFuncReturn, string>>];
});

describe("Transformació: obtenir els paràmetres d'una funció", () => {
  const makeQuery = (
    url: string,
    opts?: {
      method?: string;
      headers?: {
        [key: string]: string;
      };
      body?: string;
    },
  ) => {};

  type MakeQueryParameters = Parameters<typeof makeQuery>;

  type tests = [
    Expect<
      Equal<
        MakeQueryParameters,
        [
          url: string,
          opts?: {
            method?: string;
            headers?: {
              [key: string]: string;
            };
            body?: string;
          },
        ]
      >
    >,
  ];
});

describe("Transformació: obtenir el tipus de retorn d'una funció asíncrona", () => {
  const getUser = () => {
    return Promise.resolve({
      id: "123",
      name: "John",
      email: "john@example.com",
    });
  };

  type ReturnValue = Awaited<ReturnType<typeof getUser>>;

  type tests = [
    Expect<Equal<ReturnValue, { id: string; name: string; email: string }>>,
  ];
});

describe("Transformació: obtenir les claus d'un objecte", () => {
  const testingFrameworks = {
    vitest: {
      label: "Vitest",
    },
    jest: {
      label: "Jest",
    },
    mocha: {
      label: "Mocha",
    },
  };

  type TestingFramework = keyof typeof testingFrameworks;

  type tests = [Expect<Equal<TestingFramework, "vitest" | "jest" | "mocha">>];
});

describe("Transformació: indexed access amb objectes", () => {
  const fakeDataDefaults = {
    String: "Default string",
    Int: 1,
    Float: 1.14,
    Boolean: true,
    ID: "id",
  };

  type StringType = (typeof fakeDataDefaults)["String"];
  type IntType = (typeof fakeDataDefaults)["Int"];
  type FloatType = (typeof fakeDataDefaults)["Float"];
  type BooleanType = (typeof fakeDataDefaults)["Boolean"];
  type IDType = (typeof fakeDataDefaults)["ID"];

  type tests = [
    Expect<Equal<StringType, string>>,
    Expect<Equal<IntType, number>>,
    Expect<Equal<FloatType, number>>,
    Expect<Equal<BooleanType, boolean>>,
    Expect<Equal<IDType, string>>,
  ];
});

describe("Transformació: indexed access amb unions", () => {
  const programModeEnumMap = {
    GROUP: "group",
    ANNOUNCEMENT: "announcement",
    ONE_ON_ONE: "1on1",
    SELF_DIRECTED: "selfDirected",
    PLANNED_ONE_ON_ONE: "planned1on1",
    PLANNED_SELF_DIRECTED: "plannedSelfDirected",
  } as const;

  type IndividualProgram = (typeof programModeEnumMap)[
    | "ONE_ON_ONE"
    | "SELF_DIRECTED"
    | "PLANNED_ONE_ON_ONE"
    | "PLANNED_SELF_DIRECTED"];

  type tests = [
    Expect<
      Equal<
        IndividualProgram,
        "1on1" | "selfDirected" | "planned1on1" | "plannedSelfDirected"
      >
    >,
  ];
});

describe("Transformació: obtenir el tipus dels valors d'un array", () => {
  const fruits = ["apple", "banana", "orange"] as const;

  type AppleOrBanana = (typeof fruits)[0 | 1];
  type Fruit = (typeof fruits)[number];

  type tests = [
    Expect<Equal<AppleOrBanana, "apple" | "banana">>,
    Expect<Equal<Fruit, "apple" | "banana" | "orange">>,
  ];
});

// /*
// Repte 8:
// Utilitza indexed access types per obtenir el tipus dels valors d'un objecte amb as const.
// */
// describe("Transformació: obtenir el tipus dels valors d'un objecte amb as const", () => {
//   const frontendToBackendEnumMap = {
//     singleModule: "SINGLE_MODULE",
//     multiModule: "MULTI_MODULE",
//     sharedModule: "SHARED_MODULE",
//   } as const;

//   type BackendModuleEnum = unknown;

//   type tests = [
//     Expect<
//       Equal<BackendModuleEnum, "SINGLE_MODULE" | "MULTI_MODULE" | "SHARED_MODULE">
//     >,
//   ];
// });

// /*
// Repte 9:
// Dona un exemple de terminologia: union, discriminated union i enum.
// */
// describe("Transformació: terminologia de tipus", () => {
//   /**
//    * És important entendre la terminologia sobre unions:
//    *
//    * Una de les declaracions de tipus següents és una union.
//    * Una de les declaracions de tipus següents és una discriminated union.
//    * Una de les declaracions de tipus següents és un enum.
//    *
//    * Quina és quina?
//    */

//   type A =
//     | {
//         type: "a";
//         a: string;
//       }
//     | {
//         type: "b";
//         b: string;
//       }
//     | {
//         type: "c";
//         c: string;
//       };

//   type B = "a" | "b" | "c";

//   enum C {
//     A = "a",
//     B = "b",
//     C = "c",
//   }
// });

// /*
// Repte 10:
// Extreu un tipus d'un element concret d'una discriminated union.
// */
// describe("Transformació: extract d'una discriminated union", () => {
//   type Event =
//     | {
//         type: "click";
//         event: MouseEvent;
//       }
//     | {
//         type: "focus";
//         event: FocusEvent;
//       }
//     | {
//         type: "keydown";
//         event: KeyboardEvent;
//       };

//   type ClickEvent = unknown;

//   type tests = [Expect<Equal<ClickEvent, { type: "click"; event: MouseEvent }>>];
// });

// /*
// Repte 11:
// Exclou un tipus concret d'una discriminated union.
// */
// describe("Transformació: exclude d'una discriminated union", () => {
//   type Event =
//     | {
//         type: "click";
//         event: MouseEvent;
//       }
//     | {
//         type: "focus";
//         event: FocusEvent;
//       }
//     | {
//         type: "keydown";
//         event: KeyboardEvent;
//       };

//   type NonKeyDownEvents = unknown;

//   type tests = [
//     Expect<
//       Equal<
//         NonKeyDownEvents,
//         | { type: "click"; event: MouseEvent }
//         | { type: "focus"; event: FocusEvent }
//       >
//     >,
//   ];
// });

// /*
// Repte 12:
// Extreu el tipus del discriminador d'una discriminated union.
// */
// describe("Transformació: obtenir el tipus del discriminador d'una discriminated union", () => {
//   type Event =
//     | {
//         type: "click";
//         event: MouseEvent;
//       }
//     | {
//         type: "focus";
//         event: FocusEvent;
//       }
//     | {
//         type: "keydown";
//         event: KeyboardEvent;
//       };

//   type EventType = unknown;

//   type tests = [Expect<Equal<EventType, "click" | "focus" | "keydown">>];
// });

// /*
// Repte 13:
// Utilitza l'array per resoldre els dos tipus:
// - AppleOrBanana, que ha de ser una unió dels dos primers valors de l'array ("apple" | "banana").
// - Fruit, que ha de ser una unió de tots els valors de l'array ("apple" | "banana" | "orange").

// Llegeix la secció sobre Indexed Access Types de la documentació de TypeScript, per resoldre l'ercicici
// Pista
// Pots utilitzar l'operador typeof per obtenir el tipus de l'array i després accedir als seus valors amb l'índex [number] o amb una tupla d'índexs específics.
//  */

// describe("Transformació: obtenir el tipus a partir d'un array de valors", () => {
// const fruits = ["apple", "banana", "orange"];

// type AppleOrBanana = unknown;
// type Fruit = unknown;

// type tests = [
//   Expect<Equal<AppleOrBanana, "apple" | "banana">>,
//   Expect<Equal<Fruit, "apple" | "banana" | "orange">>,
// ];
// });
