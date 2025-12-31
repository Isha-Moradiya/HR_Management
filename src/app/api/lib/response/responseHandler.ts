import { NextResponse } from "next/server";
import { responseCode } from "./responseCodes";
import { responseBody } from "./responseBody";

export const response = {
    success(data = {}, message?: string) {
        return NextResponse.json(
            responseBody.success(data, message),
            { status: responseCode.success }
        );
    },

    created(data = {}, message = "Created") {
        return NextResponse.json(
            responseBody.success(data, message),
            { status: responseCode.created }
        );
    },

    badRequest(message = "Bad request", data = {}) {
        return NextResponse.json(
            responseBody.badRequest(message, data),
            { status: responseCode.badRequest }
        );
    },

    validationError(errors = {}, message = "Validation error") {
        return NextResponse.json(
            responseBody.validationError(message, errors),
            { status: responseCode.validationError }
        );
    },

    unAuthorized(message = "Unauthorized") {
        return NextResponse.json(
            responseBody.unAuthorized(message),
            { status: responseCode.unAuthorized }
        );
    },

    notFound(message = "Record not found") {
        return NextResponse.json(
            responseBody.recordNotFound(message),
            { status: responseCode.notFound }
        );
    },

    internalServerError(message = "Internal server error") {
        return NextResponse.json(
            responseBody.internalServerError(message),
            { status: responseCode.internalServerError }
        );
    },
};
