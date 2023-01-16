"use strict";

import {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { badRequestResponse } from "./responsesError.js";
import { buildResponse } from "./responses.js";

export const deleteItem = async (database, tableName, keyValue) => {
  try {
    await database.send(
      new DeleteCommand({
        TableName: tableName,
        Key: keyValue,
      })
    );
    const body = `Item deleted!`;
    return buildResponse(200, body);
  } catch (error) {
    badRequestResponse(error);
  }
};

export const getItem = async (database, tableName, keyValue) => {
  try {
    let body = await database.send(
      new GetCommand({
        TableName: tableName,
        Key: keyValue,
      })
    );
    body = body.Item;
    return buildResponse(200, {
      results: body,
    });
  } catch (error) {
    badRequestResponse(error);
  }
};

export const getItems = async (database, tableName) => {
  try {
    let body = await database.send(new ScanCommand({ TableName: tableName }));
    body = body.Items;
    return buildResponse(200, {
      results: body,
    });
  } catch (error) {
    badRequestResponse(error);
  }
};

export const saveItem = async (database, tableName, requestBody) => {
  try {
    await database.send(
      new PutCommand({
        TableName: tableName,
        Item: requestBody,
      })
    );
    const body = `Succes`;
    return buildResponse(200, body);
  } catch (error) {
    badRequestResponse(error);
  }
};

export const updateItem = async (
  database,
  tableName,
  keyValue,
  updateExpression,
  expressionAttributeValues
) => {
  try {
    const response = await database.send(
      new UpdateCommand({
        TableName: tableName,
        Key: keyValue,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "UPDATED_NEW",
      })
    );
    console.log("response", response);
    return buildResponse(200, response);
  } catch (error) {
    badRequestResponse(error);
  }
};

export default {
  deleteItem,
  getItem,
  getItems,
  saveItem,
  updateItem,
};
