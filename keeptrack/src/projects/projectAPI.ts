import { resolve } from "path";
import { Project } from "./Project";
import { error } from "console";

const baseUrl = "http://localhost:4000";
const url = `${baseUrl}/projects`;

function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return "please login again";
    case 403:
      return `You do not have permisssion to view the project(s).`;
    default:
      return `There was an error on retriving the project(s). Please try again.`;
  }
}

function checkStatus(response: any) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);
    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJson(response: any) {
  return response.json();
}

function delay(ms: number) {
  return function (x: any): Promise<any> {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}
function convertToProjectModel(item: any): Project {
  return new Project(item);
}
function convertToProjectModels(data: any[]): Project[] {
  let projects = data.map(convertToProjectModel);
  return projects;
}

const projectAPI = {
  get(page = 1, limit = 20) {
    return fetch(`${url}?_page=${page}&_limit=${limit}&_sort=name`)
      .then(delay(600))
      .then(checkStatus)
      .then(parseJson)
      .then(convertToProjectModels)
      .catch((error: TypeError) => {
        console.log("log client error " + error);
        throw new Error(
          "There was an error retriving the projects. Please try again."
        );
      });
  },
  put(project: Project) {
    return fetch(`${url}/${project.id}`, {
      method: "PUT",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJson)
      .catch((error: TypeError) => {
        console.log("log client error" + error);
        throw new Error(
          "There was an error on updating the project. Please try again"
        );
      });
  },

  find(id: number) {
    return fetch(`${url}/${id}`, {
      method: "GET",
    })
      .then(checkStatus)
      .then(parseJson)
      .then(convertToProjectModel)
      .catch((error: TypeError) => {
        console.log("log client error" + error);
        throw new Error(
          "There was an error on getting project. Please try again"
        );
      });
  },
};

export { projectAPI };
