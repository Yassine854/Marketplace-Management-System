"use client";

import Banner from "../Banner";
import Box from "../Box";
import { faker } from "@faker-js/faker";
export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    role: faker.name.jobTitle(),
  };
}

//   {
//     name: "Carmelo",
//     email: "Jeremy.Fadel@gmail.com",
//     role: "Usability",
//   },
//   {
//     name: "Adan",
//     email: "Warren.Keeling@hotmail.com",
//     role: "Program",
//   },
//   {
//     name: "Franz",
//     email: "Laila11@yahoo.com",
//     role: "Branding",
//   },
//   {
//     name: "Patricia",
//     email: "Burdette38@gmail.com",
//     role: "Implementation",
//   },
//   {
//     name: "Ardella",
//     email: "Walton.Hahn92@hotmail.com",
//     role: "Branding",
//   },
//   {
//     name: "Jalyn",
//     email: "Ruby60@hotmail.com",
//     role: "Usability",
//   },
//   {
//     name: "Cordia",
//     email: "Ellie49@gmail.com",
//     role: "Marketing",
//   },
//   {
//     name: "Daphney",
//     email: "Davin_Bernier@yahoo.com",
//     role: "Accountability",
//   },
// ];
export const users = faker.helpers.multiple(createRandomUser, {
  count: 25,
});

const UsersTable = () => {
  return (
    <Box title="Users ">
      <Banner>
        <div className="flex gap-4 xl:gap-6">
          <div className="btn cursor-pointer">Add User</div>
        </div>
      </Banner>
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ borderSpacing: "0 12px" }}
        className="relative bottom-0  left-0 right-0 top-0 h-full w-full  border-separate whitespace-nowrap border-none  "
      >
        <thead className="sticky  left-0 right-0 top-14 w-full  cursor-pointer bg-n30 even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
          <tr className=" h-16 p-4   font-semibold">
            <td>
              <div className="flex items-center justify-center text-2xl ">
                Name
              </div>
            </td>
            <td>
              <div className="flex items-center justify-center text-2xl ">
                Email
              </div>
            </td>
            <td>
              <div className="flex items-center justify-center text-2xl ">
                Role
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          {users.map((e, i) => {
            return (
              <tr
                key={i}
                className="h-8 cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
                onClick={() => {}}
              >
                <td>
                  <div className="flex items-center justify-center">
                    {e.username}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    {e.email}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    {e.role}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

export default UsersTable;
