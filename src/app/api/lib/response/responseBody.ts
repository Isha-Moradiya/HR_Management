export const responseBody = {
    success: (data: any = {}, message = "Success") => ({
        success: true,
        message,
        data,
    }),

    failure: (message = "Failure", data: any = {}) => ({
        success: false,
        message,
        data,
    }),

    badRequest: (message = "Bad request", data: any = {}) => ({
        success: false,
        message,
        data,
    }),

    validationError: (message = "Validation error", data: any = {}) => ({
        success: false,
        message,
        errors: data,
    }),

    unAuthorized: (message = "Unauthorized") => ({
        success: false,
        message,
    }),

    recordNotFound: (message = "Record not found") => ({
        success: false,
        message,
    }),

    internalServerError: (message = "Internal server error") => ({
        success: false,
        message,
    }),
};
