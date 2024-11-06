export async function fetchPeople() {
  console.log("loading...");
  try {
    const res = await fetch("https://cse341-l5-personal.onrender.com/accounts/", {
      method: "GET", 
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      throw new Error("No data found!");
    }
    const records = await res.json();
    console.log(records);
    return records;

  } catch (error) {
    return null;
  }
}

export default async function populate(callback, elm) {
  const people = await callback();
  let name;
  console.log(elm);

  people.map(person => {
    // console.log(`${person.firstName} ${person.lastName}`);
    name = document.createElement("option");
    name.className = "people";
    name.value = `${person.firstName[0].toLowerCase()}${person.lastName.toLowerCase()}`;
    name.textContent = `${person.firstName} ${person.lastName}`;
    elm.appendChild(name);
  })
}

function expandNav() {
  this.parentElement.classList.toggle("expand");
}

const list = document.querySelector("#patient");
populate(fetchPeople, list);

const nav = document.querySelector(".nav-ul");

nav.addEventListener("click", expandNav)