/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetSongs($pagination: PaginationArg) {\n    songs(pagination: $pagination) {\n      data {\n        id\n        attributes {\n          name\n          description\n          audio {\n            data {\n              id\n              attributes {\n                name\n                alternativeText\n                caption\n                url\n              }\n            }\n          }\n          createdAt\n          updatedAt\n          publishedAt\n        }\n      }\n    }\n  }\n": types.GetSongsDocument,
    "\n  query GetSong($id: ID) {\n    song(id: $id) {\n      data {\n        id\n        attributes {\n          name\n          description\n          audio {\n            data {\n              id\n              attributes {\n                name\n                alternativeText\n                caption\n                width\n                height\n                formats\n                hash\n                ext\n                mime\n                size\n                url\n                previewUrl\n                provider\n                provider_metadata\n                createdAt\n                updatedAt\n              }\n            }\n          }\n          createdAt\n          updatedAt\n          publishedAt\n        }\n      }\n    }\n  }\n": types.GetSongDocument,
    "\n  mutation Register($username: String!, $email: String!, $password: String!) {\n    register(\n      input: { username: $username, email: $email, password: $password }\n    ) {\n      jwt\n      user {\n        id\n        username\n        email\n        confirmed\n      }\n    }\n  }\n": types.RegisterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSongs($pagination: PaginationArg) {\n    songs(pagination: $pagination) {\n      data {\n        id\n        attributes {\n          name\n          description\n          audio {\n            data {\n              id\n              attributes {\n                name\n                alternativeText\n                caption\n                url\n              }\n            }\n          }\n          createdAt\n          updatedAt\n          publishedAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSongs($pagination: PaginationArg) {\n    songs(pagination: $pagination) {\n      data {\n        id\n        attributes {\n          name\n          description\n          audio {\n            data {\n              id\n              attributes {\n                name\n                alternativeText\n                caption\n                url\n              }\n            }\n          }\n          createdAt\n          updatedAt\n          publishedAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSong($id: ID) {\n    song(id: $id) {\n      data {\n        id\n        attributes {\n          name\n          description\n          audio {\n            data {\n              id\n              attributes {\n                name\n                alternativeText\n                caption\n                width\n                height\n                formats\n                hash\n                ext\n                mime\n                size\n                url\n                previewUrl\n                provider\n                provider_metadata\n                createdAt\n                updatedAt\n              }\n            }\n          }\n          createdAt\n          updatedAt\n          publishedAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSong($id: ID) {\n    song(id: $id) {\n      data {\n        id\n        attributes {\n          name\n          description\n          audio {\n            data {\n              id\n              attributes {\n                name\n                alternativeText\n                caption\n                width\n                height\n                formats\n                hash\n                ext\n                mime\n                size\n                url\n                previewUrl\n                provider\n                provider_metadata\n                createdAt\n                updatedAt\n              }\n            }\n          }\n          createdAt\n          updatedAt\n          publishedAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($username: String!, $email: String!, $password: String!) {\n    register(\n      input: { username: $username, email: $email, password: $password }\n    ) {\n      jwt\n      user {\n        id\n        username\n        email\n        confirmed\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($username: String!, $email: String!, $password: String!) {\n    register(\n      input: { username: $username, email: $email, password: $password }\n    ) {\n      jwt\n      user {\n        id\n        username\n        email\n        confirmed\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;