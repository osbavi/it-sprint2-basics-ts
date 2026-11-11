import { assertType, describe, expect, expectTypeOf, it } from "vitest";
import { Equal, Expect } from "./helpers/type-utils";

describe("Problema de nombres", () => {
  it("Ha de sumar els dos nombres", () => {
    const addTwoNumbers = (a: number, b: number) => {
      return a + b;
    };
    expectTypeOf(addTwoNumbers).parameter(0).toEqualTypeOf<number>();
    expectTypeOf(addTwoNumbers).parameter(1).toEqualTypeOf<number>();
  });
});

describe("Problema de paràmetre objecte", () => {
  it("Ha de sumar els dos nombres", () => {
    const addTwoNumbers = (params: { first: number; second: number }) => {
      return params.first + params.second;
    };
    expect(
      addTwoNumbers({
        first: 2,
        second: 4,
      }),
    ).toEqual(6);

    expect(
      addTwoNumbers({
        first: 10,
        second: 20,
      }),
    ).toEqual(30);
    expectTypeOf(addTwoNumbers)
      .parameter(0)
      .toEqualTypeOf<{ first: number; second: number }>();
  });
});

describe("Problema de propietats opcionals", () => {
  const getName = (params: { first: string; last?: string }) => {
    if (params.last !== undefined) {
      return `${params.first} ${params.last}`;
    }
    return params.first;
  };

  it("Ha de funcionar només amb el nom", () => {
    const name = getName({
      first: "Jen",
    });

    expect(name).toEqual("Jen");
  });

  it("Ha de funcionar amb el nom i el cognom", () => {
    const name = getName({
      first: "Jen",
      last: "Simmons",
    });

    expect(name).toEqual("Jen Simmons");
  });
});

describe("Problema de paràmetres opcionals", () => {
  const getName = (first: string, last?: string) => {
    if (last !== undefined) {
      return `${first} ${last}`;
    }
    return first;
  };

  it("Ha de funcionar només amb el nom", () => {
    const name = getName("Jen");

    expect(name).toEqual("Jen");
  });

  it("Ha de funcionar amb el nom i el cognom", () => {
    const name = getName("Jen", "Simmons");

    expect(name).toEqual("Jen Simmons");
  });
});

describe("Problema d'assignació de tipus a variables", () => {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
  }

  const defaultUser: User = {
    id: 1,
    firstName: "Oscar",
    lastName: "Ballart",
    isAdmin: true,
  };

  const getUserId = (user: User) => {
    return user.id;
  };

  it("Ha d'obtenir l'identificador de l'usuari", () => {
    expect(getUserId(defaultUser)).toEqual(1);
  });
});

describe("Problema d'unions", () => {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: "admin" | "user" | "super-admin";
  }

  const defaultUser: User = {
    id: 1,
    firstName: "Jen",
    lastName: "Simmons",
    // @ts-expect-error
    role: "I_SHOULD_NOT_BE_ALLOWED",
  };
});

describe("Problema d'arrays", () => {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: "admin" | "user" | "super-admin";
    posts: Post[];
  }

  interface Post {
    id: number;
    title: string;
  }

  const defaultUser: User = {
    id: 1,
    firstName: "Jen",
    lastName: "Simmons",
    role: "admin",
    posts: [
      {
        id: 1,
        title: "Com menjo tant de formatge",
      },
      {
        id: 2,
        title: "Per què no menjo més verdures",
      },
    ],
  };
});

describe("Problema d'anotacions de tipus de retorn de funció", () => {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: "admin" | "user" | "super-admin";
    posts: Array<Post>;
  }

  interface Post {
    id: number;
    title: string;
  }

  const makeUser = (): User => {
    return {
      id: 1,
      firstName: "Oscar",
      lastName: "Ballart",
      role: "admin",
      posts: [{ id: 1, title: "comiendo chocolate" }],
    };
  };

  it("Ha de retornar un usuari vàlid", () => {
    const user = makeUser();

    expect(user.id).toBeTypeOf("number");
    expect(user.firstName).toBeTypeOf("string");
    expect(user.lastName).toBeTypeOf("string");
    expect(user.role).to.be.oneOf(["super-admin", "admin", "user"]);

    expect(user.posts[0].id).toBeTypeOf("number");
    expect(user.posts[0].title).toBeTypeOf("string");
  });
});

describe("Problema de promeses", () => {
  interface LukeSkywalker {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
  }

  const fetchLukeSkywalker = async (): Promise<LukeSkywalker> => {
    const data = await fetch("https://swapi.py4e.com/api/people/1").then((res) => {
      return res.json();
    });

    return data;
  };
  it("ha de retornar una promesa", async () => {
    const result = fetchLukeSkywalker();

    expect(result).toBeInstanceOf(Promise);
  });
});

describe("Problema de Set", () => {
  const guitarists = new Set<string>();

  guitarists.add("Jimi Hendrix");
  guitarists.add("Eric Clapton");

  it("Ha de contenir en Jimi i l'Eric", () => {
    expect(guitarists.has("Jimi Hendrix")).toEqual(true);
    expect(guitarists.has("Eric Clapton")).toEqual(true);
  });

  it("Ha de donar un error de tipus si proves d'afegir un valor que no sigui string", () => {
    // @ts-expect-error
    guitarists.add(2);
  });

  it("Ha de ser un Set<string> que es pugui convertir a string[]", () => {
    const guitaristsAsArray = Array.from(guitarists);

    type tests = [Expect<Equal<typeof guitaristsAsArray, string[]>>];
  });
});

describe("Problema de Record", () => {
  const createCache = () => {
    let cache: Record<string, string> = {};

    const add = (id: string, value: string) => {
      cache[id] = value;
    };

    const remove = (id: string) => {
      delete cache[id];
    };

    return {
      cache,
      add,
      remove,
    };
  };

  it("Ha d'afegir valors a la memòria cache", () => {
    const cache = createCache();

    cache.add("123", "Jen");

    expect(cache.cache["123"]).toEqual("Jen");
  });

  it("Ha d'eliminar valors de la memòria cache", () => {
    const cache = createCache();

    cache.add("123", "Jen");
    cache.remove("123");

    expect(cache.cache["123"]).toEqual(undefined);
  });
});

describe("Problema de filtratge amb typeof", () => {
  const coerceAmount = (amount: number | { amount: number }) => {
    if (typeof amount === "number") {
      return amount;
    }
    return amount.amount;
  };

  it("Ha de retornar l'import quan es passa un objecte", () => {
    expect(coerceAmount({ amount: 20 })).toEqual(20);
  });

  it("Ha de retornar l'import quan es passa un nombre", () => {
    expect(coerceAmount(20)).toEqual(20);
  });
});

describe("Problema de blocs catch", () => {
  const tryCatchDemo = (state: "fail" | "succeed") => {
    try {
      if (state === "fail") {
        throw new Error("Failure!");
      }
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }
    }
  };

  it("Ha de retornar el missatge quan falla", () => {
    expect(tryCatchDemo("fail")).toEqual("Failure!");
  });
});

describe("Problema d'herència amb extends", () => {
  interface Base {
    id: string;
  }

  interface User extends Base {
    firstName: string;
    lastName: string;
  }

  interface Post extends Base {
    title: string;
    body: string;
  }

  interface Comment extends Base {
    comment: string;
  }

  type tests = [
    Expect<Equal<User, { id: string; firstName: string; lastName: string }>>,
    Expect<Equal<Post, { id: string; title: string; body: string }>>,
    Expect<Equal<Comment, { id: string; comment: string }>>,
  ];
});

describe("Problema d'intersecció de tipus", () => {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
  }

  interface Post {
    id: string;
    title: string;
    body: string;
  }

  const getDefaultUserAndPosts = (): User & { posts: Post[] } => {
    return {
      id: "1",
      firstName: "Jen",
      lastName: "Simmons",
      posts: [
        {
          id: "1",
          title: "Com vaig aprendre a tocar la guitarra",
          body: "Va ser un acord perfecte des del principi",
        },
      ],
    };
  };

  const userAndPosts = getDefaultUserAndPosts();

  console.log(userAndPosts.posts[0]);

  it("Ha de retornar usuari amb posts", () => {
    const userAndPosts = getDefaultUserAndPosts();

    expect(userAndPosts.posts[0].id).toBeTypeOf("string");
  });
});

describe("Problema d'Omit i Pick", () => {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
  }

  type MyType = Omit<User, "id">;

  type tests = [Expect<Equal<MyType, { firstName: string; lastName: string }>>];
});

describe("Problema de tipus de funció", () => {
  const addListener = (onFocusChange: (focused: boolean) => void) => {
    window.addEventListener("focus", () => {
      onFocusChange(true);
    });

    window.addEventListener("blur", () => {
      onFocusChange(false);
    });
  };

  addListener((isFocused) => {
    console.log({ isFocused });

    type tests = [Expect<Equal<typeof isFocused, boolean>>];
  });
});

describe("Problema de tipus de funció amb promeses", () => {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
  }

  const createThenGetUser = async (
    createUser: () => Promise<string>,
    getUser: (id: string) => Promise<User>,
  ): Promise<User> => {
    const userId: string = await createUser();

    const user = await getUser(userId);

    return user;
  };

  it("Ha de crear l'usuari i després obtenir-lo", async () => {
    const user = await createThenGetUser(
      async () => "123",
      async (id) => ({
        id,
        firstName: "Jen",
        lastName: "Simmons",
      }),
    );

    expect(user).toEqual({
      id: "123",
      firstName: "Jen",
      lastName: "Simmons",
    });
  });
});

describe("Problema d'extreure el tipus de retorn d'una funció", () => {
  const myFunc = () => {
    return "Oscar";
  };
  type MyFuncReturn = ReturnType<typeof myFunc>;
  type tests = [Expect<Equal<MyFuncReturn, string>>];
});
