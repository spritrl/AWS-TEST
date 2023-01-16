import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  deleteItem,
  getItem,
  getItems,
  saveItem,
  updateItem,
} from "./methods/common/restMethods.js";
import { buildResponse } from "./methods/common/responses.js";
import { notFoundResponse } from "./methods/common/responsesError.js";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const dynamodbTableName = "product-inventory";
const healthPath = "/health";
const productPath = "/product";
const productsPath = "/products";

export const handler = async (event, context) => {
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === "GET" && event.path === productPath:
      response = await getProduct(event.queryStringParameters.productId);
      break;
    case event.httpMethod === "GET" && event.path === productsPath:
      response = await getProducts();
      break;
    case event.httpMethod === "POST" && event.path === productPath:
      response = await saveProduct(JSON.parse(event.body));
      break;
    case event.httpMethod === "PATCH" && event.path === productPath:
      const requestBody = JSON.parse(event.body);
      response = await modifyProduct(
        requestBody.productId,
        requestBody.updateKey,
        requestBody.updateValue
      );
      break;
    case event.httpMethod === "DELETE" && event.path === productPath:
      response = await deleteProduct(JSON.parse(event.body).productId);
      break;
    default:
      notFoundResponse("Switch default.");
  }
  return response;
};

const getProduct = async (productId) => {
  return getItem(dynamodb, dynamodbTableName, { productId: productId });
};

const getProducts = async () => {
  return getItems(dynamodb, dynamodbTableName);
};

const saveProduct = async (requestBody) => {
  return saveItem(dynamodb, dynamodbTableName, requestBody);
};

const deleteProduct = async (productId) => {
  return deleteItem(dynamodb, dynamodbTableName, { productId: productId });
};

async function modifyProduct(productId, updateKey, updateValue) {
  return updateItem(
    dynamodb,
    dynamodbTableName,
    {
      productId: productId,
    },
    `set ${updateKey} = :value`,
    {
      ":value": updateValue,
    }
  );
}
