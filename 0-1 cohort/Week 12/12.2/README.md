# Advanced Typescript APIs

## Pick

- Allows us to create a new type from an existing type (`Type`) by selecting the properties (`Keys`) we want to keep.
  <br>
- `Pick` is a utility type that is **used to create a new type by selecting the properties from an existing type**.
  <br>
- Syntax: `Pick<Type, Keys>`
  - `Type`: The type from which we want to pick the properties.
  - `Keys`: The union of the keys of `Type` that we want to pick.

<br>

- Example

  ```ts
  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  ```

  <details>
    <summary>Explaining above command</summary>

  - `T` is the type from which we want to pick the properties.
  - `K` is the union of the keys of `T` that we want to pick. In simple words, it is the list of properties we want to keep.
  - `P in K` is a mapped type that iterates over each key in `K`. For eg: if `K` is `name`, then `P in K` will iterate over `name`.
  - `T[P]` is the type of the property `P` in `T`. For eg: if `P` is `name`, then `T[P]` is the type of `name` property in `T` which is `string`.
  </details>

## Partial

- makes all properties of a type optional.
- creates a type with same properties but each marked as optional.

<br>

- Example
  ```ts
  type User = {
    name: string;
    age: number;
  };

  type PartialUser = Partial<User>; // { name?: string; age?: number; }
  ```

## Readonly

In JS, when we put a `const` before creating an array or an object, it doesn't make the array or object immutable. We can still change the properties of the object or array.

This happens because, we are making the reference to the object or array immutable, not the object or array itself.

Example 👇

```ts
const arr = [1, 2, 3];
arr.push(4); // here, we are changing the elements inside of array. This is accepted.

arr = [4, 5, 6]; // this is not accepted as we are changing the reference of the array.

//same with object

const obj = { name: 'John', age: 25 };
obj.age = 26; // accepted

obj = { name: 'Doe', age: 30 }; // not accepted
```

---

Slides [here](https://projects.100xdevs.com/tracks/ts-hard/ts-hard-1).