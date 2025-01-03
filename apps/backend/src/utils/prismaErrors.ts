import { Prisma } from "@prisma/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";

export function handleDatabaseError(error: unknown): never {
	if (error instanceof AppError) {
		// just rethrow the error
		throw error;
	}
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (Object.keys(prismaErrors).includes(error.code)) {
			console.error(error.message);
			throw new AppError(prismaErrors[error.code as keyof typeof prismaErrors]);
		}
		throw new AppError(AppErrorTypes.DatabaseError("Unknown", 500, error.message));
	}
	if (error instanceof Prisma.PrismaClientUnknownRequestError) {
		throw new AppError(AppErrorTypes.DatabaseError("Unknown", 500, error.message));
	}
	if (error instanceof Prisma.PrismaClientInitializationError) {
		throw new AppError(AppErrorTypes.Panic(error.message));
	}
	if (error instanceof Prisma.PrismaClientValidationError) {
		throw new AppError(AppErrorTypes.Panic(error.message));
	}
	if (error instanceof Prisma.PrismaClientRustPanicError) {
		throw new AppError(AppErrorTypes.Panic(error.message));
	}
	throw new AppError(AppErrorTypes.GenericError(String(error)));
}

const prismaErrors = {
	P1000: AppErrorTypes.DatabaseError(
		"AuthenticationFailed",
		401,
		"Authentication failed due to invalid credentials.",
	),
	P1001: AppErrorTypes.DatabaseError(
		"DatabaseServerUnreachable",
		503,
		"The database server is currently unreachable. Please try again later.",
	),
	P1002: AppErrorTypes.DatabaseError(
		"DatabaseServerTimeout",
		504,
		"The database server timed out. Please try again later.",
	),
	P1003: AppErrorTypes.DatabaseError(
		"DatabaseFileNotFound",
		404,
		"The specified database file was not found.",
	),
	P1008: AppErrorTypes.DatabaseError(
		"OperationTimeout",
		408,
		"The operation timed out. Please try again.",
	),
	P1009: AppErrorTypes.DatabaseError("DatabaseAlreadyExists", 409, "The database already exists."),
	P1010: AppErrorTypes.DatabaseError("AccessDenied", 403, "Access to the database was denied."),
	P1011: AppErrorTypes.DatabaseError(
		"TlsConnectionError",
		500,
		"There was an error with the TLS connection.",
	),
	P1012: AppErrorTypes.DatabaseError(
		"SchemaValidationError",
		400,
		"The database schema validation failed.",
	),
	P1013: AppErrorTypes.DatabaseError(
		"InvalidDatabaseString",
		400,
		"The database connection string is invalid.",
	),
	P1014: AppErrorTypes.DatabaseError(
		"UnderlyingModelNotFound",
		404,
		"The underlying model was not found.",
	),
	P1015: AppErrorTypes.DatabaseError(
		"UnsupportedDatabaseFeatures",
		501,
		"The database features are not supported.",
	),
	P1016: AppErrorTypes.DatabaseError(
		"IncorrectNumberOfParameters",
		400,
		"The number of parameters provided is incorrect.",
	),
	P1017: AppErrorTypes.DatabaseError(
		"ServerClosedConnection",
		500,
		"The server closed the connection.",
	),
	P2000: AppErrorTypes.DatabaseError("ValueTooLong", 400, "The value provided is too long."),
	P2001: AppErrorTypes.DatabaseError("NonExistent", 404, "The requested resource does not exist."),
	P2002: AppErrorTypes.DatabaseError(
		"UniqueConstraintViolation",
		409,
		"A unique constraint was violated. Please ensure the value is unique.",
	),
	P2003: AppErrorTypes.DatabaseError(
		"ForeignKeyConstraintViolation",
		409,
		"A foreign key constraint was violated.",
	),
	P2004: AppErrorTypes.DatabaseError(
		"GenericConstraintViolation",
		400,
		"A generic constraint was violated.",
	),
	P2005: AppErrorTypes.DatabaseError(
		"DatatypeConstraintViolation",
		400,
		"A datatype constraint was violated.",
	),
	P2006: AppErrorTypes.DatabaseError("DataInsertFailure", 400, "Failed to insert data."),
	P2007: AppErrorTypes.DatabaseError("DataValidationFailure", 400, "Data validation failed."),
	P2008: AppErrorTypes.DatabaseError("QueryParseError", 400, "The query could not be parsed."),
	P2009: AppErrorTypes.DatabaseError("QueryValidationError", 400, "The query validation failed."),
	P2010: AppErrorTypes.DatabaseError("RawQueryFailed", 400, "The raw query failed."),
	P2011: AppErrorTypes.DatabaseError(
		"NullConstraintViolation",
		400,
		"A null constraint was violated.",
	),
	P2012: AppErrorTypes.DatabaseError("MissingRequiredValue", 400, "A required value is missing."),
	P2013: AppErrorTypes.DatabaseError(
		"MissingRequiredArgument",
		400,
		"A required argument is missing.",
	),
	P2014: AppErrorTypes.DatabaseError(
		"RequiredRelationViolation",
		400,
		"A required relation was violated.",
	),
	P2015: AppErrorTypes.DatabaseError(
		"RelatedRecordNotFound",
		404,
		"A related record was not found.",
	),
	P2016: AppErrorTypes.DatabaseError(
		"QueryInterpretationError",
		400,
		"The query could not be interpreted.",
	),
	P2017: AppErrorTypes.DatabaseError("RelationNotConnected", 400, "The relation is not connected."),
	P2018: AppErrorTypes.DatabaseError(
		"RequiredConnectedRecordsNotFound",
		404,
		"Required connected records were not found.",
	),
	P2019: AppErrorTypes.DatabaseError("InputError", 400, "There was an error with the input."),
	P2020: AppErrorTypes.DatabaseError("ValueOutOfRange", 400, "The value is out of range."),
	P2021: AppErrorTypes.DatabaseError(
		"TableDoesNotExist",
		404,
		"The specified table does not exist.",
	),
	P2022: AppErrorTypes.DatabaseError(
		"ColumnDoesNotExist",
		404,
		"The specified column does not exist.",
	),
	P2023: AppErrorTypes.DatabaseError(
		"InconsistentColumnData",
		400,
		"The column data is inconsistent.",
	),
	P2024: AppErrorTypes.DatabaseError(
		"ConnectionPoolTimeout",
		504,
		"The connection pool timed out.",
	),
	P2025: AppErrorTypes.DatabaseError(
		"OperationFailedDueToMissingRecords",
		400,
		"The operation failed due to missing records.",
	),
	P2026: AppErrorTypes.DatabaseError("UnsupportedFeature", 501, "The feature is not supported."),
	P2027: AppErrorTypes.DatabaseError(
		"MultipleDatabaseErrors",
		500,
		"Multiple database errors occurred.",
	),
	P2028: AppErrorTypes.DatabaseError(
		"TransactionApiError",
		500,
		"There was an error with the transaction API.",
	),
	P2029: AppErrorTypes.DatabaseError(
		"QueryParameterLimitExceeded",
		400,
		"The query parameter limit was exceeded.",
	),
	P2030: AppErrorTypes.DatabaseError(
		"FulltextIndexNotFound",
		400,
		"The fulltext index was not found.",
	),
	P2031: AppErrorTypes.DatabaseError(
		"MongoDbReplicaSetRequired",
		500,
		"A MongoDB replica set is required.",
	),
	P2033: AppErrorTypes.DatabaseError(
		"NumberOutOf64BitRange",
		400,
		"The number is out of the 64-bit range.",
	),
	P2034: AppErrorTypes.DatabaseError(
		"TransactionWriteConflict",
		409,
		"There was a transaction write conflict.",
	),
	P2035: AppErrorTypes.DatabaseError(
		"DatabaseAssertionViolation",
		500,
		"A database assertion was violated.",
	),
	P2036: AppErrorTypes.DatabaseError(
		"ExternalConnectorError",
		500,
		"There was an error with the external connector.",
	),
	P2037: AppErrorTypes.DatabaseError(
		"TooManyDatabaseConnections",
		500,
		"There are too many database connections.",
	),
};
