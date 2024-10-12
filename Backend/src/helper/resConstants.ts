import { Response } from "express"
export enum HttpStatus{
    OK=200,
    COLLISSION=409,
    UNAUTHORIZED=401,
    NOT_FOUND=404,
    CREATED=201,
    NO_CONTENT=204,
    FORBIDDEN=403,
    SERVER_ERROR=500
}

export enum HttpMessage{
    success="success",
    not_found="resource not found",
    unauthorized="Unauthorized",
    user_collission="user already exists",
    server_error="server error occured"
}
//kinda started refactoring have to implement this everwhere
export default function HttpResponse(status:HttpStatus,message:HttpMessage,res:Response){
    return res.status(status).json({message:message})
}