import { HttpMethod } from "../routes/decorators";

// 401 error structure
const NotFound = {
  description: `NotFound message `,
  content: {
    "application/json": {
      schema: {
        $ref: `#/components/schemas/NotFound`,
      },
    },
  },
};
// 404 error strucute
const Unauthorized = {
  description: `Unauthorized message `,
  content: {
    "application/json": {
      schema: {
        $ref: `#/components/schemas/Unauthorized`,
      },
    },
  },
};

//limit
//offset
//include=[modelName]
//where={"tittle":{"$like":"%Note%"}}

export default function PathGenerator(
  path: string,
  modelName: string,
  httpMethod: string,
  authRequired: boolean = false,
  responseSchema?: string,
  requestSchema?: any,
  parameters?: any,
) {
  switch (httpMethod) {
    case HttpMethod.GET:
      //if end with "}" is a specific resource
      if (path.endsWith("}")) {
        return getGenerator(
          modelName,
          authRequired,
          responseSchema,
          parameters,
        );
      }
      return getListGenerator(modelName, authRequired, responseSchema);
      break;
    case HttpMethod.POST:
      //@ts-ignore
      return postGenerator(
        modelName,
        authRequired,
        requestSchema,
        responseSchema,
      );
      break;
    case HttpMethod.PUT:
      //@ts-ignore
      return putGenerator(
        modelName,
        authRequired,
        requestSchema,
        responseSchema,
        parameters,
      );
      break;
    case HttpMethod.DELETE:
      //@ts-ignore
      return deleteGenerator(
        modelName,
        authRequired,
        responseSchema,
        parameters,
      );
      break;
    default:
      break;
  }
}
function getListGenerator(
  modelName: string,
  authRequired: boolean = false,
  responseSchema?: string,
) {
  if (!responseSchema) {
    responseSchema = modelName + "ResponseList";
  }
  let schema = {
    get: {
      parameters: [
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            example: 0,
          },
        },
        {
          in: "query",
          name: "offset",
          schema: {
            type: "integer",
            example: 1,
          },
        },
        {
          in: "query",
          name: "offset",
          schema: {
            type: "string",
            example: "[user]",
          },
        },
        {
          in: "query",
          name: "order",
          schema: {
            type: "string",
            example: "ASC",
          },
        },
        {
          in: "query",
          name: "where",
          schema: {
            type: "string",
            example: '{"tittle":{"$like":"%Note%"}}',
          },
        },
      ],
      responses: {
        "200": {
          description: `A list of ${modelName}s `,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "ok" },
                  count: { type: "integer", example: 3 },
                  limit: { type: "integer", example: 99 },
                  offset: { type: "integer", example: 0 },
                  data: {
                    $ref: `#/components/schemas/${responseSchema}`,
                  },
                },
              },
            },
          },
        },
        "401": Unauthorized,
      },
      tags: [`${modelName}`],
    },
  };
  if (!authRequired) {
    schema.get["security"] = [];
  }
  return schema;
}
function getGenerator(
  modelName: string,
  authRequired: boolean = false,
  responseSchema?: string,
  parameters?: Array<object>,
) {
  if (!responseSchema) {
    responseSchema = modelName + "Response";
  }
  if (!parameters) {
    parameters = [
      {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "integer",
          minimum: 1,
        },
        description: `The ${modelName} Id`,
      },
    ];
  }
  let schema = {
    get: {
      summary: `Get a ${modelName}`,
      parameters,
      responses: {
        "200": {
          description: `A single ${modelName}`,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "ok",
                  },
                  data: {
                    $ref: `#/components/schemas/${responseSchema}`,
                  },
                },
              },
            },
          },
        },
        "401": Unauthorized,
        "404": NotFound,
      },
      tags: [`${modelName}`],
    },
  };
  if (!authRequired) {
    schema.get["security"] = [];
  }
  return schema;
}
function postGenerator(
  modelName: string,
  authRequired: boolean = false,
  requestSchema?: string,
  responseSchema?: string,
) {
  if (!responseSchema) {
    responseSchema = modelName + "Response";
  }
  if (!requestSchema) {
    requestSchema = modelName + "Request";
  }
  let schema = {
    post: {
      summary: `Adds a new ${modelName}`,
      requestBody: {
        description: `${modelName} request`,
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${requestSchema}`,
            },
          },
        },
      },
      responses: {
        "201": {
          description: `Created`,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Created",
                  },
                  data: {
                    $ref: `#/components/schemas/${responseSchema}`,
                  },
                },
              },
            },
          },
        },
        "401": Unauthorized,
      },
      tags: [`${modelName}`],
    },
  };
  if (!authRequired) {
    schema.post["security"] = [];
  }
  return schema;
}
function putGenerator(
  modelName: string,
  authRequired: boolean = false,
  updateSchema?: string,
  responseSchema?: string,
  parameters?: Array<object>,
) {
  if (!responseSchema) {
    responseSchema = modelName + "Response";
  }
  if (!updateSchema) {
    updateSchema = modelName + "Update";
  }
  if (!parameters) {
    parameters = [
      {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "integer",
          minimum: 1,
        },
        description: `The ${modelName} Id`,
      },
    ];
  }
  let schema = {
    put: {
      operationId: `put${modelName}`,
      summary: `Upload ${modelName}`,
      parameters,
      requestBody: {
        description: `${modelName} update`,
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${updateSchema}`,
            },
          },
        },
      },
      responses: {
        "200": {
          description: `Updated`,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "ok",
                  },
                  data: {
                    $ref: `#/components/schemas/${responseSchema}`,
                  },
                },
              },
            },
          },
        },
        "401": Unauthorized,
        "404": NotFound,
      },
      tags: [`${modelName}`],
    },
  };
  if (!authRequired) {
    schema.put["security"] = [];
  }
  return schema;
}
function deleteGenerator(
  modelName: string,
  authRequired: boolean = false,
  responseSchema?: string,
  parameters?: Array<object>,
) {
  if (!responseSchema) {
    responseSchema = modelName + "Response";
  }
  if (!parameters) {
    parameters = [
      {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "integer",
          minimum: 1,
        },
        description: `The ${modelName} Id`,
      },
    ];
  }
  let schema = {
    delete: {
      operationId: `delete${modelName}`,
      summary: `delete ${modelName}`,
      parameters,
      responses: {
        "204": {
          description: `${modelName} Deleted`,
        },
        "401": Unauthorized,
        "404": NotFound,
      },
      tags: [`${modelName}`],
    },
  };
  if (!authRequired) {
    schema.delete["security"] = [];
  }
  return schema;
}
function pathsGenerator(modelName: string, authorizationOptions: any) {
  const basePath = modelName.toLocaleLowerCase();
  let paths = {
    [`/${basePath}`]: {
      get: {
        parameters: [
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              example: 0,
            },
          },
          {
            in: "query",
            name: "offset",
            schema: {
              type: "integer",
              example: 1,
            },
          },
          {
            in: "query",
            name: "offset",
            schema: {
              type: "string",
              example: "[user]",
            },
          },
          {
            in: "query",
            name: "order",
            schema: {
              type: "string",
              example: "ASC",
            },
          },
          {
            in: "query",
            name: "where",
            schema: {
              type: "string",
              example: '{"tittle":{"$like":"%Note%"}}',
            },
          },
        ],
        operationId: `gets${modelName}`,
        summary: `Get a list of ${modelName}s `,
        responses: {
          "200": {
            description: `A list of ${modelName}s `,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "ok" },
                    count: { type: "integer", example: 3 },
                    limit: { type: "integer", example: 99 },
                    offset: { type: "integer", example: 0 },
                    data: {
                      type: "array",
                      items: {
                        $ref: `#/components/schemas/${modelName}Response`,
                      },
                    },
                  },
                },
              },
            },
          },
          "401": Unauthorized,
        },
        tags: [`${modelName}`],
      },
      post: {
        operationId: `post${modelName}`,
        summary: `Adds a new ${modelName}`,
        requestBody: {
          description: `${modelName} request`,
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${modelName}Request`,
              },
            },
          },
        },
        responses: {
          "201": {
            description: `Created`,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Created",
                    },
                    data: {
                      $ref: `#/components/schemas/${modelName}Response`,
                    },
                  },
                },
              },
            },
          },
          "401": Unauthorized,
        },
        tags: [`${modelName}`],
      },
    },
    [`/${basePath}/{id}`]: {
      get: {
        operationId: `get${modelName}`,
        summary: `Get a ${modelName} by Id`,
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: `The ${modelName} Id`,
          },
        ],
        responses: {
          "200": {
            description: `A single ${modelName}`,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ok",
                    },
                    data: {
                      $ref: `#/components/schemas/${modelName}Response`,
                    },
                  },
                },
              },
            },
          },
          "401": Unauthorized,
          "404": NotFound,
        },
        tags: [`${modelName}`],
      },
      put: {
        operationId: `put${modelName}`,
        summary: `Upload ${modelName} by Id`,
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: `The ${modelName} Id`,
          },
        ],
        requestBody: {
          description: `${modelName} update`,
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${modelName}Update`,
              },
            },
          },
        },
        responses: {
          "200": {
            description: `Updated`,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ok",
                    },
                    data: {
                      $ref: `#/components/schemas/${modelName}Response`,
                    },
                  },
                },
              },
            },
          },
          "401": Unauthorized,
          "404": NotFound,
        },
        tags: [`${modelName}`],
      },
      delete: {
        operationId: `delete${modelName}`,
        summary: `delete ${modelName} by Id`,
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: `The ${modelName} Id`,
          },
        ],
        responses: {
          "204": {
            description: `${modelName} Deleted`,
          },
          "401": Unauthorized,
          "404": NotFound,
        },
        tags: [`${modelName}`],
      },
    },
  };

  //disable securty for get http method
  if (!authorizationOptions.get) {
    paths[`/${basePath}`].get["security"] = [];
    paths[`/${basePath}/{id}`].get["security"] = [];
  }

  //disable securty for post http method
  if (!authorizationOptions.post) {
    paths[`/${basePath}`].post["security"] = [];
  }

  //disable securty for put http method
  if (!authorizationOptions.put) {
    paths[`/${basePath}/{id}`].put["security"] = [];
  }

  //disable securty for delete http method
  if (!authorizationOptions.delete) {
    paths[`/${basePath}/{id}`].delete["security"] = [];
  }

  return paths;
}
